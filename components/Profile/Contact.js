import React, { Fragment } from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'
import { isWebUri } from 'valid-url'

import IconLink from '../IconLink'
import FieldSet from '../FieldSet'

import UsernameField from './UsernameField'

const styles = {
  icons: css({
    padding: '15px 0'
  })
}

const fields = t => [
  {
    label: t('profile/contact/facebook/label'),
    name: 'facebookId'
  },
  {
    label: t('profile/contact/twitter/label'),
    name: 'twitterHandle'
  },
  {
    label: t('profile/contact/publicUrl/label'),
    name: 'publicUrl',
    validator: (value) => (
      (
        !!value &&
        !isWebUri(value) &&
        t('profile/contact/publicUrl/error')
      )
    )
  }
]

const Contact = ({ user, isEditing, onChange, values, errors, dirty, t }) => {
  if (isEditing) {
    return <Fragment>
      <UsernameField
        user={user}
        values={values}
        errors={errors}
        onChange={onChange} />
      <FieldSet
        values={values}
        errors={errors}
        dirty={dirty}
        onChange={onChange}
        fields={fields(t)} />
    </Fragment>
  }

  return (
    <div {...styles.icons}>
      {user.facebookId && (
        <IconLink
          icon='facebook'
          href={`https://www.facebook.com/${user.facebookId}`}
        />
      )}
      {user.twitterHandle && (
        <IconLink
          icon='twitter'
          href={`https://twitter.com/${user.twitterHandle}`}
        />
      )}
      {/* API will return email if it's your own profile (or authorized roles) */}
      {/* if emailAccessRole is admin we hide it here */}
      {user.email && user.emailAccessRole !== 'ADMIN' && (
        <IconLink
          icon='mail'
          href={`mailto:${user.email}`}
        />
      )}
      {user.publicUrl && (
        <IconLink
          icon='link'
          href={user.publicUrl}
          target={'_blank'}
        />
      )}
    </div>
  )
}

export default withT(Contact)
