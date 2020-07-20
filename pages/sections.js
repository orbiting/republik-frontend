import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Index from '../components/Sections/Index'
import { enforceMembership } from '../components/Auth/withMembership'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

import { Center } from '@project-r/styleguide'

const FormatsPage = ({ t }) => {
  const meta = {
    title: t('sections/pageTitle'),
    description: t('sections/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Frame hasOverviewNav stickySecondaryNav raw meta={meta}>
      <Center style={{ marginTop: 20, marginBottom: 60 }}>
        <Index />
      </Center>
    </Frame>
  )
}

export default compose(
  // enforceMembership(),
  withT
)(FormatsPage)
