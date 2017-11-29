import React from 'react'
import { compose } from 'redux'
import Frame from '../components/Frame'
import Account from '../components/Account'
import withAuthorization from '../components/Auth/withAuthorization'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

const AccountPage = ({ url, me, t }) => {
  const meta = {
    title: t('pages/account/title')
  }
  return (
    <Frame url={url} meta={meta}>
      <Account />
    </Frame>
  )
}

export default compose(
  withData,
  withAuthorization(),
  withMe,
  withT
)(AccountPage)
