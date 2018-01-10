import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import { Router } from '../../lib/routes'

import Loader from '../Loader'
import Me from '../Auth/Me'
import Meta from '../Frame/Meta'

import {
  Interaction,
  NarrowContainer
} from '@project-r/styleguide'

const getRedirect = gql`
query getRedirect($path: String!) {
  redirection(path: $path) {
    target
    status
  }
}
`

const ErrorComponent = ({statusCode, t, loading, children}) => (
  <Loader loading={loading} render={() => (
    <NarrowContainer style={{marginTop: 60}}>
      <Meta data={{title: statusCode}} />
      <Interaction.H1>{statusCode}</Interaction.H1>
      <br />
      <br />
      <br />
      {children || <Interaction.P>{t(`error/${statusCode}`, undefined, null)}</Interaction.P>}
      <br />
      <br />
      <Me />
    </NarrowContainer>
  )} />
)

export default compose(
  withT,
  graphql(getRedirect, {
    skip: props => props.statusCode !== 404 || !props.url.asPath,
    options: ({url: {asPath}}) => ({
      variables: {
        path: asPath.split('?')[0]
      }
    }),
    props: ({data, ownProps: {serverContext, statusCode, url, me}}) => {
      const redirection =
        !data.error &&
        !data.loading &&
        data.redirection

      if (redirection) {
        if (serverContext) {
          serverContext.res.redirect(redirection.status || 302, redirection.target)
          serverContext.res.end()
        } else {
          if (redirection.status === 301) {
            Router.replaceRoute(redirection.target)
          } else {
            Router.pushRoute(redirection.target)
          }
        }
      } else {
        if (serverContext) {
          serverContext.res.statusCode = statusCode
        }
      }

      return {
        loading: data.loading
      }
    }
  })
)(ErrorComponent)
