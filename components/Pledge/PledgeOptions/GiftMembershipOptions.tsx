import React, { useMemo } from 'react'
import { Interaction } from '@project-r/styleguide'
import { OptionType } from './PledgeOptionsTypes'
import GiftMembership from './GiftMembership'

const GiftMembershipOptions = ({
  options,
  t
}: {
  options: OptionType[]
  t?: (string: string) => string
}) => {
  if (!options?.length) {
    return null
  }
  return (
    <div>
      <Interaction.H3>Geschenkmitgliedschaften</Interaction.H3>
      {options.map(option => (
        <GiftMembership key={option.id} option={option} t={t} />
      ))}
    </div>
  )
}

export default GiftMembershipOptions
