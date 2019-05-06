import React, { Fragment } from 'react'
import { css } from 'glamor'

import HrefLink from '../Link/Href'

const loadingKeyframes = css.keyframes({
  'from, to': {
    opacity: 0.5
  },
  '50%': {
    opacity: 1
  }
})

const styles = {
  area: css({
    display: 'block',
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'background-color 200ms, opacity 200ms'
  }),
  areaLoading: css({
    animation: `2s ${loadingKeyframes} infinite ease-in-out`
  })
}

const TeaserNodes = ({ nodes, loading, highlight, noClick }) => {
  const nodeWidth = 100 / nodes.length
  const maxIndex = nodes.length - 1

  return <Fragment>
    {nodes.map((node, i) => {
      const area = (
        <a
          key={node.data.id}
          {...styles.area}
          {...loading && styles.areaLoading}
          style={{
            left: `${nodeWidth * i}%`,
            right: `${nodeWidth * (maxIndex - i)}%`,
            backgroundColor: loading || (highlight && !highlight(node.data))
              ? 'rgba(0,0,0,0.6)'
              : 'rgba(0,0,0,0.0)'
          }} />
      )
      if (node.data.url && !noClick) {
        return <HrefLink key={node.data.id} href={node.data.url} passHref>
          {area}
        </HrefLink>
      }
      return area
    })}
  </Fragment>
}

export default TeaserNodes
