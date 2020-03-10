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
      <label style={{ marginBottom: 10 }}>
        <b>Subscribed via:</b>
      </label>
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

export default compose(withT)(({ t, node }) => {
  const { content, object } = node
  return (
    <TeaserFeed
      {...object.meta}
      title={object.meta.shortTitle || object.meta.title}
      description={!object.meta.shortTitle && object.meta.description}
      t={t}
      credits={object.meta.credits}
      publishDate={object.meta.publishDate}
      kind={
        object.meta.template === 'editorialNewsletter'
          ? 'meta'
          : object.meta.kind
      }
      key={object.meta.path}
    />
  )
})
