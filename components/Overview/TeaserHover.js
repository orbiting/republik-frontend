import React from 'react'

import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../../lib/constants'

import TeaserNodes from './TeaserNodes'

const TeaserHover = ({ measurement, teaser, width, highlight }) => {
  const hoverWidth = 300
  return (
    <div style={{
      position: 'absolute',
      zIndex: 1,
      top: measurement.y - 10,
      left: measurement.x > hoverWidth / 2
        ? measurement.x + hoverWidth / 2 > width
          ? width - hoverWidth
          : measurement.x + measurement.width / 2 - hoverWidth / 2
        : 0
    }}>
      <div style={{
        width: hoverWidth,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#E5E5E5',
        minHeight: Math.floor(hoverWidth * measurement.height / measurement.width) - 2,
        lineHeight: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,.4)'
      }}>
        <img
          style={{
            position: 'relative',
            width: '100%'
          }}
          key={teaser.id}
          src={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.id}`)}&resize=600`} />
        <TeaserNodes nodes={teaser.nodes} highlight={highlight} />
      </div>
    </div>
  )
}

export default TeaserHover
