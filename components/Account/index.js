import React from 'react'
import { compose } from 'redux'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import Loader from '../Loader'
import UpdateMe from './UpdateMe'
import UpdateProfile from './UpdateProfile'
import RawHtml from '../RawHtml'

import { H1, Lead } from '@project-r/styleguide'

const Account = ({ loading, error, me, t, signOut }) => (
  <Loader
    loading={loading}
    error={error}
    render={() => {
      // TODO: Migrate pledges/memberships from crowdfunding's Belongings once backend is ready.
      const hasPledges = true
      const hasMemberships = true

      return (
        <div>
          <H1>
            {hasPledges ? (
              t('Account/title', {
                name: me.name
              })
            ) : (
              t('Account/empty/title', {
                nameOrEmail: me.name || me.email
              })
            )}
          </H1>
          {hasPledges && (
            <div>
              <RawHtml
                type={Lead}
                style='serif'
                dangerouslySetInnerHTML={{
                  __html: t('Account/lead')
                }}
              />
            </div>
          )}
          <div style={{ marginBottom: 80 }} />
          {(hasPledges || hasMemberships) &&
          !!me.name && (
            <div style={{ marginTop: 80 }}>
              <UpdateMe />
              <br />
              <br />
              <UpdateProfile />
            </div>
          )}
        </div>
      )
    }}
  />
)

export default compose(withMe, withT)(Account)
