import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'

import withT from '../../../lib/withT'

import {
  Interaction, Loader
} from '@project-r/styleguide'

import { Item as AccountItem, P } from '../Elements'

import { timeFormat } from '../../../lib/utils/format'

import query from '../belongingsQuery'

const {H2} = Interaction

const dayFormat = timeFormat('%d. %B %Y')

class MembershipsList extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
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
            {memberships.map(membership => {
              const createdAt = new Date(membership.createdAt)
              const latestPeriod = membership.periods[0]
              const formattedEndDate = dayFormat(new Date(latestPeriod.endDate))

              return (
                <AccountItem key={membership.id}
                  highlighted={highlightId === membership.pledge.id}
                  createdAt={createdAt}
                  title={[
                    t(
                      `memberships/type/${membership.type.name}`,
                      {},
                      membership.type.name
                    ),
                    `(${t('memberships/sequenceNumber/suffix', membership)})`
                  ].join(' ')}>
                  <P>
                    {membership.active && !membership.overdue && t.first(
                      [
                        `memberships/${membership.type.name}/latestPeriod/renew/${membership.renew}`,
                        `memberships/latestPeriod/renew/${membership.renew}`
                      ],
                      { formattedEndDate },
                      ''
                    )}
                    {membership.overdue && t(
                      'memberships/latestPeriod/overdue',
                      { formattedEndDate }
                    )}
                  </P>
                </AccountItem>
              )
            })}
          </div>
        )
      }} />
    )
  }
}

export default compose(
  graphql(query, {
    props: ({data}) => {
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
