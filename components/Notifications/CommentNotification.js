import React from 'react'
import { CommentTeaser } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import CommentLink from '../Discussion/CommentLink'
import { merge } from 'glamor'
import { isNewStyle } from './index'
import SubscribeDebateCallout from './SubscribeDebateCallout'

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
        menu={
          <SubscribeDebateCallout
            discussionId={node.object.discussion.id}
            showTitle
          />
        }
      />
    </div>
  )
})
