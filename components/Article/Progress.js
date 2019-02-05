import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

import ProgressPrompt from './ProgressPrompt'
import { mediaQueries } from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

const MAX_POLL_RETRIES = 3

class Progress extends Component {
  constructor (props) {
    super(props)

    this.state = {
      initialized: false,
      progressElementIndex: 0,
      pollRetries: 0,
      mediaProgress: undefined
    }

    this.containerRef = ref => {
      this.container = ref
    }

    this.mobile = () => window.innerWidth < mediaQueries.mBreakPoint

    this.headerHeight = () =>
      this.mobile()
        ? HEADER_HEIGHT_MOBILE
        : HEADER_HEIGHT

    this.initialize = (userProgress, embeds) => {
      this.poll(userProgress)
      if (embeds) {
        let mediaProgress = {}
        embeds.map(embed => { mediaProgress[embed.mediaId] = embed.userProgress.ms })
        this.setState({ mediaProgress })
      }
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
      const headerHeight = this.headerHeight()

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

      const headerHeight = this.headerHeight()
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
          window.scrollTo(0, top - headerHeight - (this.mobile() ? 50 : 80))
          setTimeout(() => {
            this.setState({ initialized: true })
          }, 0)
        }, 100)
        return
      }
      if (percentage) {
        const { height } = this.container.getBoundingClientRect()
        const offset = (percentage * height) - headerHeight
        setTimeout(() => {
          window.scrollTo(0, offset)
          setTimeout(() => {
            this.setState({ initialized: true })
          }, 0)
        }, 100)
      }
    }

    this.saveMediaProgress = (mediaId, currentTime) => {
      this.saveMediaProgressNotPlaying(mediaId, currentTime)
      this.saveMediaProgressWhilePlaying(mediaId, currentTime)
    }

    // TODO: remove conversion once backend supports seconds/float.
    this.saveMediaProgressNotPlaying = debounce((mediaId, currentTime) => {
      // Fires on pause, on scrub, on end of video.
      this.props.upsertMediaProgress(mediaId, Math.floor(currentTime * 1000))
    }, 300)

    this.saveMediaProgressWhilePlaying = throttle((mediaId, currentTime) => {
      // Fires every 5 seconds while playing.
      this.props.upsertMediaProgress(mediaId, Math.floor(currentTime * 1000))
    }, 5000, { 'trailing': false })

    this.getMediaProgress = (mediaId) => {
      const { mediaProgress } = this.state
      return mediaProgress ? mediaProgress[mediaId] : undefined
    }

    this.getChildContext = () => ({
      getMediaProgress: this.getMediaProgress,
      saveMediaProgress: this.saveMediaProgress
    })
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
    const { myProgressConsent, revokeConsent, submitConsent, WrappedComponent } = this.props
    const isTrackingAllowed = myProgressConsent && myProgressConsent.hasConsentedTo === true
    const showConsentPrompt = myProgressConsent && myProgressConsent.hasConsentedTo === null
    const progressPrompt = showConsentPrompt
      ? (
        <ProgressPrompt
          onSubmitConsent={() => {
            submitConsent()
            this.setState({ initialized: true })
          }}
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
}

Progress.childContextTypes = {
  getMediaProgress: PropTypes.func,
  saveMediaProgress: PropTypes.func
}

export default Progress
