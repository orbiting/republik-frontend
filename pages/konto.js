import React from 'react'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'
import Frame from '../components/Frame'
import Account from '../components/Account'
import withT from '../lib/withT'
import Merci from '../components/Pledge/Merci'
import withDefaultSSR from '../lib/hocs/withDefaultSSR'

const AccountPage = ({ router, t }) => {
  const meta = {
    title: t('pages/account/title')
  }
  const postPledge = router.query.id || router.query.claim
  return (
    <Frame meta={meta} raw>
      {postPledge ? (
        <Merci query={router.query} />
      ) : (
        <Account query={router.query} />
      )}
    </Frame>
  )
}

export default withDefaultSSR(compose(withT, withRouter)(AccountPage))
