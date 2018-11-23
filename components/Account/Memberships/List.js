import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import withT from '../../../lib/withT'
import withMe from '../../../lib/apollo/withMe'

import {
  Interaction, Loader
} from '@project-r/styleguide'

import query from '../belongingsQuery'

import Manage from './Manage'

const { H2 } = Interaction

class MembershipsList extends Component {
  render () {
    const {
      memberships, t,
      loading, error,
      highlightId,
      prolongIds,
      accessToken,
      waitingMemberships
    } = this.props
    return (
      <Loader loading={loading} error={error} render={() => {
        if (!memberships.length) {
          return null
        }

        return (
          <div>
            <H2>{t.pluralize('memberships/title', {
              count: memberships.length
            })}</H2>
            {memberships.map(membership => (
              <Manage key={membership.id}
                membership={membership}
                prolong={prolongIds.includes(membership.id)}
                accessToken={accessToken}
                highlighted={highlightId === membership.pledge.id}
                waitingMemberships={waitingMemberships} />
            ))}
          </div>
        )
      }} />
    )
  }
}

export default compose(
  withMe,
  graphql(query, {
    props: ({ data, ownProps: { me } }) => {
      const prolongPackage = (
        data.me &&
        data.me.customPackages &&
        data.me.customPackages.find(p => p.name === 'PROLONG')
      )

      const memberships = (
        !data.loading &&
        !data.error &&
        data.me &&
        data.me.memberships &&
        data.me.memberships.filter(m => (
          m.pledge.package.name !== 'ABO_GIVE' ||
          (me.id === m.user.id && !m.voucherCode)
        ))
      ) || []
      return {
        loading: data.loading,
        error: data.error,
        accessToken: data.me && data.me.accessToken,
        prolongIds: (
          prolongPackage && prolongPackage.options
            .filter(option => option.membership)
            .map(option => option.membership.id)
        ) || [],
        memberships,
        waitingMemberships: memberships.some(m => !m.active && !m.periods.length)
      }
    }
  }),
  withT
)(MembershipsList)
