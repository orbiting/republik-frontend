import React, { Component } from 'react'
import { withRouter } from 'next/router'

import { NarrowContainer } from '@project-r/styleguide'

import { CROWDFUNDING_PLEDGE } from '../lib/constants'
import { Router } from '../lib/routes'

import Frame from '../components/Frame'
import PledgeForm from '../components/Pledge/Form'
import PledgeReceivePayment from '../components/Pledge/ReceivePayment'

import { PSP_PLEDGE_ID_QUERY_KEYS } from '../components/Payment/constants'

class PledgePage extends Component {
  render() {
    const {
      router: { query },
      serverContext
    } = this.props

    const queryKey = PSP_PLEDGE_ID_QUERY_KEYS.find(key => query[key])
    const pledgeId = queryKey && query[queryKey].split('_')[0]

    if (query.goto === 'cockpit') {
      if (serverContext) {
        serverContext.res.redirect(
          302,
          `/cockpit${query.token ? `?token=${query.token}` : ''}${
            query.hash ? `#${query.hash}` : ''
          }`
        )
        serverContext.res.end()
      } else if (process.browser) {
        // SSR does two two-passes: data (with serverContext) & render (without)
        Router.replaceRoute('cockpit', { token: query.token })
      }
    }
    if (query.goto === 'crowdfunding2') {
      if (serverContext) {
        serverContext.res.redirect(
          302,
          `/maerzkampagne${query.token ? `?token=${query.token}` : ''}${
            query.hash ? `#${query.hash}` : ''
          }`
        )
        serverContext.res.end()
      } else if (process.browser) {
        // SSR does two two-passes: data (with serverContext) & render (without)
        Router.replaceRoute('crowdfunding2', { token: query.token })
      }
    }
    if (query.goto === 'account') {
      if (serverContext) {
        serverContext.res.redirect(
          302,
          `/konto${query.token ? `?token=${query.token}` : ''}${
            query.hash ? `#${query.hash}` : ''
          }`
        )
        serverContext.res.end()
      } else if (process.browser) {
        // SSR does two two-passes: data (with serverContext) & render (without)
        Router.replaceRoute('account', { token: query.token })
      }
    }

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
