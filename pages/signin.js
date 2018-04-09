import React, { Component } from 'react'
import { compose } from 'react-apollo'
import SignIn from '../components/Auth/SignIn'
import Frame from '../components/Frame'
import Loader from '../components/Loader'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'
import withMembership from '../components/Auth/withMembership'
import { Router } from '../lib/routes'

class SigninPage extends Component {
  componentDidUpdate () {
    const { isMember, me } = this.props
    if (isMember) {
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
      <Frame url={url} meta={meta}>
        <div style={{ margin: '40px auto 0 auto', maxWidth: 600 }}>
          {/* TODO: some intro text. */}
          {!me ? <SignIn /> : <Loader loading />}
        </div>
      </Frame>
    )
  }
}

export default compose(withData, withMe, withMembership, withT)(SigninPage)
