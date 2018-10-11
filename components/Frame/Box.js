import React from 'react'
import { css } from 'glamor'

import { colors } from '@project-r/styleguide'

const styles = {
  box: css({
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: colors.primaryBg
  })
}

const Box = ({ children, style }) => (
  <div {...styles.box} style={style}>
    {children}
  </div>
)

export default Box
