import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

import ProgressPrompt from './ProgressPrompt'
import { mediaQueries } from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'
import { scrollIt } from '../../../lib/utils/scroll'

import { withProgressApi, mediaProgressQuery } from './api'

class Progress extends Component {
  constructor (props) {
    super(props)

    this.state = {
      progressElementIndex: 0
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

    this.onScroll = () => {
      const { isMember, article } = this.props
      if (isMember && article) {
        this.saveProgress(article.id)
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
      if (!progressElements.length) {
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
            this.props.debug && console.log('found downwards', progressElement)
            nextIndex = i
            break
          }
        }
      } else {
        // search upwards.
        for (let i = progressElementIndex; i > -1; i--) {
          progressElement = progressElements[i]
          if (i === 0) {
            this.props.debug && console.log('found upwards', progressElement)
            break
          }
          const top = progressElement && progressElement.getBoundingClientRect().top
          if (top < headerHeight) {
            progressElement = progressElements[i + 1]
            nextIndex = i + 1
            this.props.debug && console.log('found upwards', progressElement)
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
        percentage: this.getPercentage(),
        elementIndex: nextIndex
      }
    }

    this.getProgressElements = () => {
      const progressElements = this.container
        ? Array.from(this.container.querySelectorAll('[data-pos]'))
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
      if (!this.isTrackingAllowed()) {
        return
      }
      const y = window.pageYOffset
      const downwards = this.state.pageYOffset === undefined || y > this.state.pageYOffset

      if (y !== this.state.pageYOffset) {
        this.setState({ pageYOffset: y }, () => {
          // We only persist progress for a downward scroll, but we still measure
          // an upward scroll to keep track of the current reading position.
          const progress = this.measureProgress(downwards)
          const storedUserProgress = this.props.article && this.props.article.userProgress
          if (
            downwards &&
            progress &&
            progress.nodeId &&
            progress.percentage > 0 &&
            progress.elementIndex > 1 && // ignore first two elements.
            (!storedUserProgress || storedUserProgress.nodeId !== progress.nodeId)
          ) {
            this.props.upsertDocumentProgress(documentId, progress.percentage, progress.nodeId)
          }
        })
      }
    }, 300)

    this.resetDocumentProgress = () => {
      const { article } = this.props
      article && this.props.upsertDocumentProgress(article.id, 0, '')
    }

    this.restoreArticleProgress = () => {
      const { article } = this.props
      const { userProgress } = article
      const { percentage, nodeId } = userProgress

      const headerHeight = this.headerHeight()
      const progressElements = this.getProgressElements()
      const progressElement = !!nodeId && progressElements.find((element, index) => {
        if (element.getAttribute('data-pos') === nodeId) {
          this.setState({
            progressElementIndex: index
          })
          return true
        }
        return false
      })

      if (progressElement) {
        const { top } = progressElement.getBoundingClientRect()
        const isInViewport = top - headerHeight > 0 && top < window.innerHeight
        // We don't scroll on mobile if the element of interest is already in viewport
        // This may happen on swipe navigation in iPhone X.
        if (!this.mobile() || !isInViewport) {
          scrollIt(top - headerHeight - (this.mobile() ? 50 : 80), 400)
        }
        return
      }
      if (percentage) {
        const { height } = this.container.getBoundingClientRect()
        const offset = (percentage * height) - headerHeight

        scrollIt(offset, 400)
      }
    }

    this.saveMediaProgress = ({ mediaId }, mediaElement) => {
      if (!mediaId || !this.isTrackingAllowed() || !this.state.initialized) {
        return
      }
      this.saveMediaProgressNotPlaying(mediaId, mediaElement.currentTime)
      this.saveMediaProgressWhilePlaying(mediaId, mediaElement.currentTime)
    }

    this.saveMediaProgressNotPlaying = debounce((mediaId, currentTime) => {
      // Fires on pause, on scrub, on end of video.
      this.props.upsertMediaProgress(mediaId, currentTime)
    }, 300)

    this.saveMediaProgressWhilePlaying = throttle((mediaId, currentTime) => {
      // Fires every 5 seconds while playing.
      this.props.upsertMediaProgress(mediaId, currentTime)
    }, 5000, { trailing: true })

    this.getMediaProgress = ({ mediaId, durationMs } = {}) => {
      if (!mediaId) {
        return Promise.resolve()
      }
      return this.props.client.query({
        query: mediaProgressQuery,
        variables: { mediaId },
        fetchPolicy: 'network-only'
      }).then(({ data: { mediaProgress: { secs } } = {} }) => {
        if (secs) {
          if (durationMs && Math.round(secs) === Math.round(durationMs / 1000)) {
            return
          }
          return secs - 2
        }
      })
    }

    this.getChildContext = () => ({
      getMediaProgress: this.getMediaProgress,
      saveMediaProgress: this.saveMediaProgress,
      restoreArticleProgress: this.restoreArticleProgress
    })
  }

  componentDidMount () {
    window.addEventListener('resize', this.measure)
    window.addEventListener('scroll', this.onScroll)
    this.measure()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.measure)
    window.removeEventListener('scroll', this.onScroll)
  }

  componentDidUpdate () {
    this.measure()
  }

  render () {
    const { width, percentage, pageYOffset } = this.state
    const {
      children,
      myProgressConsent,
      revokeConsent,
      submitConsent,
      isArticle,
      debug // TODO: remove before public progress launch.
    } = this.props

    const showConsentPrompt = myProgressConsent && myProgressConsent.hasConsentedTo === null

    const progressPrompt = showConsentPrompt && isArticle
      ? (
        <ProgressPrompt
          onSubmitConsent={() => {
            submitConsent()
          }}
          onRevokeConsent={revokeConsent}
        />
      )
      : null

    return (
      <div ref={this.containerRef}>
        {progressPrompt}
        {children}
        {debug && (
          <div style={{ position: 'fixed', bottom: 0, color: '#fff', left: 0, right: 0, background: 'rgba(0, 0, 0, .7)', padding: '3px 10px' }}>
            <p>width: {width} – pageYOffset: {pageYOffset} - Percent {percentage}</p>
          </div>
        )}
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
  isArticle: PropTypes.bool
}

Progress.defaultProps = {
  isArticle: true
}

Progress.childContextTypes = {
  getMediaProgress: PropTypes.func,
  saveMediaProgress: PropTypes.func,
  restoreArticleProgress: PropTypes.func
}

export default compose(
  withProgressApi
)(Progress)
