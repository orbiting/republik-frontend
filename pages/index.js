import React from 'react'
import { compose } from 'redux'
import Frame from '../components/Frame'
import Front from '../components/Front'
import Nav from '../components/Nav'
import Marketing from '../components/Marketing'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

const IndexPage = ({ url, me, t }) => {
  const meta = {
    title: t('pages/magazine/title')
  }
  return (
    <Frame url={url} meta={meta} nav={<Nav route='/' url={url} />}>
      {me ? <Front /> : <Marketing />}
    </Frame>
  )
}

export default compose(withData, withMe, withT)(IndexPage)
