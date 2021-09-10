import React from 'react'
import { flowRight as compose } from 'lodash'
import { withRouter } from 'next/router'
import Frame from '../components/Frame'
import Account from '../components/Account'
import withT from '../lib/withT'
import Merci from '../components/Pledge/Merci'

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

export default compose(withT, withRouter)(AccountPage)
