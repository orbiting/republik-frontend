import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withInNativeApp from '../../lib/withInNativeApp'
import { Link } from '../../lib/routes'

const tokenQuery = gql`
query accessTokenCustomPledge {
  me {
    id
    accessToken(scope: CUSTOM_PLEDGE)
  }
}
`

const TokenPackageLink = compose(
  withInNativeApp,
  graphql(tokenQuery, {
    skip: props => !props.inNativeApp,
    props: ({ data }) => ({
      loading: data.loading,
      accessToken: data.me && data.me.accessToken
    })
  })
)(({ loading, accessToken, children, params, inNativeApp, inNativeIOSApp, ...props }) => {
  if (loading) {
    return '...'
  }
  const p = { ...params }
  if (accessToken) {
    p.token = accessToken
  }
  return <Link route='pledge' {...props} params={p}>
    {children}
  </Link>
})

export default TokenPackageLink
