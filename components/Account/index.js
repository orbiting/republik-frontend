import React from 'react'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import Loader from '../Loader'
import Share from '../Share'
import UpdateMe from './UpdateMe'
import UpdateProfile from './UpdateProfile'
import UpdateTestimonial from './UpdateTestimonial'

import { H1, Lead, P, RawHtml } from '@project-r/styleguide'
import { PUBLIC_BASE_URL } from '../../lib/constants'

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
                dangerouslySetInnerHTML={{
                  __html: t('Account/lead')
                }}
              />
              <P>
                <Share
                  url={`${PUBLIC_BASE_URL}/`}
                  tweet={t('Account/share/tweetTemplate')}
                  emailSubject={t('Account/share/emailSubject')}
                  emailBody={t('Account/share/emailBody', {
                    url: `${PUBLIC_BASE_URL}/`,
                    backerName: me.name
                  })}
                  emailAttachUrl={false} />
              </P>
            </div>
          )}
          <div style={{ marginBottom: 80 }} />
          {(hasPledges || hasMemberships) &&
          !!me.name && (
            <div style={{ marginTop: 80 }}>
              <UpdateTestimonial style={{marginBottom: 40}} />
              <UpdateProfile style={{marginBottom: 40}} />
              <UpdateMe />
            </div>
          )}
        </div>
      )
    }}
  />
)

export default compose(withMe, withT)(Account)
