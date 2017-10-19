import React from 'react'
import {css} from 'glamor'

import {
  H1, H2, A, P, fontFamilies, mediaQueries, colors
} from '@project-r/styleguide'

const styles = {
  h1: css({
    [mediaQueries.onlyS]: {
      fontSize: 36,
      lineHeight: '39px'
    }
  }),
  list: css({
    color: colors.text,
    fontFamily: fontFamilies.serifRegular,
    fontSize: 16,
    lineHeight: '25px',
    [mediaQueries.mUp]: {
      fontSize: 21,
      lineHeight: '32px'
    }
  })
}

const mdComponents = {
  h1: ({children}) => <H1 {...styles.h1}>{children}</H1>,
  h2: H2,
  a: A,
  p: P,
  strong: ({children}) => (
    <span style={{fontFamily: fontFamilies.serifBold}}>{children}</span>
  ),
  ul: ({children}) => <ul {...styles.list}>{children}</ul>,
  ol: ({children}) => <ol {...styles.list}>{children}</ol>,
  li: ({children}) => <li>{children}</li>,
  img: (props) => <img {...props} style={{width: '100%'}} />
}

export default mdComponents
