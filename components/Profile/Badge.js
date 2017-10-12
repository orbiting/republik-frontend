import React from 'react'
import { merge } from 'glamor'
import { colors } from '@project-r/styleguide'
import IconLink from '../IconLink'
import withT from '../../lib/withT'

// Using icons for demo reasons. These may eventually be replaced by images.
const BADGES = {
  CROWDFUNDER: {
    translation: 'badge/crowdfunder',
    icon: 'crowdfunder'
  },
  PATRON: {
    translation: 'badge/patron',
    icon: 'patron'
  },
  STAFF: {
    translation: 'badge/staff',
    icon: 'author'
  },
  FREELANCER: {
    translation: 'badge/freelancer',
    icon: 'freelancer'
  }
}

const styles = {
  badge: {
    backgroundColor: colors.divider,
    border: `1px solid ${colors.lightText}`,
    display: 'inline-block',
    textAlign: 'center',
    '& + &': {
      marginLeft: '10px'
    }
  }
}

const Badge = ({ t, badge, size }) => {
  const badgeData = BADGES[badge]
  return (
    <span
      {...merge(styles.badge, {
        height: `${size}px`,
        width: `${size}px`,
        borderRadius: `${size}px`
      })}
      title={t(badgeData.translation)}
    >
      <IconLink icon={badgeData.icon} size={size - 8} padding={0} />
    </span>
  )
}

export default withT(Badge)
