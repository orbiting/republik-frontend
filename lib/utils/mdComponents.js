import React from 'react'
import { css } from 'glamor'

import {
  H1,
  H2,
  A,
  P,
  fontStyles,
  mediaQueries,
  colors,
  Editorial
} from '@project-r/styleguide'

const styles = {
  h1: css({
    // [mediaQueries.onlyS]: {
    //   fontSize: 36,
    //   lineHeight: '39px'
    // }
  }),
  list: css({
    color: colors.text,
    ...fontStyles.serifRegular,
    fontSize: 16,
    lineHeight: '25px',
    [mediaQueries.mUp]: {
      fontSize: 21,
      lineHeight: '32px'
    }
  })
}

const mdComponents = {
  h1: ({ children }) => <H1 {...styles.h1}>{children}</H1>,
  h2: H2,
  a: A,
  p: P,
  strong: ({ children }) => (
    <strong style={{ ...fontStyles.serifBold }}>{children}</strong>
  ),
  ul: ({ children }) => <ul {...styles.list}>{children}</ul>,
  ol: ({ children }) => <ol {...styles.list}>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  img: props => <img {...props} style={{ width: '100%' }} />
}

const lightStyle = {
  color: colors.negative.text
}

export const light = {
  h1: ({ children }) => (
    <Editorial.Headline style={lightStyle} {...styles.h1}>
      {children}
    </Editorial.Headline>
  ),
  h2: ({ children }) => (
    <Editorial.Subhead style={lightStyle}>{children}</Editorial.Subhead>
  ),
  a: ({ children, ...props }) => (
    <Editorial.A {...props} style={lightStyle}>
      {children}
    </Editorial.A>
  ),
  p: ({ children }) => <Editorial.P style={lightStyle}>{children}</Editorial.P>,
  strong: ({ children }) => (
    <strong style={{ ...fontStyles.serifBold }}>{children}</strong>
  ),
  ul: ({ children }) => (
    <Editorial.UL {...styles.list} style={lightStyle}>
      {children}
    </Editorial.UL>
  ),
  ol: ({ children }) => (
    <Editorial.OL {...styles.list} style={lightStyle}>
      {children}
    </Editorial.OL>
  ),
  li: ({ children }) => (
    <Editorial.LI style={lightStyle}>{children}</Editorial.LI>
  ),
  img: props => <img {...props} style={{ width: '100%' }} />
}

export default mdComponents
