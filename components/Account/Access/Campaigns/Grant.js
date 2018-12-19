import { compose } from 'react-apollo'

import { Interaction } from '@project-r/styleguide'

import { Item } from '../../../List'
import { timeFormat } from '../../../../lib/utils/format'
import Revoke from './Revoke'
import withT from '../../../../lib/withT'

const { Emphasis } = Interaction

const dayFormat = timeFormat('%e. %B %Y')

const Grants = ({ grant, revokeAccess, t }) => {
  const elements = {
    recipient: <Emphasis key={`grant-recipient-${grant.id}`}>
      {grant.email}
    </Emphasis>,
    beginBefore: <Emphasis key={`grant-before-${grant.id}`}>
      {dayFormat(new Date(grant.beginBefore))}
    </Emphasis>
  }

  return (
    <Item key={`grant-item-${grant.id}`}>
      { t.elements('Account/Access/Campaigns/Grants/recipient', elements)}
      <br />
      { t.elements('Account/Access/Campaigns/Grants/beginBefore', elements)}
      <br />
      <Revoke grant={grant} revokeAccess={revokeAccess} />
    </Item>
  )
}

export default compose(withT)(Grants)
