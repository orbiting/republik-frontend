import React from 'react'
import {
  Checkbox,
  CommentTeaser,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import CommentLink from '../Discussion/CommentLink'
import { css, merge } from 'glamor'
import { isNewStyle } from './index'
import NotificationChannelsLink from './NotificationChannelsLink'

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

export default compose(withT)(({ t, node, me, isNew }) => {
  return (
    <div {...merge({}, isNew && isNewStyle)}>
      <CommentTeaser
        {...node.object}
        context={{
          title: node.object.discussion.title
        }}
        preview={{ string: node.object.preview.string, more: true }}
        Link={CommentLink}
        t={t}
        focus={isNew}
        menu={<UnsubscribeCallout me={me} />}
      />
    </div>
  )
})
