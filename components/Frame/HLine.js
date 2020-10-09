import React from 'react'
import { css } from 'glamor'
import { colors, useColorContext } from '@project-r/styleguide'

import { ZINDEX_POPOVER } from '../constants'

const HLine = ({ formatColor }) => {
  const [colorScheme] = useColorContext()
  return (
    <hr
      {...styles.hr}
      {...colorScheme.rules.divider.backgroundColor}
      {...colorScheme.rules.divider.color}
      style={{
        color: formatColor,
        backgroundColor: formatColor,
        height: formatColor ? 3 : 1
      }}
    />
  )
}

export default HLine

const styles = {
  hr: css({
    margin: 0,
    display: 'block',
    border: 0,
    width: '100%',
    zIndex: ZINDEX_POPOVER + 2
  })
}
