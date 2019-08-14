import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'

import { Router } from '../lib/routes'
import Frame from '../components/Frame'
import Trial from '../components/Marketing/Trial'
import withT from '../lib/withT'
import {
  CDN_FRONTEND_BASE_URL,
  PUBLIC_BASE_URL
} from '../lib/constants'

const Page = ({ router, t }) => {
  const meta = {
    pageTitle: t('trial/meta/pageTitle'),
    title: t('trial/meta/title'),
    description: t('trial/meta/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }

  return (
    <Frame meta={meta}>
      <Trial />
    </Frame>
  )
}

export const TRIAL_QUERY = gql`
  query trailPrequisit {
    me {
      id
      activeMembership {
        id
      }
      accessGrants {
        id
      }
    }
  }
`

const maybeRedirect = graphql(TRIAL_QUERY, {
  props: ({ data, ownProps: { serverContext } }) => {
    const hasActiveMembership = !!data.me && !!data.me.activeMembership
    const hasAccessGrant = !!data.me && !!data.me.accessGrants && data.me.accessGrants.length > 0

    if (hasActiveMembership || hasAccessGrant) {
      if (serverContext) {
        serverContext.res.redirect(302, '/')
        serverContext.res.end()
      } else if (process.browser) {
        Router.replaceRoute('index', {})
      }
    }
  }
})

export default compose(maybeRedirect, withRouter, withT)(Page)
