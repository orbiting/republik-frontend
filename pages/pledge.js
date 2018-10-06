import React, { Component } from 'react'
import { withRouter } from 'next/router'
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

    const { router: { query } } = this.props

    let pledgeId
    if (query.orderID) {
      pledgeId = query.orderID.split('_')[0]
    }
    if (query.item_name) {
      pledgeId = query.item_name.split('_')[0]
    }
    if (query.pledgeId) {
      pledgeId = query.pledgeId
    }

    return (
      <Frame meta={meta}>
        <NarrowContainer>
          {pledgeId ? (
            <PledgeReceivePayment
              crowdfundingName={PLEDGE_CROWDFUNDING_NAME}
              pledgeId={pledgeId}
              query={query} />
          ) : (
            <PledgeForm
              crowdfundingName={PLEDGE_CROWDFUNDING_NAME}
              query={query} />
          )}
        </NarrowContainer>
      </Frame>
    )
  }
}

export default withData(withRouter(PledgePage))
