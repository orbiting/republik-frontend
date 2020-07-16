import React from 'react'
import { CommentTeaser, colors } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import CommentLink from '../Discussion/CommentLink'
import { css } from 'glamor'
import SubscribeCallout from './SubscribeCallout'

const isNewRule = css({
  backgroundColor: colors.primaryBg
})

export default compose(withT)(({ t, node, isNew }) => {
  return (
    <div {...(isNew ? isNewRule : {})}>
      <CommentTeaser
        {...node.object}
        context={{
          title: node.object.discussion.title
        }}
        preview={node.object.preview}
        Link={CommentLink}
        t={t}
        highlighted={isNew}
        menu={
          <SubscribeCallout
            authorSubscriptions={[node.subscription].filter(Boolean)}
            discussionId={node.object.discussion.id}
          />
        }
      />
    </div>
  )
})
