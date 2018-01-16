import React, {Component} from 'react'

import {css} from 'glamor'
import Play from './Icons/Play'

import {scrollIt} from '../lib/utils/scroll'
import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE
} from './constants'

import {
  VideoPlayer,
  mediaQueries
} from '@project-r/styleguide'

const blinkBg = css.keyframes({
  'from, to': {
    backgroundColor: 'transparent'
  },
  '50%': {
    backgroundColor: 'white'
  }
})

const MAX_HEIGHT = 0.8
const MAX_HEIGHT_VH = MAX_HEIGHT * 100
const ASPECT_RATIO = 2 / 1

const styles = {
  wrapper: css({
    position: 'relative',
    height: `${(1 / ASPECT_RATIO) * 100}vw`,
    backgroundColor: '#000',
    transition: 'height 200ms'
  }),
  cover: css({
    position: 'absolute',
    cursor: 'pointer',
    zIndex: 1,
    left: 0,
    top: 0,
    right: 0
  }),
  maxWidth: css({
    position: 'relative',
    margin: '0 auto',
    maxWidth: `${MAX_HEIGHT_VH * (ASPECT_RATIO)}vh`,
    overflow: 'hidden'
  }),
  poster: css({
    width: 'auto',
    height: `${(1 / ASPECT_RATIO) * 100}vw`
  }),
  cursor: css({
    position: 'absolute',
    top: '39.5%',
    left: '65.6%',
    height: '11%',
    width: '0.3%',
    minWidth: 1,
    maxWidth: 2,
    animation: `1s ${blinkBg} step-end infinite`
  }),
  play: css({
    position: 'absolute',
    top: '60%',
    left: '5%',
    right: '5%',
    textAlign: 'center'
  })
}

class VideoCover extends Component {
  constructor (props) {
    super(props)

    this.state = {
      playing: undefined,
      cover: !props.backgroundAutoPlay
    }
    this.measure = () => {
      this.setState(() => {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        let videoHeight = windowWidth * (1 / ASPECT_RATIO)
        return {
          mobile: windowWidth < mediaQueries.mBreakPoint,
          windowHeight,
          videoHeight
        }
      })
    }
    this.ref = ref => { this.player = ref }
  }
  componentDidMount () {
    window.addEventListener('resize', this.measure)
    this.measure()
    if (this.props.forceAutoPlay && this.player) {
      this.setState(() => {
        this.player.play()
        return {
          cover: false
        }
      })
    }
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.measure)
    if (this.checkPlaying === undefined) {
      clearTimeout(this.checkPlaying)
    }
  }
  render () {
    const {src, cursor, limited, backgroundAutoPlay, muted, loop} = this.props
    const {
      playing, ended,
      videoHeight, windowHeight,
      mobile, cover
    } = this.state

    const limitedHeight = (!!limited || !playing || !videoHeight)
    const heightStyle = {
      height: playing && !ended && !limitedHeight ? windowHeight : videoHeight,
      maxHeight: limitedHeight ? `${MAX_HEIGHT_VH}vh` : undefined
    }
    return (
      <div {...styles.wrapper} style={heightStyle}>
        <div {...styles.cover}
          style={{opacity: cover ? 1 : 0}}
          onClick={() => {
            this.setState(() => {
              this.player.toggle()
              return {
                clicked: true,
                cover: false
              }
            })
          }}>
          <div {...styles.maxWidth}>
            <img src={src.poster} {...styles.poster} style={heightStyle} />
            {!!cursor && <div {...styles.cursor} />}
            <div {...styles.play}>
              <Play />
            </div>
          </div>
        </div>
        <VideoPlayer ref={this.ref} src={src}
          showPlay={!cover && playing !== undefined}
          autoPlay={backgroundAutoPlay}
          attributes={backgroundAutoPlay ? {
            playsInline: true,
            'webkit-playsinline': ''
          } : {}}
          forceMuted={muted}
          loop={loop}
          onPlay={() => {
            this.setState(() => ({
              playing: true
            }))
          }}
          onPause={() => {
            this.setState(() => ({
              ended: false,
              playing: false
            }))
          }}
          onProgress={(progress) => {
            if (loop) {
              return
            }

            if (
              progress > this.props.endScroll &&
              !ended &&
              videoHeight &&
              !(this.player && this.player.scrubbing)
            ) {
              this.setState(() => ({ended: true}), () => {
                const topFixed = mobile
                  ? HEADER_HEIGHT_MOBILE
                  : HEADER_HEIGHT
                const duration = 800
                scrollIt(
                  (windowHeight * MAX_HEIGHT) - topFixed + 10,
                  duration
                )
                setTimeout(
                  () => {
                    this.setState(() => ({
                      playing: false
                    }))
                  },
                  duration / 2
                )
              })
            }
            if (progress > 0.999 && !cover) {
              this.setState(() => ({cover: true}))
            }
          }}
          style={heightStyle} />
      </div>
    )
  }
}

export default VideoCover
