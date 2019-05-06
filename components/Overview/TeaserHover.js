import React from 'react'
import { css } from 'glamor'

import TeaserNodes from './TeaserNodes'
import { getSmallImgSrc } from './utils'

import { ZINDEX_POPOVER } from '../constants'

const TeaserHover = ({ measurement, teaser, contextWidth, highlight }) => {
  const hoverWidth = typeof window !== 'undefined' && window.innerWidth > 420
    ? 400
    : 300
  const oneData = teaser.nodes.length === 1 && teaser.nodes[0].data
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
        backgroundColor: (oneData && oneData.bgColor) || '#E5E5E5',
        backgroundImage: `url(${getSmallImgSrc(teaser)})`,
        backgroundSize: 'cover',
        height: Math.floor(hoverWidth * measurement.height / measurement.width) - 2,
        overflow: 'hidden',
        lineHeight: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,.4)'
      }}>
        <div {...css({
          position: 'absolute',
          top: 0,
          width: 1200,
          height: Math.floor(1200 * measurement.height / measurement.width),
          transform: `scale(${hoverWidth / 1200})`,
          transformOrigin: '0% 0%'
        })}>
          <iframe
            frameBorder='0'
            sandbox=''
            src={`/?extractId=${teaser.id}`}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%'
            }} />
        </div>
        <TeaserNodes nodes={teaser.nodes} highlight={highlight} />
      </div>
    </div>
  )
}

export default TeaserHover
