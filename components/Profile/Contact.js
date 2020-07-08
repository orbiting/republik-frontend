import React, { Fragment } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import { withSupporter } from '../Auth/checkRoles'
import { isWebUri } from 'valid-url'

import IconLink from '../IconLink'
import FieldSet, { styles as fieldSetStyles } from '../FieldSet'

import { DEFAULT_VALUES } from './Page'

import { Dropdown, Label, Interaction } from '@project-r/styleguide'

import { ADMIN_BASE_URL } from '../../lib/constants'

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
    validator: value =>
      !!value &&
      !isWebUri(value) &&
      value !== DEFAULT_VALUES.publicUrl &&
      t('profile/contact/publicUrl/error')
  }
]

const AccessRoleDropdown = ({ t, ...props }) => (
  <Dropdown
    items={['ADMIN', 'EDITOR', 'MEMBER', 'PUBLIC'].map(value => ({
      value: value,
      text: t(`profile/contact/access/${value}`)
    }))}
    {...props}
  />
)

const Contact = ({
  user,
  isEditing,
  onChange,
  values,
  errors,
  dirty,
  t,
  isSupporter,
  inNativeIOSApp
}) => {
  if (isEditing) {
    return (
      <Fragment>
        <FieldSet
          values={values}
          errors={errors}
          dirty={dirty}
          onChange={onChange}
          fields={fields(t)}
        />
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
          }}
        />
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
              renderInput: props => (
                <textarea row={1} {...fieldSetStyles.autoSize} {...props} />
              )
            }
          }}
          fields={[
            {
              label: t('profile/contact/pgpPublicKey/label'),
              name: 'pgpPublicKey'
            }
          ]}
        />
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
              ]}
            />
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
              }}
            />
          </Fragment>
        )}
      </Fragment>
    )
  }

  return (
    <Fragment>
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
        {user.email && <IconLink icon='mail' href={`mailto:${user.email}`} />}
        {user.publicUrl && user.publicUrl !== DEFAULT_VALUES.publicUrl && (
          <IconLink icon='link' href={user.publicUrl} />
        )}
        {isSupporter && (
          <IconLink
            icon='notesMedical'
            fill='#FF10D9'
            size={22}
            href={`${ADMIN_BASE_URL}/users/${user.id}`}
            target='_blank'
          />
        )}
      </div>
      {!inNativeIOSApp && user.pgpPublicKeyId && (
        <IconLink
          href={`/pgp/${user.username || user.id}.asc`}
          icon='key'
          size={20}
          title={t('profile/contact/pgpPublicKey/label')}
          style={{ marginBottom: 16, padding: 0 }}
        >
          {user.pgpPublicKeyId.toUpperCase()}
        </IconLink>
      )}
      {user.email && user.emailAccessRole !== 'PUBLIC' && (
        <Label style={{ display: 'block', marginBottom: 16 }}>
          {t(
            `profile/contact/access/${user.emailAccessRole}/note`,
            {
              field: t('profile/contact/email/label')
            },
            ''
          )}
        </Label>
      )}
      {user.phoneNumber && (
        <Fragment>
          <Interaction.P>
            <a
              href={`tel:${user.phoneNumber}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {user.phoneNumber}
            </a>
            <Label style={{ display: 'block', marginBottom: 5 }}>
              {user.phoneNumberNote}
            </Label>
          </Interaction.P>
          <Label style={{ display: 'block', marginBottom: 16 }}>
            {t(
              `profile/contact/access/${user.phoneNumberAccessRole}/note`,
              {
                field: t('profile/contact/phoneNumber/label')
              },
              ''
            )}
          </Label>
        </Fragment>
      )}
    </Fragment>
  )
}

const styles = {
  icons: css({
    margin: '16px 0'
  })
}

export default compose(withT, withInNativeApp, withSupporter)(Contact)
