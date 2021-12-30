import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'

import withT from '../../../lib/withT'
import { useInNativeApp } from '../../../lib/withInNativeApp'

import Loader from '../../Loader'
import UserGuidance from '../UserGuidance'

import AccessGrants from '../../Access/Grants'
import SignIn from '../../Auth/SignIn'
import withMembership from '../../Auth/withMembership'
import Box from '../../Frame/Box'

import { Interaction } from '@project-r/styleguide'

import belongingsQuery from '../belongingsQuery'
import MembershipList from '../Memberships/List'
import PaymentSources from '../PaymentSources'
import AccountSection from '../AccountSection'

const { H1, P } = Interaction

const Memberships = ({
  loading,
  error,
  t,
  me,
  hasMemberships,
  hasActiveMemberships,
  hasAccessGrants,
  paymentMethodCompany
}) => {
  const { query } = useRouter()
  const { inNativeIOSApp } = useInNativeApp()

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

            {!inNativeIOSApp && (
              <AccountSection id='abos' title={t('memberships/title/other')}>
                <MembershipList highlightId={query.id} />
              </AccountSection>
            )}

            {!inNativeIOSApp && paymentMethodCompany && (
              <AccountSection
                id='payment'
                title={t('memberships/title/payment')}
              >
                <PaymentSources company={paymentMethodCompany} query={query} />
              </AccountSection>
            )}
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
      const monthlyMembership =
        isReady &&
        hasMemberships &&
        data.me.memberships.find(m => m.type.name === 'MONTHLY_ABO')
      const hasPledges = isReady && data.me.pledges && !!data.me.pledges.length
      const hasAccessGrants =
        isReady && data.me.accessGrants && !!data.me.accessGrants.length
      const autoPayMembership =
        (hasMemberships &&
          data.me.memberships.find(
            m =>
              m.active &&
              m.renew &&
              (m.type.name === 'MONTHLY_ABO' || m.autoPay)
          )) ||
        (!hasActiveMemberships && monthlyMembership)

      const paymentMethodCompany =
        autoPayMembership && autoPayMembership.pledge.package.company
      return {
        loading: data.loading,
        error: data.error,
        hasPledges,
        hasMemberships,
        hasActiveMemberships,
        hasAccessGrants,
        paymentMethodCompany
      }
    }
  })
)(Memberships)
