import React from 'react'
import { css } from 'glamor'
import { MdCheck } from 'react-icons/md'
import { colors } from '@project-r/styleguide'

import withT from '../../lib/withT'

const styles = {
  check: css({
    display: 'inline-block',
    marginLeft: 4,
    marginTop: -2
  })
}

const Credential = ({ description, verified, t, textColor }) => (
  <span
    title={
      (verified &&
        t('styleguide/comment/header/verifiedCredential', undefined, '')) ||
      undefined
    }
    style={
      textColor
        ? { color: verified ? colors.text : colors.lightText }
        : undefined
    }
  >
    {description}
    {verified && (
      <MdCheck
        {...styles.check}
        {...(textColor ? { fill: colors.primary } : undefined)}
      />
    )}
  </span>
)

export default withT(Credential)
