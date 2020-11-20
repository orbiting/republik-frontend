import React from 'react'
import { errorToString } from '../lib/utils/errors'

import { useColorContext, Interaction } from '@project-r/styleguide'

const { P } = Interaction

export const ErrorContainer = ({ children }) => {
  const [colorScheme] = useColorContext()
  return <div {...colorScheme.set('color', 'error')}>{children}</div>
}

const ErrorMessage = ({ error, style }) => {
  const [colorScheme] = useColorContext()
  return (
    <P style={{ margin: '20px 0', ...style }}>
      <span {...colorScheme.set('color', 'error')}>{errorToString(error)}</span>
    </P>
  )
}

export default ErrorMessage
