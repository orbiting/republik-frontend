import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'

import FieldSet from '../FieldSet'

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

const fields = t => [
  {
    label: t('profile/statement/label'),
    name: 'statement',
    autoSize: true,
    validator: value =>
      (!value.trim() && t('profile/statement/error')) ||
      (value.trim().length >= 140 && t('profile/statement/tooLong'))
  }
]

export default withT(({t, user, isEditing, ...props}) => {
  if (!user.statement && !isEditing) {
    return null
  }
  return (
    <span
      {...css(styles.quote)}
      style={{
        fontSize: 24 + fontSizeBoost(user.statement.length)
      }}
    >
      {isEditing
        ? <FieldSet
          {...props}
          fields={fields(t)} />
        : `«${user.statement}»`}
    </span>
  )
})
