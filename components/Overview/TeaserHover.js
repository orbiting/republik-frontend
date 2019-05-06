import React, { Component } from 'react'
import { css } from 'glamor'

import TeaserNodes from './TeaserNodes'
import { getSmallImgSrc } from './utils'

import { ZINDEX_POPOVER } from '../constants'

const styles = {
  preview: css({
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    filter: 'blur(5px)',
    transform: 'scale(1)'
  }),
  iframe: css({
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'opacity 200ms'
  })
}

class TeaserHover extends Component {
  constructor (props) {
    super(props)

    this.state = { loading: true }
  }
  render () {
    const { measurement, teaser, contextWidth, highlight } = this.props
    const { loading } = this.state

    const hoverWidth = typeof window !== 'undefined' && window.innerWidth > 420
      ? 400
      : 300
    const onLoadEnd = () => this.setState({ loading: false })
    return (
      <div style={{
        position: 'absolute',
        zIndex: ZINDEX_POPOVER,
        top: measurement.y - 10,
        left: measurement.x > hoverWidth / 2
          ? measurement.x + measurement.width / 2 + hoverWidth / 2 > contextWidth
            ? contextWidth - hoverWidth
            : measurement.x + measurement.width / 2 - hoverWidth / 2
          : 0
      }}>
        <div style={{
          width: hoverWidth,
          position: 'absolute',
          bottom: 0,
          height: Math.ceil(hoverWidth * measurement.height / measurement.width) - 2,
          lineHeight: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,.4)'
        }}>
          <div {...css({
            position: 'absolute',
            top: 0,
            width: 1200,
            height: Math.floor(1200 * measurement.height / measurement.width),
            overflow: 'hidden',
            transform: `scale(${hoverWidth / 1200})`,
            transformOrigin: '0% 0%'
          })}>
            <img {...styles.preview} src={getSmallImgSrc(teaser)} />
            <iframe
              frameBorder='0'
              sandbox=''
              onLoad={onLoadEnd}
              onError={onLoadEnd}
              src={`/?extractId=${teaser.id}`}
              {...styles.iframe}
              style={{
                opacity: loading ? 0 : 1
              }} />
            <TeaserNodes
              loading={loading}
              nodes={teaser.nodes}
              highlight={highlight} />
          </div>
        </div>
      </div>
    )
  }
}

export default TeaserHover
