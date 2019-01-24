import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'

import ProgressPrompt from './ProgressPrompt'
import {
  mediaQueries
} from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

const MAX_POLL_RETRIES = 3

export const userProgressFragment = `
  fragment UserProgressOnDocument on Document {
    userProgress {
      id
      percentage
      nodeId
      createdAt
      updatedAt
    }
  }
`

const upsertMutation = gql`
  mutation upsertDocumentProgress(
    $documentId: ID!
    $percentage: Float!
    $nodeId: String!
  ) {
    upsertDocumentProgress(documentId: $documentId, percentage: $percentage, nodeId: $nodeId) {
      id
      document {
        id
        ...UserProgressOnDocument
      }
    }
  }
  ${userProgressFragment}
`

export const userConsentFragment = `
  fragment Consent on User {
    hasConsentedTo(name: "PROGRESS")
  }
`

const consentQuery = gql`
  query myProgressConsent {
    myProgressConsent: me {
      id
      ...Consent
    }
  }
  ${userConsentFragment}
`

const submitConsentMutation = gql`
  mutation submitConsent {
    submitConsent(name: "PROGRESS") {
      id
      ...Consent
    }
  }
  ${userConsentFragment}
`

const revokeConsentMutation = gql`
  mutation revokeConsent {
    revokeConsent(name: "PROGRESS") {
      id
      ...Consent
    }
  }
  ${userConsentFragment}
`

