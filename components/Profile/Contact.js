import React, { Fragment } from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'
import { isWebUri } from 'valid-url'

import IconLink from '../IconLink'
import FieldSet, { styles as fieldSetStyles} from '../FieldSet'

import UsernameField from './UsernameField'

import {
  Dropdown,
  Label,
  Interaction,
  Checkbox
} from '@project-r/styleguide'

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

const AccessRoleDropdown = ({t, ...props}) => (
  <Dropdown
    items={['ADMIN', 'EDITOR', 'MEMBER', 'PUBLIC'].map(value => ({
      value: value,
      text: t(`profile/contact/access/${value}`)
    }))}
    {...props}
  />
)

const Contact = ({ user, isEditing, onChange, values, errors, dirty, t }) => {
  if (isEditing) {
    return <Fragment>
      <br />
      {user.isAdminUnlisted &&
        <Label>
          {t('profile/contact/isAdminUnlisted/note')}
          <br /><br />
        </Label>
      }
      <div style={{opacity: user.isAdminUnlisted ? 0.5 : 1}}>
        <Checkbox
          checked={values.isListed}
          disabled={(
            !(
              (user.statement || values.statement) &&
              (user.portrait || values.portrait)
            )
          )}
          onChange={(_, checked) => {
            onChange({
              values: {
                isListed: checked
              }
            })
          }}
        >
          {t('profile/contact/isListed/label')}
        </Checkbox>
      </div>
      <br /><br />
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
      <AccessRoleDropdown
        t={t}
        label={t('profile/contact/email/access/label')}
        value={values.emailAccessRole}
        onChange={item => {
          onChange({
            values: {
              emailAccessRole: item.value
            }
          })
        }} />
      <FieldSet
        values={values}
        errors={errors}
        dirty={dirty}
        onChange={fields => {
          const { pgpPublicKey } = fields.values
          if (pgpPublicKey && pgpPublicKey.match(/PGP PRIVATE KEY/)) {
            onChange({
              values: {
                pgpPublicKey: ''
              }
            })
            window.alert(t('profile/contact/pgpPublicKey/error/private'))
            return
          }
          onChange(fields)
        }}
        additionalFieldProps={() => {
          return {
            renderInput: (props) => (
              <textarea row={1}
                {...fieldSetStyles.autoSize}
                {...props} />
            )
          }
        }}
        fields={[
          {
            label: t('profile/contact/pgpPublicKey/label'),
            name: 'pgpPublicKey'
          }
        ]} />
      {!!user.phoneNumber && (
        <Fragment>
          <FieldSet
            values={values}
            errors={errors}
            dirty={dirty}
            onChange={onChange}
            fields={[
              {
                label: t('profile/contact/phoneNumber/label'),
                name: 'phoneNumber'
              },
              {
                label: t('profile/contact/phoneNumberNote/label'),
                name: 'phoneNumberNote'
              }
            ]} />
          <AccessRoleDropdown
            t={t}
            label={t('profile/contact/phoneNumber/access/label')}
            value={values.phoneNumberAccessRole}
            onChange={item => {
              onChange({
                values: {
                  phoneNumberAccessRole: item.value
                }
              })
            }} />
        </Fragment>
      )}
    </Fragment>
  }

  return (
    <Fragment>
      <div {...styles.icons}>
        {user.facebookId && (
          <IconLink
            icon='facebook'
            target='_blank'
            href={`https://www.facebook.com/${user.facebookId}`}
          />
        )}
        {user.twitterHandle && (
          <IconLink
            icon='twitter'
            target='_blank'
            href={`https://twitter.com/${user.twitterHandle}`}
          />
        )}
        {user.email && (
          <IconLink
            icon='mail'
            href={`mailto:${user.email}`}
          />
        )}
        {user.publicUrl && (
          <IconLink
            icon='link'
            href={user.publicUrl}
            target='_blank'
          />
        )}
      </div>
      {user.pgpPublicKeyId &&
        <IconLink
          href={`/pgp/${user.username || user.id}.asc`}
          icon='key'
          size={20}
          title={t('profile/contact/pgpPublicKey/label')}
          style={{paddingBottom: 5, paddingLeft: 0}}>
          {user.pgpPublicKeyId.toUpperCase()}
        </IconLink>}
      {user.email &&
        <Label style={{display: 'block', marginBottom: 20}}>
          {t(`profile/contact/access/${user.emailAccessRole}/note`, {
            field: t('profile/contact/email/label')
          }, '')}
        </Label>}
      {user.phoneNumber && <Fragment>
        <Interaction.P>
          <a
            href={`tel:${user.phoneNumber}`}
            style={{color: 'inherit', textDecoration: 'none'}}>
            {user.phoneNumber}
          </a>
          <Label style={{display: 'block', marginBottom: 5}}>
            {user.phoneNumberNote}
          </Label>
        </Interaction.P>
        <Label style={{display: 'block', marginBottom: 20}}>
          {t(`profile/contact/access/${user.phoneNumberAccessRole}/note`, {
            field: t('profile/contact/phoneNumber/label')
          }, '')}
        </Label>
      </Fragment>}
    </Fragment>
  )
}

export default withT(Contact)
