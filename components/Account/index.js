import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import { useMe } from '../../lib/context/MeContext'
import { useInNativeApp } from '../../lib/withInNativeApp'

import Loader from '../Loader'
import UserGuidance from './UserGuidance'
import UpdateMe from './UpdateMe'
import UpdateEmail from './UpdateEmail'

import AccessGrants from '../Access/Grants'
import NewsletterSubscriptions from './NewsletterSubscriptions'
import Onboarding from './Onboarding'
import Access from './Access'
import SignIn from '../Auth/SignIn'
import withMembership from '../Auth/withMembership'
import NotificationsLegacy from './NotificationsLegacy'
import Box from '../Frame/Box'

import { Interaction } from '@project-r/styleguide'

import belongingsQuery from './belongingsQuery'

import MembershipList from './Memberships/List'
import PaymentSources from './PaymentSources'

import AccountAnchor from './AccountAnchor'

const { H1, H2, P } = Interaction

const Account = ({
  loading,
  error,
  t,
  hasMemberships,
  hasActiveMemberships,
  hasAccessGrants,
  acceptedStatue,
  paymentMethodCompany,
  isMember
}) => {
  const { query } = useRouter()
  const { inNativeIOSApp } = useInNativeApp()
  const { me } = useMe()

  useEffect(() => {
    if (window.location.hash.substr(1).length > 0) {
      const node = document.getElementById(window.location.hash.substr(1))

      if (node) {
        node.scrollIntoView()
      }
    }
  }, [])

  return (
    <Loader
      loading={loading}
      error={error}
      render={() => {
        if (!me) {
          return (
            <>
              <H1 style={{ marginBottom: 22 }}>
                {t('account/signedOut/title')}
              </H1>
              <P>{t('account/signedOut/signIn')}</P>
              <SignIn email={query.email} />
            </>
          )
        }

        return (
          <>
            {hasAccessGrants && !hasActiveMemberships && <AccessGrants />}
            {!hasAccessGrants && !hasMemberships && <UserGuidance />}
            {inNativeIOSApp && (
              <Box style={{ padding: 14, marginBottom: 20 }}>
                <P>{t('account/ios/box')}</P>
              </Box>
            )}

            {isMember && <Onboarding />}

            {!inNativeIOSApp && (
              <AccountAnchor id='abos'>
                <MembershipList highlightId={query.id} />
                {paymentMethodCompany && (
                  <PaymentSources
                    company={paymentMethodCompany}
                    query={query}
                  />
                )}
              </AccountAnchor>
            )}

            {hasActiveMemberships && (
              <AccountAnchor id='teilen'>
                <Access />
              </AccountAnchor>
            )}

            <AccountAnchor id='email'>
              <UpdateEmail />
            </AccountAnchor>

            <AccountAnchor id='account'>
              <UpdateMe
                acceptedStatue={acceptedStatue}
                hasMemberships={hasMemberships}
              />
            </AccountAnchor>

            <AccountAnchor id='newsletter'>
              <H2>{t('account/newsletterSubscriptions/title')}</H2>
              <NewsletterSubscriptions />
            </AccountAnchor>

            <AccountAnchor id='benachrichtigungen'>
              <NotificationsLegacy />
            </AccountAnchor>
          </>
        )
      }}
    />
  )
}

export default compose(
  withT,
  withMembership,
  graphql(belongingsQuery, {
    props: ({ data }) => {
      const isReady = !data.loading && !data.error && data.me
      const hasMemberships =
        isReady && data.me.memberships && !!data.me.memberships.length
      const hasActiveMemberships =
        isReady && hasMemberships && data.me.memberships.some(m => m.active)

      const hasPledges = isReady && data.me.pledges && !!data.me.pledges.length
      const hasAccessGrants =
        isReady && data.me.accessGrants && !!data.me.accessGrants.length

      return {
        loading: data.loading,
        error: data.error,
        hasPledges,
        acceptedStatue:
          hasPledges &&
          !!data.me.pledges.find(
            pledge =>
              pledge.package.name !== 'MONTHLY_ABO' &&
              pledge.package.name !== 'DONATE'
          ),
        hasMemberships,
        hasActiveMemberships,
        hasAccessGrants
      }
    }
  })
)(Account)