const withReadingProgress = WrappedComponent => {
  return compose(
    graphql(consentQuery, {
      props: ({ data, errors }) => ({
        data,
        loading: data.loading || !data.myProgressConsent,
        error: data.error,
        myProgressConsent: data.loading
          ? undefined
          : data.myProgressConsent
      })
    }),
    graphql(submitConsentMutation, {
      props: ({ mutate }) => ({
        submitConsent: () =>
          mutate()
      })
    }),
    graphql(revokeConsentMutation, {
      props: ({ mutate }) => ({
        revokeConsent: () =>
          mutate()
      })
    }),
    graphql(upsertMutation, {
      props: ({ mutate }) => ({
        upsertDocumentProgress: (documentId, percentage, nodeId) =>
          mutate({
            variables: {
              documentId,
              percentage,
              nodeId
            }
          })
      })
    })
  )(
    class extends Component {
      constructor (props) {
        super(props)

        this.state = {
          initialized: false,
          progressElementIndex: 0,
          pollRetries: 0
        }

        this.containerRef = ref => {
          this.container = ref
        }

        this.headerHeight = () =>
          window.innerWidth < mediaQueries.mBreakPoint
            ? HEADER_HEIGHT_MOBILE
            : HEADER_HEIGHT

        this.initialize = (userProgress) => {
          this.poll(userProgress)
        }

        this.poll = (userProgress) => {
          if (!userProgress) {
            this.setState({ initialized: true })
            return
          }
          const progressElements = this.getProgressElements()
          const { pollRetries } = this.state
          if (pollRetries > MAX_POLL_RETRIES) {
            return
          }
          if (progressElements && progressElements.length) {
            const { percentage, nodeId } = userProgress
            this.restoreProgress(percentage, nodeId)
          } else {
            const newPollRetries = pollRetries + 1
            this.setState({ pollRetries: newPollRetries }, () => {
              setTimeout(() => {
                this.poll(userProgress)
              }, 300 * newPollRetries)
            })
          }
        }

        this.measure = () => {
          if (this.container) {
            const { width, height, top } = this.container.getBoundingClientRect()
            const cleanWidth = Math.min(width, 695)
            if (cleanWidth !== this.state.width || height !== this.state.height || top !== this.state.top) {
              this.setState({ width: cleanWidth, height, top })
            }
          }
        }

        this.measureProgress = (downwards = true) => {
          const progressElements = this.getProgressElements()
          if (!progressElements) {
            return
          }
          const fallbackIndex = downwards ? 0 : progressElements.length - 1
          const progressElementIndex = this.state.progressElementIndex || fallbackIndex

          const mobile = window.innerWidth < mediaQueries.mBreakPoint
          const headerHeight = mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT

          let progressElement, nextIndex
          if (downwards) {
            for (let i = progressElementIndex; i < progressElements.length; i++) {
              progressElement = progressElements[i]
              const { top, height } = progressElement.getBoundingClientRect()
              if (i === 0 && top > window.innerHeight) {
                break
              }
              const fillsHeight = top < headerHeight && headerHeight + top + height > window.innerHeight
              if (top > headerHeight || fillsHeight) {
                console.log('found downwards', progressElement)
                nextIndex = i
                break
              }
            }
          } else {
            // search upwards.
            for (let i = progressElementIndex; i > -1; i--) {
              progressElement = progressElements[i]
              if (i === 0) {
                console.log('found upwards', progressElement)
                break
              }
              const { top } = progressElement.getBoundingClientRect()
              if (top < headerHeight) {
                progressElement = progressElements[i + 1]
                nextIndex = i + 1
                console.log('found upwards', progressElement)
                break
              } else {
                progressElement = undefined
              }
            }
          }
          this.setState({
            progressElementIndex: nextIndex
          })
          return {
            nodeId: progressElement && progressElement.getAttribute('data-pos'),
            percentage: this.getPercentage()
          }
        }

        this.getProgressElements = () => {
          const progressElements = this.container
            ? [...this.container.querySelectorAll('[data-pos]')]
            : []
          return progressElements
        }

        this.getPercentage = () => {
          const { height, top } = this.container.getBoundingClientRect()
          const yFromArticleTop = Math.max(
            0,
            -top + this.headerHeight()
          )
          const ratio = yFromArticleTop / height
          const percentage = ratio === 0
            ? 0
            : (-top + window.innerHeight) > height
              ? 1
              : ratio
          this.setState({ percentage })
          return percentage
        }

        this.saveProgress = debounce((documentId) => {
          const y = window.pageYOffset
          const downwards = this.state.pageYOffset === undefined || y > this.state.pageYOffset

          if (y !== this.state.pageYOffset) {
            this.setState({ pageYOffset: y }, () => {
              // We only persist progress for a downward scroll, but we still measure
              // an upward scroll to keep track of the current reading position.
              const progress = this.measureProgress(downwards)
              if (downwards && progress && progress.nodeId && progress.percentage > 0) {
                this.props.upsertDocumentProgress(documentId, progress.percentage, progress.nodeId)
              }
            })
          }
        }, 300)

        this.restoreProgress = (percentage, nodeId) => {
          const { myProgressConsent } = this.props
          if (!myProgressConsent || !myProgressConsent.hasConsentedTo) {
            return
          }
          if (window && 'scrollRestoration' in window.history) {
            // turn off browser's interfering scroll restoration.
            window.history.scrollRestoration = 'manual'
          }

          const mobile = window.innerWidth < mediaQueries.mBreakPoint
          const progressElements = this.getProgressElements()
          const progressElement = progressElements.find((element, index) => {
            if (element.getAttribute('data-pos') === nodeId) {
              this.setState({
                progressElementIndex: index
              })
              return true
            }
            return false
          })

          if (progressElement) {
            setTimeout(() => {
              const { top } = progressElement.getBoundingClientRect()
              window.scrollTo(0, top - HEADER_HEIGHT - (mobile ? 50 : 80))
              setTimeout(() => {
                this.setState({ initialized: true })
              }, 0)
            }, 100)
            return
          }
          if (percentage) {
            console.log('restored by percentage', percentage)
            const { height } = this.container.getBoundingClientRect()
            const offset = (percentage * height) - this.headerHeight()
            setTimeout(() => {
              window.scrollTo(0, offset)
              setTimeout(() => {
                this.setState({ initialized: true })
              }, 0)
            }, 100)
          }
        }
      }

      componentDidMount () {
        window.addEventListener('resize', this.measure)
        this.measure()
      }

      componentWillUnmount () {
        window.removeEventListener('resize', this.measure)
      }

      componentDidUpdate () {
        this.measure()
      }

      render () {
        const { initialized, width, percentage, pageYOffset } = this.state
        const { myProgressConsent, revokeConsent, submitConsent } = this.props
        const isTrackingAllowed = myProgressConsent && myProgressConsent.hasConsentedTo === true
        const showConsentPrompt = myProgressConsent && myProgressConsent.hasConsentedTo === null
        const progressPrompt = showConsentPrompt
          ? (
            <ProgressPrompt
              onSubmitConsent={submitConsent}
              onRevokeConsent={revokeConsent}
            />
          )
          : null

        return <Fragment>
          <WrappedComponent
            progressArticleRef={this.containerRef}
            saveProgress={isTrackingAllowed && initialized ? this.saveProgress : undefined}
            initializeProgress={this.initialize}
            progressPrompt={progressPrompt}
            {...this.props} />
          <div style={{ position: 'fixed', bottom: 0, color: '#fff', left: 0, right: 0, background: 'rgba(0, 0, 0, .7)', padding: 10 }}>
            <p>width: {width} – pageYOffset: {pageYOffset} - Percent {percentage}</p>
          </div>
        </Fragment>
      }
    })
}

export default withReadingProgress
