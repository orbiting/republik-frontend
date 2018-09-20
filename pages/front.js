import { Component } from 'react'
import { compose } from 'react-apollo'

import { Loader } from '@project-r/styleguide'

import { Router, routes } from '../lib/routes'
import Frame from '../components/Frame'
import Front from '../components/Front'
import StatusError from '../components/StatusError'

import withData from '../lib/apollo/withData'
import withMembership, { UnauthorizedPage } from '../components/Auth/withMembership'
import withInNativeApp from '../lib/withInNativeApp'

const KNOWN_PATHS = ['/feuilleton']

const isPathKnown = (url) => {
  return KNOWN_PATHS.indexOf(url.asPath.split('?')[0]) !== -1
}

class FrontPage extends Component {
  componentDidMount () {
    this.redirectUser()
  }

  componentDidUpdate () {
    this.redirectUser()
  }

  redirectUser () {
    const { url, isMember, inNativeIOSApp, serverContext } = this.props

    if (isPathKnown(url) && !isMember && !inNativeIOSApp) {
      if (serverContext) {
        const indexPath = routes
          .find(r => r.name === 'index')
          .toPath()

        serverContext.res.redirect(302, indexPath)
        serverContext.res.end()
      } else {
        Router.pushRoute('index')
      }
    }
  }

  render () {
    const { url, isMember, inNativeIOSApp, serverContext } = this.props

    if (isMember) {
      return <Front {...this.props} />
    }

    if (isPathKnown(url)) {
      if (inNativeIOSApp) {
        return <UnauthorizedPage {...this.props} />
      }

      // ... render Loader while redirect action is pushed to Router
      return (
        <Frame raw url={url}>
          <Loader loading style={{minHeight: 'calc(100vh - 80px)'}} />
        </Frame>
      )
    }

    // If path is neither known (nor is user a member), render a 404 Not Found
    // status page.
    return (
      <Frame raw url={url}>
        <StatusError
          url={url}
          statusCode={404}
          serverContext={serverContext} />
      </Frame>
    )
  }
}

export default compose(
  withData,
  withMembership,
  withInNativeApp
)(FrontPage)
