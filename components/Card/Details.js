import React from 'react'

import {
  Interaction
} from '@project-r/styleguide'

import withT from '../../lib/withT'

const Details = ({ card, t }) => {
  const { payload } = card

  const { electionPlausibility } = payload.nationalCouncil
  const plausibilityText = t(`components/Card/electionPlausibility/${electionPlausibility}`, undefined, '')
  const plausibilityEmoji = t(`components/Card/electionPlausibility/${electionPlausibility}/emoji`, undefined, '')

  return (
    <Interaction.P>
      {!!plausibilityText && t('components/Card/electionPlausibility/title', {
        text: plausibilityText,
        emoji: plausibilityEmoji
      })}
    </Interaction.P>
  )
}

export default withT(Details)
