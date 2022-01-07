import React, { useMemo } from 'react'
import { PackageType } from './MembershipOptions'
import GiftMembership from './GiftMembership'

const GiftMembershipOptions = ({
  pkg,
  t
}: {
  pkg: PackageType
  t: (string: string) => string
}) => {
  const options = useMemo(() => {
    // filter out Goodies and GiftMemberships
    return pkg.options.filter(
      option => !option.membership.user.isUserOfCurrentSession
    )
  }, [pkg])
  return (
    <div>
      {options.map(option => (
        <GiftMembership key={option.id} option={option} t={t} />
      ))}
    </div>
  )
}

export default GiftMembershipOptions
