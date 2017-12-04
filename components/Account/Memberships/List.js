import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import withT from '../../../lib/withT'

import {
  Interaction, Label, Loader
} from '@project-r/styleguide'

import List, { Item } from '../../List'

import { timeFormat } from '../../../lib/utils/format'

import query from '../belongingsQuery'

const {H2} = Interaction

const dateTimeFormat = timeFormat('%d. %B %Y %H:%M')

class MembershipsList extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    const {
      memberships, t,
      loading, error
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
            <List>
              {memberships.map(membership => {
                const createdAt = new Date(membership.createdAt)

                return (
                  <Item key={membership.id}>
                    {t(
                      `memberships/type/${membership.type.name}`,
                      {},
                      membership.type.name
                    )}
                    {' '}({t('memberships/sequenceNumber/suffix', membership)})<br />
                    <Label>
                      {t('memberships/label', {
                        formattedDateTime: dateTimeFormat(createdAt)
                      })}
                    </Label>
                  </Item>
                )
              })}
            </List>
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
