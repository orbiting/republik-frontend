import React, { Component } from 'react'
import withData from '../lib/apollo/withData'

import {
  NarrowContainer
} from '@project-r/styleguide'

import {
  CDN_FRONTEND_BASE_URL, CROWDFUNDING_NAME, SALES_UP
} from '../lib/constants'

import Frame from '../components/Frame'
import PledgeForm from '../components/Pledge/Form'
import PledgeReceivePayment from '../components/Pledge/ReceivePayment'

const PLEDGE_CROWDFUNDING_NAME = SALES_UP || CROWDFUNDING_NAME

class PledgePage extends Component {
  render () {
    const meta = {
      title: 'Jetzt Mitglied und Abonnentin werden',
      description: 'Lasst uns gemeinsam ein neues Fundament für unabhängigen Journalismus bauen!',
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
    }

    const {url} = this.props

    let pledgeId
    if (url.query.orderID) {
      pledgeId = url.query.orderID.split('_')[0]
    }
    if (url.query.item_name) {
      pledgeId = url.query.item_name.split('_')[0]
    }
    if (url.query.pledgeId) {
      pledgeId = url.query.pledgeId
    }

    return (
      <Frame meta={meta} url={url}>
        <NarrowContainer>
          {pledgeId ? (
            <PledgeReceivePayment
              crowdfundingName={PLEDGE_CROWDFUNDING_NAME}
              pledgeId={pledgeId}
              query={url.query} />
          ) : (
            <PledgeForm
              crowdfundingName={PLEDGE_CROWDFUNDING_NAME}
              query={url.query} />
          )}
        </NarrowContainer>
      </Frame>
    )
  }
}

export default withData(PledgePage)
