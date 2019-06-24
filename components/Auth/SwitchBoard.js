import React from 'react'
import PropTypes from 'prop-types'

import CodeAuthorization from './CodeAuthorization'
import Poller from './Poller'

import withT from '../../lib/withT'

import { SUPPORTED_TOKEN_TYPES } from '../constants'

const SwitchBoard = props => {
  if (props.tokenType && props.tokenType === 'EMAIL_CODE') {
    return (
      <CodeAuthorization {...props} />
    )
  }

  return (
    <Poller {...props} />
  )
}

SwitchBoard.propTypes = {
  tokenType: PropTypes.oneOf(SUPPORTED_TOKEN_TYPES.concat('EMAIL_CODE')).isRequired,
  email: PropTypes.string.isRequired,
  phrase: PropTypes.string.isRequired,
  alternativeFirstFactors: PropTypes.arrayOf(
    PropTypes.oneOf(SUPPORTED_TOKEN_TYPES.concat('EMAIL_CODE'))
  ).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  onTokenTypeChange: PropTypes.func
}

SwitchBoard.defaultProps = {
  alternativeFirstFactors: []
}

export default withT(SwitchBoard)
