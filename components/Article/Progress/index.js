import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, withApollo } from 'react-apollo'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { withRouter } from 'next/router'

import ProgressPrompt from './ProgressPrompt'
import { mediaQueries } from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'
import { scrollIt } from '../../../lib/utils/scroll'
import withMe from '../../../lib/apollo/withMe'
import { PROGRESS_EXPLAINER_PATH } from '../../../lib/constants'

import { withProgressApi, mediaProgressQuery } from './api'
import RestoreButton from './RestoreButton'

const MIN_INDEX = 2
const RESTORE_AREA = 0
const RESTORE_FADE_AREA = 200
const RESTORE_MIN = 0.4

class Progress extends Component {
  constructor(props) {
    super(props)

    this.state = {
      restore: true,
      restoreOpacity: 1
    }

    this.isTrackingAllowed = () => {
      const { me } = this.props
      return me && me.progressConsent === true
    }

    this.containerRef = ref => {
      this.container = ref
    }

    this.mobile = () => window.innerWidth < mediaQueries.mBreakPoint

    this.headerHeight = () => {
      const mobile = this.mobile()
      let height = mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT
      return height
    }

    this.onScroll = () => {
      this.saveProgress()
      if (this.state.restore) {
        const y = window.pageYOffset

        const restoreOpacity =
          1 -
          Math.min(
            1,
            Math.max(RESTORE_MIN, y - RESTORE_AREA) / RESTORE_FADE_AREA
          )
        if (restoreOpacity !== this.state.restoreOpacity) {
          this.setState({ restoreOpacity })
        }
      }
    }

    this.saveProgress = debounce(() => {
      const { article } = this.props
      if (!article || !this.isTrackingAllowed()) {
        return
      }

      // measure between debounced calls
      // - to handle bouncy upwards scroll on iOS
      //   e.g. y200 -> y250 in onScroll -> bounce back to y210
      const y = window.pageYOffset
      const downwards = this.lastY === undefined || y > this.lastY
      this.lastY = y

      if (!downwards) {
        return
      }
      const element = this.getClosestElement()
      const percentage = this.getPercentage()

      if (
        element &&
        element.nodeId &&
        percentage > 0 &&
        // ignore elements until min index
        element.index >= MIN_INDEX &&
        (!article.userProgress ||
          article.userProgress.nodeId !== element.nodeId ||
          Math.floor(article.userProgress.percentage * 100) !==
            Math.floor(percentage * 100))
      ) {
        this.props.upsertDocumentProgress(
          article.id,
          percentage,
          element.nodeId
        )
      }
    }, 300)

    this.getClosestElement = () => {
      const progressElements = this.getProgressElements()
      if (!progressElements.length) {
        return
      }

      const headerHeight = this.headerHeight()
      const getDistanceForIndex = index => {
        return Math.abs(
          progressElements[index].getBoundingClientRect().top - headerHeight
        )
      }

      let closestIndex =
        (progressElements[this.lastClosestIndex] && this.lastClosestIndex) || 0
      let closestDistance = getDistanceForIndex(closestIndex)

      const length = progressElements.length
      for (let i = closestIndex + 1; i < length; i += 1) {
        const distance = getDistanceForIndex(i)
        if (distance > closestDistance) {
          break
        }
        closestDistance = distance
        closestIndex = i
      }
      for (let i = closestIndex - 1; i >= 0; i -= 1) {
        const distance = getDistanceForIndex(i)
        if (distance > closestDistance) {
          break
        }
        closestDistance = distance
        closestIndex = i
      }

      this.lastClosestIndex = closestIndex

      return {
        nodeId: progressElements[closestIndex].getAttribute('data-pos'),
        index: closestIndex
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
      const yFromArticleTop = Math.max(0, -top + this.headerHeight())
      const ratio = yFromArticleTop / height
      const percentage =
        ratio === 0 ? 0 : -top + window.innerHeight > height ? 1 : ratio
      return percentage
    }

    this.restoreArticleProgress = () => {
      const { article } = this.props
      const { userProgress } = article
      const { percentage, nodeId } = userProgress

      const headerHeight = this.headerHeight()
      const progressElements = this.getProgressElements()
      const progressElement =
        !!nodeId &&
        progressElements.find((element, index) => {
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
          scrollIt(top - headerHeight - (this.mobile() ? 10 : 20), 400)
        }
        return
      }
      if (percentage) {
        const { height } = this.container.getBoundingClientRect()
        const offset = percentage * height - headerHeight

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

    this.saveMediaProgressWhilePlaying = throttle(
      (mediaId, currentTime) => {
        // Fires every 5 seconds while playing.
        this.props.upsertMediaProgress(mediaId, currentTime)
      },
      5000,
      { trailing: true }
    )

    this.getMediaProgress = ({ mediaId, durationMs } = {}) => {
      if (!mediaId) {
        return Promise.resolve()
      }
      return this.props.client
        .query({
          query: mediaProgressQuery,
          variables: { mediaId },
          fetchPolicy: 'network-only'
        })
        .then(({ data: { mediaProgress: { secs } } = {} }) => {
          if (secs) {
            if (
              durationMs &&
              Math.round(secs) === Math.round(durationMs / 1000)
            ) {
              return
            }
            return secs - 2
          }
        })
    }
  }

  getChildContext() {
    return {
      getMediaProgress: this.getMediaProgress,
      saveMediaProgress: this.saveMediaProgress,
      restoreArticleProgress: this.restoreArticleProgress
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
    this.onScroll()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  render() {
    const { restore, restoreOpacity } = this.state
    const {
      children,
      me,
      revokeProgressConsent,
      submitProgressConsent,
      article,
      isArticle,
      router
    } = this.props

    const showConsentPrompt =
      isArticle &&
      me &&
      !router.query.trialSignup &&
      me.progressConsent === null &&
      article &&
      article.meta &&
      article.meta.path !== PROGRESS_EXPLAINER_PATH

    const progressPrompt = showConsentPrompt && (
      <ProgressPrompt
        onSubmitConsent={submitProgressConsent}
        onRevokeConsent={revokeProgressConsent}
      />
    )

    const showRestore =
      isArticle &&
      restore &&
      restoreOpacity > RESTORE_MIN &&
      article.userProgress &&
      article.userProgress.percentage &&
      article.userProgress.percentage !== 1

    return (
      <div ref={this.containerRef}>
        {progressPrompt || null}
        {children}
        {showRestore && (
          <RestoreButton
            onClick={this.restoreArticleProgress}
            onClose={e => {
              e.preventDefault()
              e.stopPropagation()

              this.setState({ restore: false })
            }}
            opacity={restoreOpacity}
            userProgress={article.userProgress}
          />
        )}
      </div>
    )
  }
}

Progress.propTypes = {
  children: PropTypes.node,
  me: PropTypes.shape({
    progressConsent: PropTypes.bool
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
  withApollo,
  withProgressApi,
  withMe,
  withRouter
)(Progress)
