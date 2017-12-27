import React from 'react'
import { css } from 'glamor'

import {
  fontStyles
} from '@project-r/styleguide'

const styles = {
  text: css({
    ...fontStyles.serifRegular19,
    lineHeight: '30px',
    marginTop: 0,
    marginBottom: 60
  })
}

export default ({ user }) => (
  <p {...styles.text}>
    {user.biography}
  </p>
)
