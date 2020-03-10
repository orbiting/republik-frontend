import React from 'react'
import withT from '../../lib/withT'
import { colors } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import SubIcon from 'react-icons/lib/md/notifications'
import UnsubIcon from 'react-icons/lib/md/notifications-off'

const SubscribeCalloutTitle = compose(withT)(({ t, isSubscribed }) => {
  const Icon = isSubscribed ? SubIcon : UnsubIcon
  return (
    <label
      style={{
        marginBottom: 10,
        color: isSubscribed ? colors.text : colors.lightText
      }}
    >
      <b>
        <Icon /> {t('pages/notifications/title')}
      </b>
    </label>
  )
})

export default compose(withT)(SubscribeCalloutTitle)
