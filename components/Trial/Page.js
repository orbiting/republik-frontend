import React, { Fragment } from 'react'
import { compose } from 'react-apollo'

import Form from './Form'
import withTrialEligibility from './withTrialEligibility'
import { withSignIn } from '../Auth/SignIn'
import { TRIAL_CAMPAIGN } from '../../lib/constants'
import { Router } from '../../lib/routes'
import { timeFormat } from '../../lib/utils/format'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import { Button, Interaction } from '@project-r/styleguide'

const { H1, P } = Interaction

const dayFormat = timeFormat('%e. %B %Y')

const Page = (props) => {
  const { isTrialEligible, me, t } = props

  if (!isTrialEligible) {
    const { viaActiveMembership, viaAccessGrant } = props.trialEligibility
    const until = viaActiveMembership.until || viaAccessGrant.until

    return (
      <Fragment>
        <H1>{t('Trial/Page/isNotTrialEligible/heading')}</H1>
        <P style={{ marginTop: 40, marginBottom: 40 }}>
          {t('Trial/Page/isNotTrialEligible/paragraph', {
            email: me.email,
            until: dayFormat(new Date(until))
          })}
        </P>
        <Button
          primary
          onClick={() => Router.pushRoute('index', {})}>
          {t('Trial/Page/isNotTrialEligible/button/label')}
        </Button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <H1>{t('Trial/Page/isTrialEligible/heading')}</H1>
      <P style={{ marginTop: 40 }}>
        {t('Trial/Page/isTrialEligible/paragraph')}
      </P>
      <Form accessCampaignId={TRIAL_CAMPAIGN} />
    </Fragment>
  )
}

export default compose(withTrialEligibility, withSignIn, withMe, withT)(Page)
