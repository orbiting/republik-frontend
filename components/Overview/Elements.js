import React, { Component } from 'react'

import { css } from 'glamor'
import {
  fontStyles,
  mediaQueries,
  Editorial,
  colors
} from '@project-r/styleguide'

const styles = {
  p: css({
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    },
    color: colors.negative.text,
    margin: 0
  })
}

export const P = ({ children, ...props }) => (
  <p {...styles.p} {...props}>
    {children}
  </p>
)

export const A = ({ children, ...props }) => (
  <Editorial.A style={{ color: colors.negative.text }} {...props}>
    {children}
  </Editorial.A>
)

export class Highlight extends Component {
  highlight = data => {
    const { ids, format, series } = this.props
    if (ids && ids.includes(data.id)) {
      return true
    }
    if (data.urlMeta) {
      if (format && data.urlMeta.format === format) {
        return true
      }
      if (series && data.urlMeta.series === series) {
        return true
      }
    }
  }
  render() {
    const { children, highlight, onHighlight } = this.props
    const isHighlighted = highlight === this.highlight
    const color = isHighlighted ? colors.negative.lightText : '#fff'
    return (
      <Editorial.A
        style={{
          textDecoration: 'none',
          borderBottom: `1px dotted ${color}`,
          color,
          cursor: 'default'
        }}
        onMouseEnter={() => {
          onHighlight(this.highlight)
        }}
        onMouseLeave={() => {
          onHighlight()
        }}
      >
        {children}
      </Editorial.A>
    )
  }
}
