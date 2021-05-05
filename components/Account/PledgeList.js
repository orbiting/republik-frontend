import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import { timeFormat, chfFormat } from '../../lib/utils/format'
import track from '../../lib/piwik'
import { Link } from '../../lib/routes'

import List, { Item } from '../List'
import { Item as AccountItem } from './Elements'

import GiveMemberships from './Memberships/Give'

import query from './belongingsQuery'

import { A, useColorContext } from '@project-r/styleguide'
import { AnchorLink } from './Anchors'
import Payment from './Payment'
import { css, nthChild } from 'glamor'

const dayFormat = timeFormat('%d. %B %Y')

const styles = {
  list: css({
    textAlign: 'left',
    width: '100%',
    '& tr:nth-child(even)': {
      backgroundColor: '#F6F8F7' // TODO dark mode, color context
    }
  })
}

class PledgeList extends Component {
  componentDidMount() {
    const { pledges } = this.props
    pledges.forEach(pledge => {
      pledge.options.forEach(option => {
        track([
          'addEcommerceItem',
          option.templateId, // (required) SKU: Product unique identifier
          option.reward ? option.reward.name : 'DONATE',
          // (optional) Product name
          undefined, // (optional) Product category
          option.price / 100, // (recommended) Product price
          option.amount // (optional, default to 1) Product quantity
        ])
      })
      track([
        'trackEcommerceOrder',
        pledge.id, // (required) Unique Order ID
        pledge.total / 100, // (required) Order Revenue grand total (includes tax, shipping, and subtracted discount)
        undefined, // (optional) Order sub total (excludes shipping)
        undefined, // (optional) Tax amount
        undefined, // (optional) Shipping amount
        pledge.donation < 0 // (optional) Discount offered (set to false for unspecified parameter)
      ])
    })
  }
  render() {
    const { pledges, t, highlightId, me } = this.props

    // const colorContext = this.context

    return (
      <table {...styles.list}>
        <tr>
          <th>Datum</th>
          <th>Produkt</th>
          <th>Preis</th>
        </tr>
        {pledges.map(p => {
          const flattenedPayments = p.payments.map(payment => {
            return {
              name: p.package.name,
              ...payment
            }
          })

          return flattenedPayments.map((payment, index) => {
            return (
              <Fragment key={index}>
                <Payment payment={payment} />
              </Fragment>
            )
          })
        })}
      </table>
    )
  }
}

export default compose(
  withT,
  withMe,
  graphql(query, {
    props: ({ data }) => {
      return {
        loading: data.loading,
        error: data.error,
        pledges: (
          (!data.loading && !data.error && data.me && data.me.pledges) ||
          []
        ).filter(pledge => pledge.status !== 'DRAFT')
      }
    }
  })
)(PledgeList)
