import React, { useMemo } from 'react'
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
      {options.map(option => (
        <GiftMembership key={option.id} option={option} t={t} />
      ))}
    </div>
  )
}

export default GiftMembershipOptions
