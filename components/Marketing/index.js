import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import UserGuidance from '../Account/UserGuidance'
import ErrorMessage from '../ErrorMessage'

import Lead from './Lead'
import Carpet from './Carpet'
import Team from './Team'
import Reasons from './Reasons'
import Sections from './Sections'
import Vision from './Vision'
import Logo from './Logo'
import MiniFront from './MiniFront'
import Community from './Community'
import Pledge from './Pledge'

const Marketing = ({
  t,
  data: { loading, error, meGuidance },
  inNativeApp,
  inNativeIOSApp
}) => {
  const hasActiveMembership = meGuidance && !!meGuidance.activeMembership

  return (
    <>
      {!loading && meGuidance && !hasActiveMembership && !inNativeIOSApp && (
        <UserGuidance />
      )}
      {error && <ErrorMessage error={error} style={{ textAlign: 'center' }} />}
      <Lead t={t} />
      <MiniFront t={t} />
      <Carpet t={t} />
      <Reasons t={t} />
      <Sections t={t} />
      <Team t={t} />
      <Community t={t} />
      <Vision t={t} />
      <Pledge />
      <Logo />
    </>
  )
}

const query = gql`
  query MarketingPage {
    meGuidance: me {
      id
      activeMembership {
        id
      }
      accessGrants {
        id
      }
    }
  }
`

export default compose(withT, withInNativeApp, graphql(query))(Marketing)
