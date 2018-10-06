import React, { Component } from 'react'
import { compose } from 'react-apollo'
import SignIn from '../components/Auth/SignIn'
import Frame from '../components/Frame'
import Loader from '../components/Loader'
import { PageCenter } from '../components/Auth/withAuthorization'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'
import withMembership from '../components/Auth/withMembership'
import withInNativeApp from '../lib/withInNativeApp'
import { Interaction } from '@project-r/styleguide'

class SigninPage extends Component {
  componentDidMount () {
    this.redirectUser()
  }

  componentDidUpdate () {
    this.redirectUser()
  }

  redirectUser () {
    const { isMember, me } = this.props
    if (isMember) {
      window.location = '/'
      return
    }
    if (me) {
      window.location = '/konto'
    }
  }

  render () {
    const { t, me, inNativeIOSApp } = this.props
    const meta = {
      title: t('pages/signin/title')
    }

    return (
      <Frame meta={meta}>
        <PageCenter>
          {me
            ? <Loader loading />
            : <SignIn beforeForm={inNativeIOSApp
              ? <Interaction.P style={{marginBottom: 20}}>
                {t('withMembership/ios/unauthorized/signIn')}
              </Interaction.P>
              : undefined
            } noReload />}
        </PageCenter>
      </Frame>
    )
  }
}

export default compose(
  withData,
  withMe,
  withMembership,
  withInNativeApp,
  withT
)(SigninPage)
