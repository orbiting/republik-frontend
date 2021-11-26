import React from 'react'
import { css } from 'glamor'

import {
  Checkbox,
  Label,
  mediaQueries,
  fontStyles
} from '@project-r/styleguide'

const memberships = [
  {
    label: 'Peter Meier (#23323)',
    description:
      'Der Mitgliederbeitrag ist in 233 Tagen (12. März 2021) fällig.',
    price: 'CHF 240'
  },
  {
    label: 'Petera Meier (#23323)',
    description:
      'Der Mitgliederbeitrag ist in 233 Tagen (12. März 2021) fällig.',
    price: 'CHF 240'
  }
]

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    ':not(:first-of-type)': {
      marginTop: 16
    },
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }),
  description: css({
    padding: '0px 0px 8px 0px',
    [mediaQueries.mUp]: {
      padding: '0px 8px 0px 0px'
    }
  }),
  title: css({
    ...fontStyles.sansSerifMedium18,
    margin: '0 0 4px'
  })
}

const GiftMembershipSelector = ({ xmemberships, onSelect }) => {
  return (
    <>
      <h3>Geschenkmitgliedschaften verlängern</h3>
      {memberships.map(membership => (
        <div {...styles.container} key={membership.label}>
          <div {...styles.description}>
            <p {...styles.title}>{membership.label}</p>
            <Label>{membership.description}</Label>
          </div>
          <Checkbox>{membership.price}</Checkbox>
        </div>
      ))}
    </>
  )
}

export default GiftMembershipSelector
