import React, { Fragment, Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { max } from 'd3-array'
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
import PledgeList from './PledgeList'
import Onboarding from './Onboarding'
import Access from './Access'
import SignIn from '../Auth/SignIn'
import withMembership from '../Auth/withMembership'
import NotificationsLegacy from './NotificationsLegacy'
import Box from '../Frame/Box'

import { H1, Interaction, mediaQueries } from '@project-r/styleguide'

import query from './belongingsQuery'

import MembershipList from './Memberships/List'
import PaymentSources from './PaymentSources'

import { APP_OPTIONS } from '../../lib/constants'

import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../constants'

const { H2, P } = Interaction

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

class Account extends Component {
  componentDidMount() {
    if (window.location.hash.substr(1).length > 0) {
      const node = document.getElementById(window.location.hash.substr(1))

      if (node) {
        node.scrollIntoView()
      }
    }
  }

  render() {
    const {
      loading,
      error,
      me,
      t,
      query,
      hasMemberships,
      hasActiveMemberships,
      hasAccessGrants,
      acceptedStatue,
      paymentMethodCompany,
      hasPledges,
      merci,
      inNativeIOSApp,
      isMember
    } = this.props

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          if (!me) {
            return (
              <MainContainer>
                <Content>
                  <H1>{t('account/signedOut/title')}</H1>
                  <P>{t('account/signedOut/signIn')}</P>
                  <SignIn email={query.email} />
                </Content>
              </MainContainer>
            )
          }

          return (
            <Fragment>
              {hasAccessGrants && !hasActiveMemberships && <AccessGrants />}
              {!hasAccessGrants && !hasMemberships && <UserGuidance />}
              <MainContainer>
                <Content>
                  {!merci && (
                    <H1>
                      {t.first(
                        [
                          me.name && 'Account/title/name',
                          'Account/title'
                        ].filter(Boolean),
                        {
                          name: me.name
                        }
                      )}
                    </H1>
                  )}

                  <Anchors />

                  {inNativeIOSApp && (
                    <Box style={{ padding: 14, marginBottom: 20 }}>
                      <P>{t('account/ios/box')}</P>
                    </Box>
                  )}

                  {isMember && (
                    <AccountAnchor id='onboarding'>
                      <Onboarding />
                    </AccountAnchor>
                  )}

                  {!inNativeIOSApp && (
                    <AccountAnchor id='abos'>
                      <MembershipList highlightId={query.id} />
                      {paymentMethodCompany && (
                        <PaymentSources
                          companyName={paymentMethodCompany}
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
            </Fragment>
          )
        }}
      />
    )
  }
}
export default compose(
  withMe,
  withT,
  withInNativeApp,
  withMembership,
  graphql(query, {
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
        autoPayMembership && autoPayMembership.pledge.package.company.name

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
