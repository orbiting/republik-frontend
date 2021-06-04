import React, { useState } from 'react'
import { css } from 'glamor'

import TrialForm from '../Trial/Form'
import { TRIAL_CAMPAIGNS, TRIAL_CAMPAIGN } from '../../lib/constants'
import { parseJSONObject } from '../../lib/safeJSON'
import { fontStyles, useColorContext, Center } from '@project-r/styleguide'

const trailCampaignes = parseJSONObject(TRIAL_CAMPAIGNS)
const trialAccessCampaignId =
  (trailCampaignes.wahltindaer &&
    trailCampaignes.wahltindaer.accessCampaignId) ||
  TRIAL_CAMPAIGN

const styles = {
  container: css({
    padding: 12
  }),
  title: css({
    margin: 0,
    ...fontStyles.serifTitle38
  }),
  lead: css({
    ...fontStyles.serifRegular16
  })
}

const InlineWrapper = ({ inline, children }) => {
  if (inline) {
    return <Center>{children}</Center>
  } else {
    return children
  }
}

const SeriesPayNote = ({ inline }) => {
  const [colorScheme] = useColorContext()
  const [signInStarted, setSignInStarted] = useState(false)
  const [signInCompleted, setSignInCompleted] = useState(false)
  const title = signInCompleted
    ? 'Completed'
    : signInStarted
    ? 'Started'
    : 'Anmelden und weiterlesen'
  const lead = signInCompleted
    ? 'Completed Lead'
    : signInStarted
    ? 'Started'
    : 'Anmelden und weiterlesen'
  return (
    <div
      {...colorScheme.set('backgroundColor', 'default')}
      {...styles.container}
    >
      <InlineWrapper inline={inline}>
        <h3 {...styles.title} {...colorScheme.set('color', 'text')}>
          {title}
        </h3>
        <p {...styles.lead} {...colorScheme.set('color', 'text')}>
          {lead}
        </p>
        <TrialForm
          minimal
          accessCampaignId={trialAccessCampaignId}
          onSuccess={() => setSignInCompleted(true)}
          beforeSignIn={() => setSignInStarted(true)}
          onReset={() => setSignInStarted(false)}
        />
      </InlineWrapper>
    </div>
  )
}

export default SeriesPayNote
