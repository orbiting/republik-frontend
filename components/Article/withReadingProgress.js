import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'

import {
  mediaQueries
} from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

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
    $percentage: Int!
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

const withReadingProgress = WrappedComponent => {
  return compose(
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
          progressElements: null,
          progressElementIndex: 0,
          pollIndex: 0
        }

        this.containerRef = ref => {
          this.container = ref
        }

        this.headerHeight = () =>
          window.innerWidth < mediaQueries.mBreakPoint
            ? HEADER_HEIGHT_MOBILE
            : HEADER_HEIGHT

        this.initializeProgress = (userProgress) =>
          new Promise((resolve, reject) => {
            this.wait(resolve, userProgress)
          })

        this.wait = (resolve, userProgress) => {
          if (!userProgress) {
            resolve()
            return
          }
          const progressElements = this.getProgressElements()
          const { pollIndex } = this.state
          if (pollIndex > 2) {
            resolve()
            return
          }
          if (progressElements && progressElements.length) {
            const { percentage, nodeId } = userProgress
            this.restoreProgress(resolve, percentage, nodeId)
            resolve()
          } else {
            this.setState({ pollIndex: pollIndex + 1 }, () => {
              setTimeout(() => {
                this.wait(resolve, userProgress)
              }, 500)
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
          const progressElementIndex = this.state.progressElementIndex || (downwards ? 0 : progressElements.length - 1)

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
                console.log('found upwards', progressElement, nextIndex)
                break
              }
              const { top } = progressElement.getBoundingClientRect()
              if (top < headerHeight) {
                progressElement = progressElements[i + 1]
                nextIndex = i + 1
                console.log('found upwards', progressElement, nextIndex)
                break
              } else {
                progressElement = undefined
              }
            }
          }
          this.setState({
            progressElement: progressElement !== undefined ? progressElement : null,
            progressElementIndex: nextIndex !== undefined ? nextIndex : 0
          })
          return {
            nodeId: progressElement && progressElement.id,
            percentage: this.getPercentage()
          }
        }

        this.getProgressElements = () => {
          if (this.state.progressElements && this.state.progressElements.length > 0) {
            return this.state.progressElements
          }
          const progressElements = this.container
            ? [...this.container.getElementsByClassName('pos')]
            : []
          this.setState({ progressElements })
          return progressElements
        }

        this.getPercentage = () => {
          const { height, top } = this.container.getBoundingClientRect()
          const yFromArticleTop = Math.max(
            0,
            window.pageYOffset -
            (top + window.pageYOffset - this.headerHeight())
          )
          const ratio = yFromArticleTop / height
          const percentage = ratio === 0
            ? 0
            : Math.min(100, Math.ceil((yFromArticleTop + window.innerHeight) / height * 100))
          this.setState({ percentage })
          return percentage
        }

        this.saveProgress = debounce((documentId) => {
          const y = window.pageYOffset
          const downwards = this.state.pageYOffset === undefined || y > this.state.pageYOffset

          if (y !== this.state.pageYOffset) {
            this.setState({ pageYOffset: y }, () => {
              const progress = this.measureProgress(downwards)
              progress && progress.nodeId && this.props.upsertDocumentProgress(documentId, progress.percentage, progress.nodeId)
            })
          }
        }, 300)

        this.restoreProgress = (resolve, percentage, nodeId) => {
          const { mobile } = this.state

          const progressElements = this.getProgressElements()
          const progressElement = progressElements.find((element, index) => {
            return element.id === nodeId
          })
          if (progressElement) {
            setTimeout(() => {
              const { top } = progressElement.getBoundingClientRect()
              window.scrollTo(0, top - HEADER_HEIGHT - (mobile ? 20 : 50))
              this.measureProgress()
              resolve()
            }, 0)
            return
          }
          if (percentage) {
            const offset = (percentage / 100 * this.state.height) + HEADER_HEIGHT
            window.scrollTo(0, offset)
            resolve()
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
        const { width, percentage, pageYOffset } = this.state
        return <Fragment>
          <WrappedComponent
            progressArticleRef={this.containerRef}
            saveProgress={this.saveProgress}
            initializeProgress={this.initializeProgress}
            {...this.props} />
          <div style={{ position: 'fixed', bottom: 0, color: '#fff', left: 0, right: 0, background: 'rgba(0, 0, 0, .7)', padding: 10 }}>
            <p>width: {width} – pageYOffset: {pageYOffset} - Percent {percentage}</p>
          </div>
        </Fragment>
      }
    })
}

export default withReadingProgress
