import React from 'react'
import { errorToString } from '../lib/utils/errors'

import {
  Interaction, colors
} from '@project-r/styleguide'

const { P } = Interaction

export default ({ error, style }) => (
  <P style={{ color: colors.error, margin: '20px 0', ...style }}>
    {errorToString(error)}
  </P>
)
