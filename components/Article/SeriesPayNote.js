import React, { useState } from 'react'
import { css } from 'glamor'

import TrialForm from '../Trial/Form'
import { TRIAL_CAMPAIGNS, TRIAL_CAMPAIGN } from '../../lib/constants'
import withT from '../../lib/withT'
import { parseJSONObject } from '../../lib/safeJSON'
import {
  fontStyles,
  useColorContext,
  Center,
  mediaQueries,
  RawHtml
} from '@project-r/styleguide'

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
    ...fontStyles.serifTitle32
  }),
  lead: css({
    marginBottom: 0,
    ...fontStyles.serifRegular18,
    [mediaQueries.mUp]: {
      ...fontStyles.serifRegular21
    }
  })
}

const InlineWrapper = ({ inline, children }) => {
  if (inline) {
    return <Center>{children}</Center>
  } else {
    return children
  }
}

const SeriesPayNote = ({ inline, t }) => {
  const [colorScheme] = useColorContext()
  const [signInStarted, setSignInStarted] = useState(false)
  const [signInCompleted, setSignInCompleted] = useState(false)
  const title = signInCompleted
    ? t('Trial/Form/completed/title')
    : signInStarted
    ? t('Trial/Form/started/title')
    : t('Trial/Form/initial/title')
  const lead =
    !signInCompleted && !signInStarted
      ? t('Trial/Form/initial/lead')
      : undefined

  return (
    <div
      {...colorScheme.set('backgroundColor', 'default')}
      {...styles.container}
    >
      <InlineWrapper inline={inline}>
        <h3 {...styles.title} {...colorScheme.set('color', 'text')}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: title
            }}
          />
        </h3>
        {lead && (
          <p {...styles.lead} {...colorScheme.set('color', 'text')}>
            {lead}
          </p>
        )}
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

export default withT(SeriesPayNote)
