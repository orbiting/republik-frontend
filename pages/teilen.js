import React from 'react'
import { flowRight as compose } from 'lodash'
import AccessCampaigns from '../components/Access/Campaigns'
import Frame from '../components/Frame'
import { enforceMembership } from '../components/Auth/withMembership'
import { t } from '../lib/withT'

const meta = {
  title: t('pages/access/title')
}

const Page = () => (
  <Frame meta={meta}>
    <AccessCampaigns />
  </Frame>
)

export default compose(enforceMembership())(Page)
