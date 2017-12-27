import React from 'react'
import { css } from 'glamor'

import {
  fontFamilies
} from '@project-r/styleguide'

const styles = {
  quote: {
    fontFamily: fontFamilies.serifTitle,
    fontSize: 36,
    lineHeight: 1.42
  }
}

const fontSizeBoost = length => {
  if (length < 40) {
    return 26
  }
  if (length < 50) {
    return 17
  }
  if (length < 80) {
    return 8
  }
  if (length < 100) {
    return 4
  }
  if (length > 200) {
    return -4
  }
  return 0
}

export default ({user}) => {
  if (!user.statement) {
    return null
  }
  return (
    <span
      {...css(styles.quote)}
      style={{
        fontSize: 24 + fontSizeBoost(user.statement.length)
      }}
    >
      «{user.statement}»
    </span>
  )
}
