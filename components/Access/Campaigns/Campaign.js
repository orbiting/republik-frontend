import React from 'react'
import { A, Interaction } from '@project-r/styleguide'
import { compose } from 'react-apollo'

import withT from '../../../lib/withT'
import { Link } from '../../../lib/routes'

import Form from './Form'
import Grants from './Grants'

const { H2, P } = Interaction

const Campaign = ({ campaign, grantAccess, revokeAccess, t }) => {
  return (
    <div style={{ marginBottom: 80 }}>
      <H2>{campaign.title}</H2>
      <P>{campaign.description}</P>
      <Grants campaign={campaign} revokeAccess={revokeAccess} />
      <Form campaign={campaign} grantAccess={grantAccess} />
    </div>
  )
}

export default compose(withT)(Campaign)
