import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'

import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import { Router, cleanAsPath } from '../../lib/routes'
import { PUBLIC_BASE_URL } from '../../lib/constants'

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

const StatusError = ({ statusCode, t, loading, children }) => (
  <Loader loading={loading} render={() => (
    <Fragment>
      <Meta data={{ title: statusCode }} />
      <ErrorFrame statusCode={statusCode}>
        {children || <Interaction.P>{t(`error/${statusCode}`, undefined, null)}</Interaction.P>}
        <div style={{ height: 60 }} />
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
  withInNativeApp,
  withRouter,
  graphql(getRedirect, {
    skip: props => props.statusCode !== 404 || !props.router.asPath,
    options: ({ router: { asPath } }) => ({
      variables: {
        path: cleanAsPath(asPath)
      }
    }),
    props: ({ data, ownProps: { serverContext, statusCode, router, inNativeApp, me } }) => {
      const redirection =
        !data.error &&
        !data.loading &&
        data.redirection

      let loading = data.loading

      if (redirection) {
        const [pathname, query] = router.asPath.split('?')
        const withQuery = query && redirectionPathWithQuery.indexOf(pathname) !== -1
        const target = `${redirection.target}${withQuery ? `?${query}` : ''}`
        const targetIsExternal = target.startsWith('http') && !target.startsWith(PUBLIC_BASE_URL)

        if (serverContext) {
          if (!inNativeApp || !targetIsExternal) {
            serverContext.res.redirect(
              redirection.status || 302,
              target
            )
          } else {
            loading = true
          }
          serverContext.res.end()
        } else {
          loading = true
          let clientTarget = target
          let afterRouting
          if (inNativeApp && targetIsExternal) {
            clientTarget = '/feed'
            afterRouting = () => {
              window.location = target
            }
          }
          if (redirection.status === 301) {
            Router.replaceRoute(clientTarget).then(afterRouting)
          } else {
            Router.pushRoute(clientTarget).then(afterRouting)
          }
        }
      } else {
        if (serverContext) {
          serverContext.res.statusCode = statusCode
        }
      }

      return {
        loading
      }
    }
  })
)(StatusError)
