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
  Editorial,
  convertStyleToRem,
  pxToRem
} from '@project-r/styleguide'

const styles = {
  h2: css({
    ...fontStyles.serifBold,
    fontSize: 22,
    lineHeight: 1.2,
    margin: '36px 0 8px 0',
    [mediaQueries.mUp]: {
      fontSize: 30,
      lineHeight: 1.2,
      margin: '46px 0 12px 0'
    }
  }),
  p: css({
    color: colors.text,
    margin: '20px 0 20px 0',
    ...convertStyleToRem(fontStyles.serifRegular17),
    [mediaQueries.mUp]: {
      ...convertStyleToRem(fontStyles.serifRegular21)
    },
    ':first-child': {
      marginTop: 0
    },
    ':last-child': {
      marginBottom: 0
    },
    'h2 + &': {
      marginTop: 0
    }
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
  em: ({ children }) => (
    <em style={{ ...fontStyles.serifItalic }}>{children}</em>
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
    <h2 {...styles.h2} style={lightStyle}>
      {children}
    </h2>
  ),
  a: ({ children, ...props }) => (
    <Editorial.A {...props} style={lightStyle}>
      {children}
    </Editorial.A>
  ),
  p: ({ children }) => <P style={lightStyle}>{children}</P>,
  strong: ({ children }) => (
    <strong style={{ ...fontStyles.serifBold }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ ...fontStyles.serifItalic }}>{children}</em>
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
