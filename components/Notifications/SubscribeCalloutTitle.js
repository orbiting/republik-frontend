import React from 'react'
import withT from '../../lib/withT'
import { colors, fontStyles, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import SubIcon from 'react-icons/lib/md/notifications'
import UnsubIcon from 'react-icons/lib/md/notifications-none'
import { css } from 'glamor'

const styles = {
  title: css({
    marginBottom: 10,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular12
    },
    '& svg': {
      width: 16,
      height: 16
    }
  })
}

const SubscribeCalloutTitle = compose(withT)(({ t, isSubscribed }) => {
  const Icon = isSubscribed ? SubIcon : UnsubIcon
  return (
    <label
      {...styles.title}
      style={{
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
