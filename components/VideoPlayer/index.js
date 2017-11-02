import React, {Component} from 'react'

import {css} from 'glamor'
import Play from './Icons/Play'
import Volume from './Icons/Volume'
import Subtitles from './Icons/Subtitles'

import {
  InlineSpinner, colors
} from '@project-r/styleguide'

import {
  ZINDEX_VIDEOPLAYER_ICONS,
  ZINDEX_VIDEOPLAYER_SCRUB
} from '../constants'

import {
  STATIC_BASE_URL
} from '../../lib/constants'

const PROGRESS_HEIGHT = 4

const styles = {
  wrapper: css({
    position: 'relative',
    lineHeight: 0,
    marginBottom: PROGRESS_HEIGHT
  }),
  video: css({
    width: '100%',
    height: 'auto',
    transition: 'height 200ms',
    '::-webkit-media-controls-panel': {
      display: 'none !important'
    },
    '::--webkit-media-controls-play-button': {
      display: 'none !important'
    },
    '::-webkit-media-controls-start-playback-button': {
      display: 'none !important'
    }
  }),
  controls: css({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    cursor: 'pointer',
    transition: 'opacity 200ms'
  }),
  play: css({
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    marginTop: -18,
    textAlign: 'center',
    transition: 'opacity 200ms'
  }),
  progress: css({
    position: 'absolute',
    backgroundColor: colors.primary,
    bottom: -PROGRESS_HEIGHT,
    left: 0,
    height: PROGRESS_HEIGHT
  }),
  icons: css({
    position: 'absolute',
    zIndex: ZINDEX_VIDEOPLAYER_ICONS,
    right: 10,
    bottom: 10,
    cursor: 'pointer'
  }),
  scrub: css({
    zIndex: ZINDEX_VIDEOPLAYER_SCRUB,
    position: 'absolute',
    height: '10%',
    bottom: -PROGRESS_HEIGHT,
    left: 0,
    right: 0,
    cursor: 'ew-resize'
  })
}

let globalState = {
  playingRef: undefined,
  muted: false,
  subtitles: false,
  instances: []
}

