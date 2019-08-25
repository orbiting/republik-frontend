import React, { Fragment } from 'react'
import { compose } from 'react-apollo'

import Form from './Form'
import withTrialEligibility from './withTrialEligibility'
import { withSignIn } from '../Auth/SignIn'
import { TRIAL_CAMPAIGN } from '../../lib/constants'
import { timeFormat } from '../../lib/utils/format'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import { Interaction } from '@project-r/styleguide'

const { H1, P } = Interaction

const dayFormat = timeFormat('%e. %B %Y')

const getTranslationKey = (name, { isAuthorized, hasAccess }) => {
  if (!isAuthorized) {
    return `Trial/Page/unauthorized/${name}`
  }

  if (!hasAccess) {
    return `Trial/Page/authorized/withoutAccess/${name}`
  }

  return `Trial/Page/authorized/withAccess/${name}`
}

const Page = (props) => {
  const { trialEligibility, me, t } = props
  const { viaActiveMembership, viaAccessGrant } = trialEligibility

  const until = viaActiveMembership.until || viaAccessGrant.until
  const isAuthorized = !!me
  const hasAccess = !!until

  return (
    <Fragment>
      <H1>{t(getTranslationKey('heading', { isAuthorized, hasAccess }))}</H1>
      <P style={{ marginTop: 40, marginBottom: 40 }}>
        {t(getTranslationKey('intro', { isAuthorized, hasAccess }), {
          email: me && me.email,
          until: until && dayFormat(new Date(until))
        })}
      </P>
      <Form accessCampaignId={TRIAL_CAMPAIGN} />
    </Fragment>
  )
}

export default compose(withTrialEligibility, withSignIn, withMe, withT)(Page)
