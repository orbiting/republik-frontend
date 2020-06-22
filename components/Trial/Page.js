import React, { Fragment } from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { css } from 'glamor'

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

import {
  Button,
  Label,
  Interaction,
  RawHtml,
  mediaQueries
} from '@project-r/styleguide'

const { H1, P } = Interaction

const trailCampaignes = parseJSONObject(TRIAL_CAMPAIGNS)
const dayFormat = timeFormat('%e. %B %Y')

const styles = {
  image: css({
    float: 'right',
    maxWidth: 150,
    maxHeight: 170,
    paddingLeft: 10,
    [mediaQueries.mUp]: {
      paddingLeft: 30
    }
  })
}

const getTranslationKeys = (name, { isSignedIn, hasAccess, campaign }) => {
  if (hasAccess) {
    return [`Trial/Page/withAccess/${name}`]
  }

  return [
    campaign && isSignedIn && `Trial/Page/${campaign}/${name}/signedIn`,
    campaign && `Trial/Page/${campaign}/${name}`,
    isSignedIn && `Trial/Page/${name}/signedIn`,
    `Trial/Page/${name}`
  ].filter(Boolean)
}

const ALLOWED_CAMPAIGNS = [
  'covid-19-uhr-newsletter',
  'briefings',
  'am-gericht',
  'sommer'
]

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
  const isSignedIn = !!me
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
          .filter(Boolean)
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

  const content = t.first(
    getTranslationKeys('intro', { isSignedIn, hasAccess, campaign }),
    {
      email: me && me.email,
      until: until && dayFormat(new Date(until))
    }
  )
  const image = t.first(
    getTranslationKeys('image', { isSignedIn, hasAccess, campaign }),
    {},
    ''
  )
  return (
    <Fragment>
      <H1 style={{ marginBottom: 10 }}>
        {t.first(
          getTranslationKeys('heading', { isSignedIn, hasAccess, campaign })
        )}
      </H1>
      {!!image && <img {...styles.image} src={image} />}
      {content
        .split('\n\n')
        .filter(Boolean)
        .map((c, i) => (
          <P key={i} style={{ marginBottom: 20 }}>
            <RawHtml
              dangerouslySetInnerHTML={{
                __html: c
              }}
            />
          </P>
        ))}
      <Form
        initialEmail={initialEmail}
        accessCampaignId={accessCampaignId}
        campaign={campaign}
      />
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
