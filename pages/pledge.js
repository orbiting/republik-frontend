import React, { Component } from 'react'
import { withRouter } from 'next/router'

import { NarrowContainer } from '@project-r/styleguide'

import { CROWDFUNDING_PLEDGE } from '../lib/constants'

import Frame from '../components/Frame'
import PledgeForm from '../components/Pledge/Form'
import PledgeReceivePayment from '../components/Pledge/ReceivePayment'

import { PSP_PLEDGE_ID_QUERY_KEYS } from '../components/Payment/constants'

class PledgePage extends Component {
  render() {
    const {
      router: { query }
    } = this.props

    const queryKey = PSP_PLEDGE_ID_QUERY_KEYS.find(key => query[key])
    const pledgeId = queryKey && query[queryKey].split('_')[0]

    return (
      <Frame>
        <NarrowContainer>
          {pledgeId ? (
            <PledgeReceivePayment
              crowdfundingName={CROWDFUNDING_PLEDGE}
              pledgeId={pledgeId}
              query={query}
            />
          ) : (
            <PledgeForm crowdfundingName={CROWDFUNDING_PLEDGE} query={query} />
          )}
        </NarrowContainer>
      </Frame>
    )
  }
}

export default withRouter(PledgePage)
