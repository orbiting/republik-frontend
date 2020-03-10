import React from 'react'

import {
  Checkbox,
  TeaserFeed,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import NotificationChannelsLink from './NotificationChannelsLink'
import { css } from 'glamor'
import SubscribeCalloutTitle from './SubscribeCalloutTitle'

const styles = {
  checkbox: css({
    '& label': {
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center',
      margin: '5px 0',
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifRegular12
      }
    },
    '& svg': {
      width: 12,
      height: 12
    }
  }),
  checkboxLabel: css({
    marginTop: -6
  })
}

const UnsubscribeCallout = ({ me }) => (
  <>
    <div {...styles.checkbox}>
      <SubscribeCalloutTitle isSubscribed={true} />
      <Checkbox checked={true} onChange={() => undefined}>
        <span {...styles.checkboxLabel}>Debate</span>
      </Checkbox>
      <Checkbox checked={true} onChange={() => undefined}>
        <span {...styles.checkboxLabel}>Profile</span>
      </Checkbox>
    </div>
    <div style={{ marginTop: -10 }}>
      <NotificationChannelsLink me={me} />
    </div>
  </>
)

export default compose(withT)(({ t, node, isNew, me }) => {
  const { object } = node
  return (
    <TeaserFeed
      kind='editorial'
      format={{ meta: { title: object.meta.title } }}
      title='The quick brown fox jumps over the lazy dog'
      description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
      t={t}
      credits={[
        { type: 'text', value: 'An article by ' },
        {
          type: 'link',
          url: 'https://republik.ch/~moser',
          children: [{ type: 'text', value: 'Christof Moser' }]
        }
      ]}
      key={object.meta.path}
      menu={<UnsubscribeCallout me={me} />}
    />
  )
})
