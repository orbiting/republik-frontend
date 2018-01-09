import React, { Component } from 'react'
import { compose } from 'react-apollo'
import Router from 'next/router'
import SignIn from '../components/Auth/SignIn'
import Frame from '../components/Frame'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'
import withMembership from '../components/Auth/withMembership'
import { Container, Spinner } from '@project-r/styleguide'

class SigninPage extends Component {
  componentDidUpdate () {
    const { isAuthorized, me } = this.props
    if (isAuthorized) {
      Router.push('/')
      return
    }
    if (me) {
      Router.push('/account')
    }
  }

  render () {
    const { url, t, me } = this.props
    const meta = {
      title: t('pages/signin/title')
    }

    if (me) {
      return <Spinner />
    }
    return (
      <Frame raw url={url} meta={meta}>
        <Container style={{ marginTop: 100, maxWidth: 600 }}>
          {/* TODO: some intro text. */}
          <SignIn />
        </Container>
      </Frame>
    )
  }
}

export default compose(withData, withMe, withMembership, withT)(SigninPage)
