import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'

import withSurviveStatus from './withSurviveStatus'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import { RawStatus } from './Status'

import { Interaction, A } from '@project-r/styleguide'

const SurviveStatus = ({ t, crowdfunding }) => {
  return (
    <>
      <Interaction.H3>{t('crowdfunding/SurviveStatus/title')}</Interaction.H3>
      <RawStatus
        t={t}
        compact
        crowdfundingName={crowdfunding.name}
        crowdfunding={
          crowdfunding && {
            ...crowdfunding,
            status: crowdfunding.status && {
              memberships: crowdfunding.status.memberships,
              people: crowdfunding.status.people,
              money: crowdfunding.status.money
            }
          }
        }
        memberships
      />
      <div>
        <Link route='crowdfunding2' passHref>
          <A>{t('crowdfunding/SurviveStatus/link/crowdfunding2')}</A>
        </Link>
        {' – '}
        <A href='https://www.republik.ch/2020/03/01/textbausteine'>
          {t('crowdfunding/SurviveStatus/link/shareTemplates')}
        </A>
      </div>
    </>
  )
}

export default compose(
  withT,
  withSurviveStatus
)(SurviveStatus)
