import React, { Component } from 'react'
import { css, merge } from 'glamor'
import { compose, graphql } from 'react-apollo'
import withT from '../../lib/withT'

import { timeFormat, chfFormat } from '../../lib/utils/format'
import track from '../../lib/piwik'

import List, { Item } from '../List'

import GiveMemberships from './Memberships/Give'

import query from './belongingsQuery'

import {
  Interaction,
  RawHtml,
  Label,
  colors
} from '@project-r/styleguide'

const {H3} = Interaction

const dateTimeFormat = timeFormat('%d. %B %Y %H:%M')

const styles = {
  pledge: css({
    padding: 10,
    marginLeft: -10,
    marginRight: -10,
    marginBottom: 30
  }),
  pledgeHighlighted: css({
    backgroundColor: colors.primaryBg
  })
}

class PledgeList extends Component {
  componentDidMount () {
    const {pledges} = this.props
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
  render () {
    const { pledges, t, highlightId } = this.props

    return pledges.map(pledge => {
      const options = pledge.options.filter(option => (
        option.amount && option.minAmount !== option.maxAmount
      ))
      const createdAt = new Date(pledge.createdAt)

      return (
        <div key={pledge.id} {...merge(
          styles.pledge,
          highlightId === pledge.id && styles.pledgeHighlighted
        )}>
          <H3 style={{marginBottom: 0}}>
            {t(`package/${pledge.package.name}/title`)}
          </H3>
          <Label>
            {t('account/pledges/label', {
              formattedDateTime: dateTimeFormat(createdAt)
            })}
          </Label>
          <List>
            {!!options.length && options.map((option, i) => (
              <Item key={`option-${i}`}>
                {option.amount}
                {' '}
                {t.pluralize(`option/${option.reward.name}/label`, {
                  count: option.amount
                }, option.reward.name)}
              </Item>
            ))}
            {
              pledge.payments.map((payment, i) => (
                <Item key={`payment-${i}`}>
                  {payment.method === 'PAYMENTSLIP' && payment.status === 'WAITING' && (
                    <span>
                      <RawHtml dangerouslySetInnerHTML={{
                        __html: t(`account/pledges/payment/PAYMENTSLIP/paperInvoice/${+(payment.paperInvoice)}`)
                      }} />
                      <br /><br />
                    </span>
                  )}
                  <RawHtml dangerouslySetInnerHTML={{
                    __html: t.first([
                      `account/pledges/payment/status/${payment.method}/${payment.status}`,
                      `account/pledges/payment/status/generic/${payment.status}`
                    ], {
                      formattedTotal: chfFormat(payment.total / 100),
                      hrid: payment.hrid,
                      method: t(`account/pledges/payment/method/${payment.method}`)
                    })
                  }} />
                </Item>
              ))
            }
          </List>
          <GiveMemberships
            memberships={pledge.memberships}
            isGivePackage={pledge.package.name === 'ABO_GIVE'} />
        </div>
      )
    })
  }
}

export default compose(
  withT,
  graphql(query, {
    props: ({data}) => {
      return {
        loading: data.loading,
        error: data.error,
        pledges: (
          !data.loading &&
          !data.error &&
          data.me &&
          data.me.pledges
        ) || []
      }
    }
  })
)(PledgeList)
