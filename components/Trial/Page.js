import React, { Fragment } from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import Form from './Form'
import withTrialEligibility from './withTrialEligibility'
import { withSignIn } from '../Auth/SignIn'
import { Link } from '../../lib/routes'
import { parseJSONObject } from '../../lib/safeJSON'
import { timeFormat } from '../../lib/utils/format'
import { TRIAL_CAMPAIGN, TRIAL_CAMPAIGNS } from '../../lib/constants'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'

import { Button, Label, Interaction, RawHtml } from '@project-r/styleguide'

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

const ALLOWED_CAMPAIGNS = ['covid-19-uhr-newsletter', 'briefings']

const Page = props => {
  const {
    trialEligibility,
    me,
    router: { query },
    t,
    inNativeIOSApp,
    initialEmail
  } = props
  const { viaActiveMembership, viaAccessGrant } = trialEligibility
  const campaign = query.campaign || query.utm_campaign

  const until = viaActiveMembership.until || viaAccessGrant.until
  const isAuthorized = !!me
  const hasAccess = !!until

  const accessCampaignId =
    (trailCampaignes[campaign] && trailCampaignes[campaign].accessCampaignId) ||
    TRIAL_CAMPAIGN

  // only allow specific trials
  if (!hasAccess && !ALLOWED_CAMPAIGNS.includes(campaign)) {
    return (
      <>
        <H1 style={{ marginBottom: 40 }}>{t('Trial/Page/disabled/title')}</H1>

        {t('Trial/Page/disabled/body')
          .split('\n\n')
          .map((c, i) => (
            <P key={i} style={{ marginTop: 30, marginBottom: 30 }}>
              <RawHtml
                dangerouslySetInnerHTML={{
                  __html: c
                }}
              />
            </P>
          ))}

        {!inNativeIOSApp && (
          <>
            <Link route='pledge'>
              <Button primary>{t('Trial/Page/disabled/button')}</Button>
            </Link>
          </>
        )}
      </>
    )
  }

  return (
    <Fragment>
      <H1>
        {t.first(
          getTranslationKey('heading', { isAuthorized, hasAccess, campaign })
        )}
      </H1>
      <P style={{ marginTop: 40, marginBottom: 40 }}>
        {t.first(
          getTranslationKey('intro', { isAuthorized, hasAccess, campaign }),
          {
            email: me && me.email,
            until: until && dayFormat(new Date(until))
          }
        )}
      </P>
      <Form initialEmail={initialEmail} accessCampaignId={accessCampaignId} />
    </Fragment>
  )
}

export default compose(
  withInNativeApp,
  withTrialEligibility,
  withSignIn,
  withMe,
  withRouter,
  withT
)(Page)
