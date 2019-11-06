import React, { Component, Fragment } from 'react'
import { withRouter } from 'next/router'
import { compose } from 'react-apollo'
import SignIn from '../components/Auth/SignIn'
import Frame from '../components/Frame'
import Loader from '../components/Loader'
import { PageCenter } from '../components/Auth/withAuthorization'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'
import withMembership from '../components/Auth/withMembership'
import withInNativeApp from '../lib/withInNativeApp'
import { Link } from '../lib/routes'
import { Interaction, Editorial } from '@project-r/styleguide'

class SigninPage extends Component {
  componentDidMount() {
    this.redirectUser()
  }

  componentDidUpdate() {
    this.redirectUser()
  }

  redirectUser() {
    const { isMember, me } = this.props
    if (isMember) {
      window.location = '/'
      return
    }
    if (me) {
      window.location = '/konto'
    }
  }

  render() {
    const { t, me, inNativeIOSApp, router } = this.props
    const meta = {
      title: t('pages/signin/title')
    }

    return (
      <Frame meta={meta}>
        <PageCenter>
          {me ? (
            <Loader loading />
          ) : (
            <SignIn
              email={router.query.email}
              beforeForm={
                inNativeIOSApp ? (
                  <Fragment>
                    <Interaction.P style={{ marginBottom: 20 }}>
                      {t('withMembership/ios/unauthorized/signIn')}
                    </Interaction.P>
                    <Interaction.P>
                      {t.elements('withMembership/ios/unauthorized/claimText', {
                        claimLink: (
                          <Link route='claim' key='claim' passHref>
                            <Editorial.A>
                              {t('withMembership/ios/unauthorized/claimLink')}
                            </Editorial.A>
                          </Link>
                        )
                      })}
                    </Interaction.P>
                  </Fragment>
                ) : (
                  undefined
                )
              }
              noReload
            />
          )}
        </PageCenter>
      </Frame>
    )
  }
}

export default compose(
  withMe,
  withMembership,
  withInNativeApp,
  withT,
  withRouter
)(SigninPage)
