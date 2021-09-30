import React, { useEffect } from 'react'
import { withRouter } from 'next/router'
import compose from 'lodash/flowRight'

import SignIn from '../components/Auth/SignIn'
import Frame from '../components/Frame'
import Loader from '../components/Loader'
import { PageCenter } from '../components/Auth/withAuthorization'
import withMembership, {
  UnauthorizedMessage
} from '../components/Auth/withMembership'

import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'
import { useInNativeApp } from '../lib/withInNativeApp'
import withDefaultSSR from '../lib/hocs/withDefaultSSR'

const SigninPage = ({ me, isMember, t, router }) => {
  const { inNativeApp } = useInNativeApp()
  useEffect(() => {
    if (inNativeApp) {
      return
    }
    if (isMember) {
      window.location = '/'
      return
    }
    if (me) {
      window.location = '/konto'
    }
  }, [inNativeApp, me, isMember])

  const meta = {
    title: t('pages/signin/title')
  }

  return (
    <Frame meta={meta}>
      <PageCenter>
        {inNativeApp ? (
          <UnauthorizedMessage />
        ) : me ? (
          <Loader loading />
        ) : (
          <SignIn email={router.query.email} noReload />
        )}
      </PageCenter>
    </Frame>
  )
}

export default withDefaultSSR(
  compose(withMe, withMembership, withT, withRouter)(SigninPage)
)
