import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Account from '../components/Account'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'
import Merci from '../components/Pledge/Merci'

const AccountPage = ({ url, t }) => {
  const meta = {
    title: t('pages/account/title')
  }
  const postPledge = url.query.id || url.query.claim
  return (
    <Frame url={url} meta={meta}>
      {postPledge
        ? <Merci query={url.query} />
        : <Account query={url.query} />}
    </Frame>
  )
}

export default compose(
  withData,
  withT
)(AccountPage)
