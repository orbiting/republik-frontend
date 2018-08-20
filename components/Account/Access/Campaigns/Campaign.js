import React, { Component } from 'react'

import { Interaction } from '@project-r/styleguide'

import Form from './Form'
import Grants from './Grants'

const { H2, P } = Interaction

class Campaign extends Component {
  render () {
    const { campaign, grantAccess, revokeAccess } = this.props

    return (
      <div style={{marginBottom: 40}}>
        <H2>{campaign.title}</H2>
        <P>{campaign.description}</P>
        <Grants campaign={campaign} revokeAccess={revokeAccess} />
        <Form campaign={campaign} grantAccess={grantAccess} />
      </div>
    )
  }
}

export default Campaign
