import React from 'react'
import { compose, graphql } from 'react-apollo'
import { max } from 'd3-array'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import Loader from '../Loader'
import UpdateMe from './UpdateMe'
import PledgeList from './PledgeList'
import NewsletterSubscriptions from './NewsletterSubscriptions'
import SignIn from '../Auth/SignIn'

import {
  H1, Interaction
} from '@project-r/styleguide'

import query from './belongingsQuery'

import MembershipList from './Memberships/List'
import PaymentSources from './PaymentSources'

const { H2, P } = Interaction

const Account = ({ loading, error, me, t, query, hasMemberships, acceptedStatue, recurringAmount, hasPledges, merci }) => (
  <Loader
    loading={loading}
    error={error}
    render={() => {
      if (!me) {
        return (
          <div>
            <H1>{t('account/signedOut/title')}</H1>
            <P>
              {t('account/signedOut/signIn')}
            </P>
            <SignIn email={query.email} />
          </div>
        )
      }

      return (
        <div>
          {!merci && <H1>
            {t('Account/title', {
              nameOrEmail: me.name || me.email
            })}
          </H1>}
          <MembershipList highlightId={query.id} />

          {recurringAmount > 0 &&
            <PaymentSources query={query} total={recurringAmount} />}

          <UpdateMe acceptedStatue={acceptedStatue} />

          {(hasPledges || !hasMemberships) && (
            <H2 style={{marginTop: 80}}>{t('account/pledges/title')}</H2>
          )}
          <PledgeList highlightId={query.id} />
          <H2 style={{marginTop: 80}} id='newsletter'>
            {t('account/newsletterSubscriptions/title')}
          </H2>
          <NewsletterSubscriptions />
        </div>
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
