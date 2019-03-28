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
import RestoreButton from './RestoreButton'

const MIN_INDEX = 2
const RESTORE_AREA = 0
const RESTORE_FADE_AREA = 200

class Progress extends Component {
  constructor (props) {
    super(props)

    this.state = {
      restore: true,
      restoreOpacity: 1
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

      const y = window.pageYOffset
      const downwards = this.lastY === undefined || y > this.lastY
      if (isMember && article) {
        this.saveProgress(article.id, downwards)
        if (this.state.restore) {
          const restoreOpacity = 1 - Math.min(
            1,
            Math.max(0, y - RESTORE_AREA) / RESTORE_FADE_AREA
          )
          if (restoreOpacity !== this.state.restoreOpacity) {
            this.setState({ restoreOpacity })
          }
        }
      }
      this.lastY = y
    }

    this.saveProgress = debounce((documentId, downwards) => {
      if (!this.isTrackingAllowed()) {
        return
      }

      // We only persist progress for a downward scroll, but we still measure
      // an upward scroll to keep track of the current reading position.
      const progress = this.measureProgress(downwards)
      const storedUserProgress = this.props.article && this.props.article.userProgress
      if (
        downwards &&
        progress &&
        progress.nodeId &&
        progress.percentage > 0 &&
        progress.elementIndex >= MIN_INDEX && // ignore first two elements.
        (!storedUserProgress || storedUserProgress.nodeId !== progress.nodeId)
      ) {
        this.props.upsertDocumentProgress(
          documentId,
          progress.percentage,
          progress.nodeId
        )
      }
    }, 300)

    this.measureProgress = (downwards = true) => {
      const progressElements = this.getProgressElements()
      if (!progressElements.length) {
        return
      }
      const fallbackIndex = downwards ? 0 : progressElements.length - 1
      const progressElementIndex = this.lastElementIndex || fallbackIndex
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
            nextIndex = i
            break
          }
        }
      } else {
        // search upwards.
        for (let i = progressElementIndex; i > -1; i--) {
          progressElement = progressElements[i]
          if (i === 0) {
            break
          }
          const top = progressElement && progressElement.getBoundingClientRect().top
          if (top < headerHeight) {
            progressElement = progressElements[i + 1]
            nextIndex = i + 1
            break
          } else {
            progressElement = undefined
          }
        }
      }
      this.lastElementIndex = nextIndex

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
      return percentage
    }

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
      if (!mediaId || !this.isTrackingAllowed()) {
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
      saveMediaProgress: this.saveMediaProgress
    })
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    this.onScroll()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  }

  componentDidUpdate () {
  }

  render () {
    const { restore, restoreOpacity } = this.state
    const {
      children,
      myProgressConsent,
      revokeConsent,
      submitConsent,
      article,
      isArticle
    } = this.props

    const showConsentPrompt = isArticle && myProgressConsent && myProgressConsent.hasConsentedTo === null

    const progressPrompt = showConsentPrompt && (
      <ProgressPrompt
        onSubmitConsent={() => {
          submitConsent()
        }}
        onRevokeConsent={revokeConsent}
      />
    )

    const showRestore = (
      isArticle &&
      restore &&
      restoreOpacity !== 0 &&
      article.userProgress &&
      article.userProgress.percentage &&
      article.userProgress.percentage !== 1
    )

    return (
      <div ref={this.containerRef}>
        {progressPrompt || null}
        {children}
        {showRestore &&
          <RestoreButton
            onClick={this.restoreArticleProgress}
            opacity={restoreOpacity}
            userProgress={article.userProgress} />}
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
  saveMediaProgress: PropTypes.func
}

export default compose(
  withProgressApi
)(Progress)
