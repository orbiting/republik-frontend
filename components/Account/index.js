import React, { Fragment} from 'react'
import { compose, graphql } from 'react-apollo'
import { max } from 'd3-array'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import { Content, MainContainer } from '../Frame'
import Loader from '../Loader'
import UserGuidance from './UserGuidance'
import UpdateMe from './UpdateMe'
import UpdateEmail from './UpdateEmail'

import AuthSettings from './AuthSettings'
import PledgeList from './PledgeList'
import NewsletterSubscriptions from './NewsletterSubscriptions'
import NotificationOptions from './NotificationOptions'
import SignIn from '../Auth/SignIn'

import {
  H1, Interaction
} from '@project-r/styleguide'

import query from './belongingsQuery'

import MembershipList from './Memberships/List'
import PaymentSources from './PaymentSources'

import { APP_OPTIONS } from '../../lib/constants'

const { H2, P } = Interaction

const Account = ({ loading, error, me, t, query, hasMemberships, acceptedStatue, recurringAmount, hasPledges, merci }) => (
  <Loader
    loading={loading}
    error={error}
    render={() => {
      if (!me) {
        return (
          <MainContainer>
            <Content>
              <H1>{t('account/signedOut/title')}</H1>
              <P>
                {t('account/signedOut/signIn')}
              </P>
              <SignIn email={query.email} />
            </Content>
          </MainContainer>
        )
      }

      return (
        <Fragment>
          {!hasMemberships && <UserGuidance />}
          <MainContainer>
            <Content>
              {!merci && <H1>
                {t('Account/title', {
                  nameOrEmail: me.name || me.email
                })}
              </H1>}
              <MembershipList highlightId={query.id} />

              {recurringAmount > 0 &&
                <PaymentSources query={query} total={recurringAmount} />}

              <UpdateEmail />
              <UpdateMe acceptedStatue={acceptedStatue} />

              {(hasPledges || !hasMemberships) && (
                <H2 style={{marginTop: 80}}>{t('account/pledges/title')}</H2>
              )}
              <PledgeList highlightId={query.id} />
              <H2 style={{marginTop: 80}} id='newsletter'>
                {t('account/newsletterSubscriptions/title')}
              </H2>
              <NewsletterSubscriptions />
              <H2 style={{marginTop: 80}} id='benachrichtigungen'>
                {t('account/notificationOptions/title')}
              </H2>
              <NotificationOptions />
              {APP_OPTIONS && <Fragment>
                <H2 style={{marginTop: 80}} id='anmeldung'>
                  {t('account/authSettings/title')}
                </H2>
                <AuthSettings />
              </Fragment>}
            </Content>
          </MainContainer>
        </Fragment>
      )
    }}
  />
)

export default compose(
  withMe,
  withT,
  graphql(query, {
    props: ({data}) => {
      const isReady = (
        !data.loading &&
        !data.error &&
        data.me
      )
      const hasMemberships = (
        isReady &&
        data.me.memberships &&
        !!data.me.memberships.length
      )
      const hasPledges = (
        isReady &&
        data.me.pledges &&
        !!data.me.pledges.length
      )
      return {
        loading: data.loading,
        error: data.error,
        hasPledges,
        acceptedStatue: (
          hasPledges &&
          !!data.me.pledges.find(pledge => (
            pledge.package.name !== 'MONTHLY_ABO' &&
            pledge.package.name !== 'DONATE'
          ))
        ),
        hasMemberships,
        recurringAmount: hasMemberships
          ? max(
            data.me.memberships.map(m => {
              const recurringOptions = m.pledge.options
                .filter(o => o.reward && o.reward.name === 'MONTHLY_ABO')
              return max(recurringOptions.map(o => o.price)) || 0
            })
          )
          : 0
      }
    }
  })
)(Account)
