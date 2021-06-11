import React, { useState } from 'react'
import { css } from 'glamor'

import TrialForm from '../Trial/Form'
import { TRIAL_CAMPAIGN } from '../../lib/constants'
import withT from '../../lib/withT'
import {
  useColorContext,
  Center,
  RawHtml,
  Interaction
} from '@project-r/styleguide'

import BrowserOnly from './BrowserOnly'

const accessCampaignId = TRIAL_CAMPAIGN

const styles = {
  container: css({
    padding: 12
  })
}

const InlineWrapper = ({ inline, children }) => {
  if (inline) {
    return <Center>{children}</Center>
  } else {
    return children
  }
}

const TrialPayNoteMini = ({ inline, t }) => {
  const [colorScheme] = useColorContext()
  const [signInStarted, setSignInStarted] = useState(false)
  const [signInCompleted, setSignInCompleted] = useState(false)
  const title = signInCompleted
    ? t('Trial/Form/completed/title')
    : signInStarted
    ? t('Trial/Form/started/title')
    : t('Trial/Form/initial/title')

  return (
    <div
      {...colorScheme.set('backgroundColor', 'default')}
      {...styles.container}
    >
      <InlineWrapper inline={inline}>
        <Interaction.H2 style={{ marginBottom: 10 }}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: title
            }}
          />
        </Interaction.H2>
        <BrowserOnly
          Component={TrialForm}
          componentProps={{
            minimal: true,
            accessCampaignId,
            beforeSignInForm: (
              <Interaction.P>
                {t('Trial/Form/initial/beforeSignIn')}
              </Interaction.P>
            ),
            onSuccess: () => setSignInCompleted(true),
            onBeforeSignIn: () => setSignInStarted(true),
            onReset: () => setSignInStarted(false)
          }}
          height={115}
        />
      </InlineWrapper>
    </div>
  )
}

export default withT(TrialPayNoteMini)
