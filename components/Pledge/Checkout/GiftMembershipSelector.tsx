import React from 'react'
import { css } from 'glamor'

import { Checkbox, Interaction, mediaQueries } from '@project-r/styleguide'

const memberships = [
  {
    label: 'Peter Meier (#23323)',
    description:
      'Der Mitgliederbeitrag ist in 233 Tagen (12. März 2021) fällig.',
    price: 'CHF 240'
  }
]

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    }
  })
}

const GiftMembershipSelector = ({ xmemberships, onSelect }) => {
  return (
    <>
      <h3>Geschenkmitgliedschaften verlängern</h3>
      {memberships.map(membership => (
        <div {...styles.container} key={membership.label}>
          <div>
            <Interaction.P>{membership.label}</Interaction.P>
            <Interaction.P>{membership.description}</Interaction.P>
          </div>
          <Checkbox>{membership.price}</Checkbox>
        </div>
      ))}
    </>
  )
}

export default GiftMembershipSelector
