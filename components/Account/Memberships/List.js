import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import withT from '../../../lib/withT'
import withMe from '../../../lib/apollo/withMe'

import { Interaction, Loader } from '@project-r/styleguide'

import query from '../belongingsQuery'

import Manage from './Manage'

import Box from '../../Frame/Box'

const { H2, P } = Interaction

class MembershipsList extends Component {
  render() {
    const {
      memberships,
      t,
      loading,
      error,
      highlightId,
      waitingMemberships
    } = this.props

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          if (!memberships.length) {
            return null
          }

          return (
            <div>
              <H2>
                {t.pluralize('memberships/title', {
                  count: memberships.length
                })}
              </H2>
              {!memberships.find(membership => membership.active) && (
                <Box style={{ padding: '15px 20px', margin: '1em 0em' }}>
                  <P>{t('memberships/noActive')}</P>
                </Box>
              )}
              {memberships.map(membership => (
                <Manage
                  key={membership.id}
                  membership={membership}
                  highlighted={highlightId === membership.pledge.id}
                  waitingMemberships={waitingMemberships}
                />
              ))}
            </div>
          )
        }}
      />
    )
  }
}

export default compose(
  withMe,
  graphql(query, {
    props: ({ data, ownProps: { me } }) => {
      const memberships =
        (!data.loading &&
          !data.error &&
          data.me &&
          data.me.memberships &&
          data.me.memberships.filter(
            m =>
              m.pledge.package.group !== 'GIVE' ||
              (me.id === m.user.id && !m.voucherCode && !m.accessGranted)
          )) ||
        []

      return {
        loading: data.loading,
        error: data.error,
        memberships,
        waitingMemberships: memberships.some(
          m => !m.active && !m.periods.length
        )
      }
    }
  }),
  withT
)(MembershipsList)