class VideoPlayer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      playing: false,
      progress: 0,
      muted: globalState.muted,
      subtitles: props.subtitles || globalState.subtitles,
      loading: false
    }

    this.updateProgress = () => {
      const {video} = this
      if (!video) {
        return
      }
      this.setState(() => {
        const progress = video.currentTime / video.duration
        this.props.onProgress && this.props.onProgress(progress)
        return {
          progress
        }
      })
    }
    this.syncProgress = () => {
      this.readTimeout = setTimeout(
        () => {
          this.updateProgress()
          this.syncProgress()
        },
        16
      )
    }
    this.ref = ref => { this.video = ref }
    this.onPlay = () => {
      if (
        globalState.playingRef &&
        globalState.playingRef !== this.video
      ) {
        globalState.playingRef.pause()
      }
      globalState.playingRef = this.video
      this.setState(() => ({
        playing: true,
        loading: false
      }))
      this.syncProgress()
      this.props.onPlay && this.props.onPlay()
    }
    this.onPause = () => {
      this.setState(() => ({
        playing: false
      }))
      clearTimeout(this.readTimeout)
      this.props.onPause && this.props.onPause()
    }
    this.onLoadStart = () => {
      this.setState(() => ({
        loading: true
      }))
    }
    this.onCanPlay = () => {
      this.setState(() => ({
        loading: false
      }))
    }
    this.onLoadedMetaData = () => {
      this.setTextTracksMode()
    }
    this.scrubRef = ref => { this.scrubber = ref }
    this.scrub = (event) => {
      const {scrubber, video} = this
      if (this.scrubbing && scrubber && video && video.duration) {
        event.preventDefault()
        const rect = scrubber.getBoundingClientRect()

        let currentEvent = event
        if (currentEvent.nativeEvent) {
          currentEvent = event.nativeEvent
        }
        while (currentEvent.sourceEvent) {
          currentEvent = currentEvent.sourceEvent
        }
        if (currentEvent.changedTouches) {
          currentEvent = currentEvent.changedTouches[0]
        }

        const progress = Math.min(
          1,
          Math.max(
            (currentEvent.clientX - rect.left) / rect.width,
            0
          )
        )
        video.currentTime = video.duration * progress
        this.updateProgress()
      }
    }
    this.scrubStart = event => {
      this.scrubbing = true
      if (event.type === 'mousedown') {
        const up = e => {
          this.scrubEnd(e)
          document.removeEventListener('mousemove', this.scrub)
          document.removeEventListener('mouseup', up)
        }
        document.addEventListener('mousemove', this.scrub)
        document.addEventListener('mouseup', up)
      }
      this.scrub(event)
    }
    this.scrubEnd = event => {
      this.scrub(event)
      this.scrubbing = false
    }
    this.setInstanceState = (state) => {
      this.setState(state)
    }
  }
  toggle () {
    const {video} = this
    if (video) {
      if (video.paused || video.ended) {
        this.play()
      } else {
        this.pause()
      }
    }
  }
  play () {
    const {video} = this
    video && video.play()
  }
  pause () {
    const {video} = this
    video && video.pause()
  }
  setTextTracksMode () {
    const {subtitles} = this.state
    const {src} = this.props

    if (!this.video || !src.subtitles || subtitles === this._textTrackMode) {
      return
    }
    if (this.video.textTracks && this.video.textTracks.length) {
      this.video.textTracks[0].mode = subtitles ? 'showing' : 'hidden'
      this._textTrackMode = subtitles
    }
  }
  componentDidMount () {
    globalState.instances
      .push(this.setInstanceState)
    // TODO: Remove early return after fixing things on localhost.
    if (!this.video) {
      return
    }
    this.video.addEventListener('play', this.onPlay)
    this.video.addEventListener('pause', this.onPause)
    this.video.addEventListener('loadstart', this.onLoadStart)
    this.video.addEventListener('canplay', this.onCanPlay)
    this.video.addEventListener('canplaythrough', this.onCanPlay)
    this.video.addEventListener('loadedmetadata', this.onLoadedMetaData)

    this.setTextTracksMode()
  }
  componentDidUpdate () {
    this.setTextTracksMode()
  }
  componentWillUnmount () {
    globalState.instances = globalState.instances
      .filter(setter => setter !== this.setInstanceState)
    if (globalState.playingRef === this.video) {
      globalState.playingRef = undefined
    }

    this.video.removeEventListener('play', this.onPlay)
    this.video.removeEventListener('pause', this.onPause)
    this.video.removeEventListener('loadstart', this.onLoadStart)
    this.video.removeEventListener('progress', this.onProgress)
    this.video.removeEventListener('canplay', this.onCanPlay)
    this.video.removeEventListener('canplaythrough', this.onCanPlay)
    this.video.removeEventListener('loadedmetadata', this.onLoadedMetaData)
  }
  render () {
    const {src, hidePlay} = this.props
    const {
      playing, progress,
      muted, subtitles,
      loading
    } = this.state

    return (
      <div {...styles.wrapper}>
        <video {...styles.video}
          style={this.props.style}
          autoPlay={this.props.autoPlay}
          muted={muted}
          ref={this.ref}
          crossOrigin='anonymous'
          poster={src.poster}>
          <source src={src.hls} type='application/x-mpegURL' />
          <source src={src.mp4} type='video/mp4' />
          { /* crossOrigin subtitles won't work in older browser, serve from static */ }
          {!!src.subtitles && <track label='Deutsch' kind='subtitles' srcLang='de' src={src.subtitles.replace(STATIC_BASE_URL, '')} default />}
        </video>
        <div {...styles.controls}
          style={{opacity: playing ? 0 : 1}}
          onClick={() => this.toggle()}>
          <div {...styles.play} style={{
            opacity: (hidePlay || playing) ? 0 : 1
          }}>
            <Play />
          </div>
          <div {...styles.icons}>
            {loading && <InlineSpinner size={25} />}
            {' '}
            {!!src.subtitles && <a href='#'
              title={`Untertitel ${subtitles ? 'an' : 'aus'}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const next = {
                  subtitles: !subtitles
                }
                globalState.subtitles = next.subtitles
                globalState.instances.forEach(setter => {
                  setter(next)
                })
              }}>
              <Subtitles off={!subtitles} />
            </a>}
            {' '}
            <a href='#'
              title={`Audio ${muted ? 'aus' : 'an'}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const next = {
                  muted: !muted
                }
                globalState.muted = next.muted
                globalState.instances.forEach(setter => {
                  setter(next)
                })
              }}>
              <Volume off={muted} />
            </a>
          </div>
        </div>
        <div {...styles.progress}
          style={{width: `${progress * 100}%`}} />
        <div {...styles.scrub}
          ref={this.scrubRef}
          onTouchStart={this.scrubStart}
          onTouchMove={this.scrub}
          onTouchEnd={this.scrubEnd}
          onMouseDown={this.scrubStart} />
      </div>
    )
  }
}

VideoPlayer.defaultProps = {
  hidePlay: false
}

export default VideoPlayer
