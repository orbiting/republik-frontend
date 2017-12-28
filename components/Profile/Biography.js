import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'

import FieldSet from '../FieldSet'

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

const fields = t => [
  {
    label: t('profile/biography/label'),
    name: 'biography',
    autoSize: true
  }
]

export default withT(({ user, isEditing, t, ...props }) => {
  if (!user.biography && !isEditing) {
    return null
  }
  return (
    <p {...styles.text}>
      {isEditing
        ? <FieldSet
          {...props}
          fields={fields(t)} />
        : user.biography}
    </p>
  )
})
