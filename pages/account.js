import React from 'react'
import { compose } from 'redux'
import Frame from '../components/Frame'
import Account from '../components/Account'
import Marketing from '../components/Marketing'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

const AccountPage = ({ url, me, t }) => {
  const meta = {
    title: t('pages/account/title')
  }
  return (
    <Frame url={url} meta={meta}>
      {me && me.id ? <Account /> : <Marketing />}
    </Frame>
  )
}

export default compose(withData, withMe, withT)(AccountPage)
