import React from 'react'
import { css } from 'glamor'
import { Interaction } from '@project-r/styleguide'
import { MembershipType } from './Membership.types'
import MembershipStatus from './MembershipStatus'
import MembershipOption from './MembershipOption'

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    '> div:not(:last-child)': {
      marginBottom: 24
    }
  })
}

const index = ({ status, options }: MembershipType) => {
  return (
    <div {...styles.container}>
      {/* TODO: Remove br */}
      <Interaction.H2>Abonnement</Interaction.H2>
      <br />
      <MembershipStatus {...status} />
      {options.map(option => (
        <MembershipOption key={option.label} {...option} />
      ))}
    </div>
  )
}

export default index
