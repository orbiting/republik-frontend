import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import { Router } from '../../lib/routes'

import Loader from '../Loader'
import Me from '../Auth/Me'
import Meta from '../Frame/Meta'

import ErrorFrame from './Frame'

import {
  Interaction
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
    <Fragment>
      <Meta data={{title: statusCode}} />
      <ErrorFrame statusCode={statusCode}>
        {children || <Interaction.P>{t(`error/${statusCode}`, undefined, null)}</Interaction.P>}
        <div style={{height: 60}} />
        <Me />
      </ErrorFrame>
    </Fragment>
  )} />
)

const redirectionPathWithQuery = [
  '/pledge',
  '/notifications',
  '/merci'
]

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
        const [pathname, query] = url.asPath.split('?')
        const withQuery = redirectionPathWithQuery.indexOf(pathname) !== -1
        const target = `${redirection.target}${withQuery ? `?${query}` : ''}`
        if (serverContext) {
          serverContext.res.redirect(
            redirection.status || 302,
            target
          )
          serverContext.res.end()
        } else {
          if (redirection.status === 301) {
            Router.replaceRoute(target)
          } else {
            Router.pushRoute(target)
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
