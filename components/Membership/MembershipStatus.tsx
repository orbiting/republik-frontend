import React from 'react'
import { css } from 'glamor'
import { fontStyles, mediaQueries } from '@project-r/styleguide'
import { StatusType } from './Membership.types'

const styles = {
  label: css({
    ...fontStyles.sansSerifMedium19,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium22
    }
  }),
  description: css({
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: { ...fontStyles.sansSerifRegular18 }
  })
}

const MembershipStatus = ({ label, description }: StatusType) => {
  return (
    <div>
      <div {...styles.label}>{label}</div>
      <div {...styles.description}>{description}</div>
    </div>
  )
}

export default MembershipStatus
