import React, { Component } from 'react'

import { Item } from '../../../List'

import { timeFormat } from '../../../../lib/utils/format'

import Revoke from './Revoke'

const dayFormat = timeFormat('%e. %B %Y')

class Grants extends Component {
  render () {
    const { grant, revokeAccess } = this.props

    return (
      <Item key={grant.id}>
        an <strong>{grant.email}</strong><br />
        gültig bis zum <strong>{dayFormat(new Date(grant.endAt))}</strong><br />
        <Revoke grant={grant} revokeAccess={revokeAccess} />
      </Item>
    )
  }
}

export default Grants
