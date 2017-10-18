import React from 'react'
import {compose} from 'redux'
import Frame from '../components/Frame'
import Nav from '../components/Nav'
import Me from '../components/Me'
import Marketing from '../components/Marketing'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'

const AccountPage = ({ url, me }) => (
  <Frame url={url} nav={<Nav route='' url={url} />}>
    {me ? <Me /> : <Marketing />}
  </Frame>
)

export default compose(
  withData,
  withMe
)(AccountPage)
