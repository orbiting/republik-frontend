import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'

import FieldSet from '../FieldSet'

import { Editorial } from '@project-r/styleguide'

const styles = {
  text: css({
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
    <Editorial.P {...styles.text}>
      {isEditing
        ? <FieldSet
          {...props}
          fields={fields(t)} />
        : user.biography}
    </Editorial.P>
  )
})
