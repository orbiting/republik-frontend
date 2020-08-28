import React from 'react'
import { merge } from 'glamor'
import { colors, IconButton } from '@project-r/styleguide'
import withT from '../../lib/withT'

// currently unused, example:
const BADGES = {
  // CROWDFUNDER: {
  //   translation: 'badge/crowdfunder',
  //   icon: 'crowdfunder'
  // }
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
  if (!badgeData) {
    return null
  }
  return (
    <span
      {...merge(styles.badge, {
        height: `${size}px`,
        width: `${size}px`,
        borderRadius: `${size}px`
      })}
      title={t(badgeData.translation)}
    >
      <IconButton Icon={badgeData.icon} />
    </span>
  )
}

export default withT(Badge)
