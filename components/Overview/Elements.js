import React from 'react'
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
