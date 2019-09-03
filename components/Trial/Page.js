import React, { Fragment } from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import Form from './Form'
import withTrialEligibility from './withTrialEligibility'
import { withSignIn } from '../Auth/SignIn'
import { parseJSONObject } from '../../lib/safeJSON'
import { timeFormat } from '../../lib/utils/format'
import { TRIAL_CAMPAIGN, TRIAL_CAMPAIGNS } from '../../lib/constants'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import { Interaction } from '@project-r/styleguide'

const { H1, P } = Interaction

const trailCampaignes = parseJSONObject(TRIAL_CAMPAIGNS)
const dayFormat = timeFormat('%e. %B %Y')

const getTranslationKey = (name, { isAuthorized, hasAccess, campaign }) => {
  if (!isAuthorized) {
    return [
      `Trial/Page/unauthorized/${campaign}/${name}`,
      `Trial/Page/unauthorized/${name}`
    ]
  }

  if (!hasAccess) {
    return [
      `Trial/Page/authorized/withoutAccess/${campaign}/${name}`,
      `Trial/Page/authorized/withoutAccess/${name}`
    ]
  }

  return [
    `Trial/Page/authorized/withAccess/${campaign}/${name}`,
    `Trial/Page/authorized/withAccess/${name}`
  ]
}

const Page = (props) => {
  const { trialEligibility, me, router, t } = props
  const { viaActiveMembership, viaAccessGrant } = trialEligibility
  const { campaign } = router.query

  const until = viaActiveMembership.until || viaAccessGrant.until
  const isAuthorized = !!me
  const hasAccess = !!until

  const accessCampaignId =
    (trailCampaignes[campaign] && trailCampaignes[campaign].accessCampaignId) ||
    TRIAL_CAMPAIGN

  return (
    <Fragment>
      <H1>{t.first(getTranslationKey('heading', { isAuthorized, hasAccess, campaign }))}</H1>
      <P style={{ marginTop: 40, marginBottom: 40 }}>
        {t.first(getTranslationKey('intro', { isAuthorized, hasAccess, campaign }), {
          email: me && me.email,
          until: until && dayFormat(new Date(until))
        })}
      </P>
      <Form accessCampaignId={accessCampaignId} />
    </Fragment>
  )
}

export default compose(withTrialEligibility, withSignIn, withMe, withRouter, withT)(Page)
