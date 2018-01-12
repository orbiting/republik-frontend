import React, { Component } from 'react'
import { compose } from 'react-apollo'
import SignIn from '../components/Auth/SignIn'
import Frame from '../components/Frame'
import Loader from '../components/Loader'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'
import withMembership from '../components/Auth/withMembership'
import { Container } from '@project-r/styleguide'
import { Router } from '../lib/routes'

class SigninPage extends Component {
  componentDidUpdate () {
    const { isAuthorized, me } = this.props
    if (isAuthorized) {
      Router.pushRoute('index')
      return
    }
    if (me) {
      Router.pushRoute('account')
    }
  }

  render () {
    const { url, t, me } = this.props
    const meta = {
      title: t('pages/signin/title')
    }

    return (
      <Frame raw url={url} meta={meta}>
        <Container style={{ marginTop: 100, maxWidth: 600 }}>
          {/* TODO: some intro text. */}
          {!me ? <SignIn /> : <Loader loading />}
        </Container>
      </Frame>
    )
  }
}

export default compose(withData, withMe, withMembership, withT)(SigninPage)
