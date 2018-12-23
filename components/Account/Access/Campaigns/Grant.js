import { Fragment } from 'react'
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
    </Emphasis>,
    beginAt: grant.beginAt &&
      <Emphasis key={`grant-begin-${grant.id}`}>
        {dayFormat(new Date(grant.beginAt))}
      </Emphasis>,
    endAt: grant.endAt &&
      <Emphasis key={`grant-end-${grant.id}`}>
        {dayFormat(new Date(grant.endAt))}
      </Emphasis>
  }

  return (
    <Item key={`grant-item-${grant.id}`}>
      { t.elements('Account/Access/Campaigns/Grants/recipient', elements)}
      <br />
      {!grant.beginAt &&
        <Fragment>
          {t('Account/Access/Campaigns/Grants/unclaimed')}
          <br />
          { t.elements('Account/Access/Campaigns/Grants/beginBefore', elements)}
          <br />
          <Revoke grant={grant} revokeAccess={revokeAccess} />
        </Fragment>
      }
      {grant.beginAt &&
        <Fragment>
          { t.elements('Account/Access/Campaigns/Grants/beginAt', elements)}
          <br />
          { t.elements('Account/Access/Campaigns/Grants/endAt', elements)}
        </Fragment>
      }
    </Item>
  )
}

export default compose(withT)(Grants)
