import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

import ProgressPrompt from './ProgressPrompt'
import TopButton from './TopButton'
import { Spinner, mediaQueries } from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE, ZINDEX_POPOVER } from '../../constants'

import { withProgressApi } from './api'

const MAX_POLL_RETRIES = 3
const SCROLLED_AWAY_PX = 200

const styles = {
  spinner: css({
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    top: HEADER_HEIGHT_MOBILE,
    zIndex: ZINDEX_POPOVER,
    background: '#fff',
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT
    }
  })
}

class Progress extends Component {
  constructor (props) {
    super(props)

    this.state = {
      progressInitStarted: false,
      initialized: false,
      progressElementIndex: 0,
      pollRetries: 0,
      mediaProgress: undefined
    }

    this.isTrackingAllowed = () => {
      const { myProgressConsent } = this.props
      return myProgressConsent && myProgressConsent.hasConsentedTo === true
    }

    this.containerRef = ref => {
      this.container = ref
    }

    this.mobile = () => window.innerWidth < mediaQueries.mBreakPoint

    this.headerHeight = () =>
      this.mobile()
        ? HEADER_HEIGHT_MOBILE
        : HEADER_HEIGHT

    this.initialize = (article) => {
      const { userProgress, embeds, meta } = article
      this.poll(userProgress)

      const audioSource = meta ? meta.audioSource : undefined
      if (embeds || audioSource) {
        let mediaProgress = {}
        embeds.map(embed => {
          if (embed.userProgress) {
            mediaProgress[embed.mediaId] = embed.userProgress.secs
          }
        })
        if (audioSource &&
          audioSource.mediaId &&
          audioSource.userProgress &&
          audioSource.userProgress.secs
        ) {
          mediaProgress[audioSource.mediaId] = audioSource.userProgress.secs
        }
        this.setState({ mediaProgress })
      }
    }

    this.poll = (userProgress, pollDom) => {
      if (!userProgress || !this.props.pollDom) {
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

    this.onScroll = () => {
      const { isMember, article } = this.props
      if (isMember && article) {
        this.saveProgress(article.id)
      }
      this.maybeHideTopButton()
    }

    this.scrollToTop = () => {
      window.scrollTo(0, 0)
      this.setState({ topButtonAnimateOut: true })
    }

    this.maybeHideTopButton = throttle(() => {
      const {
        initialized,
        initialPageYOffset,
        showTopButton,
        topButtonAnimateOut
      } = this.state
      if (topButtonAnimateOut || !showTopButton || !initialized || !initialPageYOffset) {
        return
      }
      const y = window.pageYOffset
      const hasScrolledAway = Math.abs(y - initialPageYOffset) > SCROLLED_AWAY_PX
      if (hasScrolledAway) {
        this.setState({ topButtonAnimateOut: true })
      }
    }, 500)

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
      if (!this.isTrackingAllowed() || !this.state.initialized) {
        return
      }
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
            this.setState({
              initialized: true,
              showTopButton: true,
              initialPageYOffset: window.pageYOffset
            })
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
            this.setState({
              initialized: true,
              showTopButton: true,
              initialPageYOffset: window.pageYOffset
            })
          }, 0)
        }, 100)
      }
    }

    this.saveMediaProgress = (mediaId, currentTime) => {
      if (!this.isTrackingAllowed() || !this.state.initialized) {
        return
      }
      this.saveMediaProgressNotPlaying(mediaId, currentTime)
      this.saveMediaProgressWhilePlaying(mediaId, currentTime)
    }

    this.saveMediaProgressNotPlaying = debounce((mediaId, currentTime) => {
      // Fires on pause, on scrub, on end of video.
      this.props.upsertMediaProgress(mediaId, currentTime)
    }, 300)

    this.saveMediaProgressWhilePlaying = throttle((mediaId, currentTime) => {
      // Fires every 5 seconds while playing.
      this.props.upsertMediaProgress(mediaId, currentTime)
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

  initializeProgress () {
    const { progressInitStarted } = this.state
    if (progressInitStarted || !this.isTrackingAllowed()) {
      return
    }
    const { article, isMember } = this.props
    if (isMember && article) {
      this.setState({ progressInitStarted: true })
      this.initialize(article)
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.measure)
    window.addEventListener('scroll', this.onScroll)
    this.measure()
    this.initializeProgress()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.measure)
    window.removeEventListener('scroll', this.onScroll)
  }

  componentDidUpdate () {
    this.measure()
    this.initializeProgress()
  }

  render () {
    const { initialized, width, percentage, pageYOffset, showTopButton, topButtonAnimateOut } = this.state
    const { children, myProgressConsent, revokeConsent, submitConsent, pollDom } = this.props
    const showConsentPrompt = myProgressConsent && myProgressConsent.hasConsentedTo === null
    const consentRejected = myProgressConsent && myProgressConsent.hasConsentedTo === false

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

    return (
      <div ref={this.containerRef}>
        {!initialized && !consentRejected && !showConsentPrompt && pollDom && (
          <div {...styles.spinner}>
            <Spinner />
          </div>
        )}
        {progressPrompt}
        {children}
        {showTopButton && (
          <TopButton onClick={this.scrollToTop} animateOut={topButtonAnimateOut} />
        )}
        <div style={{ position: 'fixed', bottom: 0, color: '#fff', left: 0, right: 0, background: 'rgba(0, 0, 0, .7)', padding: '3px 10px' }}>
          <p>width: {width} – pageYOffset: {pageYOffset} - Percent {percentage}</p>
        </div>
      </div>
    )
  }
}

Progress.propTypes = {
  children: PropTypes.object,
  myProgressConsent: PropTypes.shape({
    hasConsentedTo: PropTypes.bool
  }),
  revokeConsent: PropTypes.func,
  submitConsent: PropTypes.func,
  pollDom: PropTypes.bool
}

Progress.defaultProps = {
  pollDom: true
}

Progress.childContextTypes = {
  getMediaProgress: PropTypes.func,
  saveMediaProgress: PropTypes.func
}

export default withProgressApi(Progress)
