import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Formats from '../components/Formats'
import { enforceMembership } from '../components/Auth/withMembership'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

const FormatsPage = ({ url, me, t }) => {
  const meta = {
    title: t('formats/pageTitle')
  }
  return (
    <Frame raw url={url} meta={meta}>
      <Formats />
    </Frame>
  )
}

export default compose(
  withData,
  enforceMembership,
  withMe,
  withT
)(FormatsPage)
