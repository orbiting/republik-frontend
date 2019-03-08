import React, { Fragment } from 'react'
import { css } from 'glamor'
import MdCheck from 'react-icons/lib/md/check'

import withT from '../../lib/withT'

import FieldSet from '../FieldSet'

import {
  Label,
  A,
  fontStyles,
  colors
} from '@project-r/styleguide'

const styles = {
  icons: css({
    padding: '15px 0'
  }),
  credential: css({
    display: 'block',
    ...fontStyles.sansSerifRegular16,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  verifiedCheck: css({
    color: colors.text,
    display: 'inline-block',
    marginTop: -2
  })
}

const fields = t => [
  {
    label: t('profile/credentials/label'),
    name: 'credential',
    validator: (value) => (
      (
        value && value.length > 40 &&
        t('profile/credentials/errors/tooLong')
      )
    )
  }
]

const Credentials = ({ user, isEditing, onChange, values, errors, dirty, t }) => {
  const credentials = user.credentials || []
  const publicOnes = credentials.filter(c => c.isListed)
  if (isEditing) {
    const privateCreds = credentials.filter(c => !c.isListed)
    return <Fragment>
      <FieldSet
        values={values}
        errors={errors}
        dirty={dirty}
        onChange={onChange}
        fields={fields(t)} />
      {!!privateCreds.length && <Label style={{ display: 'block', marginBottom: 5 }}>
        {t('profile/credentials/private')}
      </Label>}
      {privateCreds.concat(publicOnes).filter(c => c.description !== values.credential).map(c => (
        <A key={c.description} href='#use' {...styles.credential} onClick={(e) => {
          e.preventDefault()
          onChange({
            values: {
              credential: c.description
            }
          })
        }}>{c.description}</A>
      ))}
    </Fragment>
  }

  return (
    <Fragment>
      {publicOnes.map((credential, i) => (
        <div key={i} {...styles.credential} title={(credential.verified && t('styleguide/comment/header/verifiedCredential', undefined, '')) || undefined}>
          {credential.description} {credential.verified && <MdCheck {...styles.verifiedCheck} />}
        </div>
      ))}
    </Fragment>
  )
}

export default withT(Credentials)
