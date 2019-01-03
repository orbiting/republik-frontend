import React, { Component } from 'react'
import { negativeColors } from '../Frame/constants'

import { css } from 'glamor'
import { fontFamilies, Editorial } from '@project-r/styleguide'

const styles = {
  p: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 17,
    lineHeight: '26px',
    color: negativeColors.text,
    margin: 0
  })
}

export const P = ({ children, ...props }) =>
  <p {...styles.p} {...props}>{children}</p>

export const A = ({ children, ...props }) =>
  <Editorial.A style={{ color: negativeColors.text }} {...props}>{children}</Editorial.A>

export class Highlight extends Component {
  highlight = (data) => {
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
  render () {
    const { children, highlight, onHighlight } = this.props
    const isHighlighted = highlight === this.highlight
    const color = isHighlighted ? negativeColors.lightText : '#fff'
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
        }}>
        {children}
      </Editorial.A>
    )
  }
}
