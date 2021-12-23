import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { css } from 'glamor'

import withT from '../../../lib/withT'
import { useInNativeApp } from '../../../lib/withInNativeApp'

import Loader from '../../Loader'
import UserGuidance from '../UserGuidance'
import NameAddress from '../UserInfo/NameAddress'
import UpdateEmail, { UserEmail } from '../UserInfo/Email'

import AccessGrants from '../../Access/Grants'
import SignIn from '../../Auth/SignIn'
import withMembership from '../../Auth/withMembership'
import Box from '../../Frame/Box'

import { Interaction, mediaQueries } from '@project-r/styleguide'

import belongingsQuery from '../belongingsQuery'
import MembershipList from '../Memberships/List'
import PaymentSources from '../PaymentSources'
import AccountSection from '../AccountSection'

const { H1, P } = Interaction

const styles = {
  updateContainer: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    }
  })
}

const Memberships = ({
  loading,
  error,
  t,
  me,
  hasMemberships,
  hasActiveMemberships,
  hasAccessGrants,
  acceptedStatue,
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

            <AccountSection id='account' title={t('Account/Update/title')}>
              <div {...styles.updateContainer}>
                <div style={{ flex: 1 }}>
                  <NameAddress
                    acceptedStatue={acceptedStatue}
                    hasMemberships={hasMemberships}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <UserEmail />
                  <UpdateEmail />
                </div>
              </div>
            </AccountSection>
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
        acceptedStatue:
          hasPledges &&
          !!data.me.pledges.find(
            pledge =>
              pledge.package.name !== 'MONTHLY_ABO' &&
              pledge.package.name !== 'DONATE'
          ),
        hasMemberships,
        hasActiveMemberships,
        hasAccessGrants,
        paymentMethodCompany
      }
    }
  })
)(Memberships)
