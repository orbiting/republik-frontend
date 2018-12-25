import React from 'react'
import HrefLink from '../Link/Href'

import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../../lib/constants'

const TeaserHover = ({ measurement, teaser, width }) => {
  const hoverWidth = 300
  return (
    <div style={{
      position: 'absolute',
      zIndex: 1,
      top: measurement.y - 20,
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
        {teaser.nodes.map((node, i) => {
          const nodeWidth = 100 / teaser.nodes.length
          const area = (
            <a key={node.data.id} style={{
              display: 'block',
              position: 'absolute',
              left: `${nodeWidth * i}%`,
              width: `${nodeWidth}%`,
              top: 0,
              bottom: 0
            }} />
          )
          if (node.data.url) {
            return <HrefLink key={node.data.id} href={node.data.url} passHref>
              {area}
            </HrefLink>
          }
          return area
        })}
      </div>
    </div>
  )
}

export default TeaserHover
