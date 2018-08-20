import React, { Component, Fragment } from 'react'

import { Interaction } from '@project-r/styleguide'

import List from '../../../List'

import Grant from './Grant'

const { H3 } = Interaction

class Grants extends Component {
  render () {
    const { campaign, revokeAccess } = this.props

    if (campaign.grants.length === 0) {
      return null
    }

    return (
      <Fragment>
        {campaign.slots.used > 1
          ? <H3 style={{marginTop: 30}}>Vergebene Zugriffe</H3>
          : <H3 style={{marginTop: 30}}>Vergebener Zugriff</H3>
        }
        <List>
          {campaign.grants.map((grant, key) => (
            <Grant grant={grant} revokeAccess={revokeAccess} key={key} />
          ))}
        </List>
      </Fragment>
    )
  }
}

export default Grants
