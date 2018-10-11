import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import withT from '../../../lib/withT'

import { Interaction, Loader } from '@project-r/styleguide'

import query from '../belongingsQuery'

import Manage from './Manage'

const { H2 } = Interaction

class MembershipsList extends Component {
  render () {
    const {
      memberships, t,
      loading, error,
      highlightId
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
                highlighted={highlightId === membership.pledge.id} />
            ))}
          </div>
        )
      }} />
    )
  }
}

export default compose(
  graphql(query, {
    props: ({ data }) => {
      return {
        loading: data.loading,
        error: data.error,
        memberships: (
          (
            !data.loading &&
            !data.error &&
            data.me &&
            data.me.memberships &&
            data.me.memberships.filter(m => !m.voucherCode)
          ) || []
        )
      }
    }
  }),
  withT
)(MembershipsList)
