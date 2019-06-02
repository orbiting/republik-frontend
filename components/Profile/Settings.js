import React from 'react'

import withT from '../../lib/withT'

import UsernameField from './UsernameField'

import {
  Label,
  Checkbox
} from '@project-r/styleguide'

const Settings = ({ user, isEditing, onChange, values, errors, dirty, t }) => {
  if (!isEditing) {
    return null
  }

  return <div style={{ marginTop: 20 }}>
    {!user.isEligibleForProfile &&
      <Label>
        {t('profile/settings/isEligibleForProfile/notEligible')}
        <br /><br />
      </Label>
    }
    {user.isAdminUnlisted &&
      <Label>
        {t('profile/settings/isAdminUnlisted/note')}
        <br /><br />
      </Label>
    }
    <div style={{ opacity: user.isAdminUnlisted ? 0.5 : 1 }}>
      <Checkbox
        checked={values.isListed}
        disabled={(
          !(
            (user.statement || values.statement) &&
            (user.portrait || values.portrait)
          ) ||
          (!user.isListed && !user.isEligibleForProfile)
        )}
        onChange={(_, checked) => {
          onChange({
            values: {
              isListed: checked
            }
          })
        }}
      >
        {t('profile/settings/isListed/label')}
      </Checkbox>{' '}
      <Label>{t('profile/settings/isListed/note')}</Label>
    </div>
    <br />
    <Checkbox
      checked={values.hasPublicProfile}
      disabled={!user.hasPublicProfile && !user.isEligibleForProfile}
      onChange={(_, checked) => {
        onChange({
          values: {
            hasPublicProfile: checked
          }
        })
      }}
    >
      {t('profile/settings/hasPublicProfile/label')}
    </Checkbox>{' '}
    <Label>{t('profile/settings/hasPublicProfile/note')}</Label>
    <div style={{ marginTop: 5 }}>
      <UsernameField
        user={user}
        values={values}
        errors={errors}
        onChange={onChange} />
    </div>
  </div>
}

export default withT(Settings)
