import React, { Fragment } from 'react'
import { css } from 'glamor'

import HrefLink from '../Link/Href'

const styles = {
  area: css({
    display: 'block',
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'background-color 200ms'
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
          style={{
            left: `${nodeWidth * i}%`,
            right: `${nodeWidth * (maxIndex - i)}%`,
            backgroundColor: loading
              ? 'rgba(0,0,0,0.0)'
              : (highlight && !highlight(node.data))
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
