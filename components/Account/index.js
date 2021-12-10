import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { css } from 'glamor'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import withInNativeApp from '../../lib/withInNativeApp'

import { Content, MainContainer } from '../Frame'
import Loader from '../Loader'
import UserGuidance from './UserGuidance'
import UpdateMe from './UpdateMe'
import UpdateEmail from './UpdateEmail'

import Anchors from './Anchors'
import AccessGrants from '../Access/Grants'
import AuthSettings from './AuthSettings'
import NewsletterSubscriptions from './NewsletterSubscriptions'
import ProgressSettings from './ProgressSettings'
import PledgeList from './Transactions/PledgeList'
import Onboarding from './Onboarding'
import Access from './Access'
import SignIn from '../Auth/SignIn'
import withMembership from '../Auth/withMembership'
import NotificationsLegacy from './NotificationsLegacy'
import Box from '../Frame/Box'

import {
  Interaction,
  mediaQueries,
  Scroller,
  TabButton
} from '@project-r/styleguide'

import belongingsQuery from './belongingsQuery'

import MembershipList from './Memberships/List'
import PaymentSources from './PaymentSources'

import { APP_OPTIONS } from '../../lib/constants'

import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../constants'

const { H1, H2, P } = Interaction

const styles = {
  accountAnchor: css({
    display: 'block',
    visibility: 'hidden',
    position: 'relative',
    top: -(HEADER_HEIGHT_MOBILE + 20),
    [mediaQueries.mUp]: {
      top: -(HEADER_HEIGHT + 20)
    }
  })
}

const AccountAnchor = ({ children, id }) => {
  return (
    <div style={{ marginBottom: 80 }}>
      <a {...styles.accountAnchor} id={id} />
      {children}
    </div>
  )
}

const Account = ({
  loading,
  error,
  me,
  t,
  hasMemberships,
  hasActiveMemberships,
  hasAccessGrants,
  acceptedStatue,
  paymentMethodCompany,
  hasPledges,
  merci,
  inNativeIOSApp,
  isMember
}) => {
  const { query, pathname } = useRouter()
  const activeTab = query.tab || 'MEMBERSHIP'

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
            <MainContainer>
              <Content>
                <H1 style={{ marginBottom: 22 }}>
                  {t('account/signedOut/title')}
                </H1>
                <P>{t('account/signedOut/signIn')}</P>
                <SignIn email={query.email} />
              </Content>
            </MainContainer>
          )
        }

        return (
          <>
            {hasAccessGrants && !hasActiveMemberships && <AccessGrants />}
            {!hasAccessGrants && !hasMemberships && <UserGuidance />}
            <MainContainer>
              <Content>
                {inNativeIOSApp && (
                  <Box style={{ padding: 14, marginBottom: 20 }}>
                    <P>{t('account/ios/box')}</P>
                  </Box>
                )}
                <Scroller>
                  {['MEMBERSHIP', 'TRANSACTIONS', 'SETTINGS'].map((n, i) => (
                    <Link
                      href={{
                        pathname,
                        query: { tab: n }
                      }}
                      scroll={false}
                      passHref
                      key={n}
                    >
                      <TabButton
                        key={n}
                        text={t(`account/tabs/${n}`)}
                        isActive={n === activeTab}
                      />
                    </Link>
                  ))}
                </Scroller>

                <Anchors tab={activeTab} />

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

                {!inNativeIOSApp && (
                  <AccountAnchor id='pledges'>
                    {(hasPledges || !hasMemberships) && (
                      <H2>{t('account/pledges/title')}</H2>
                    )}
                    <PledgeList highlightId={query.id} />
                  </AccountAnchor>
                )}

                <AccountAnchor id='newsletter'>
                  <H2>{t('account/newsletterSubscriptions/title')}</H2>
                  <NewsletterSubscriptions />
                </AccountAnchor>

                <AccountAnchor id='benachrichtigungen'>
                  <NotificationsLegacy />
                </AccountAnchor>

                <AccountAnchor id='position'>
                  <H2>{t('account/progress/title')}</H2>
                  <ProgressSettings />
                </AccountAnchor>

                {APP_OPTIONS && (
                  <AccountAnchor id='anmeldung'>
                    <H2>{t('account/authSettings/title')}</H2>
                    <AuthSettings />
                  </AccountAnchor>
                )}
              </Content>
            </MainContainer>
          </>
        )
      }}
    />
  )
}

export default compose(
  withMe,
  withT,
  withInNativeApp,
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
        memberships: hasMemberships && data.me.memberships,
        hasAccessGrants,
        paymentMethodCompany
      }
    }
  })
)(Account)
