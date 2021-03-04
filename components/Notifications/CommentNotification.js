import React from 'react'
import { CommentTeaser, useColorContext } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import CommentLink from '../Discussion/CommentLink'
import SubscribeCallout from './SubscribeCallout'

export default compose(withT)(({ t, node, isNew }) => {
  const [colorScheme] = useColorContext()
  return (
    <div {...(isNew ? colorScheme.set('backgroundColor', 'alert') : null)}>
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
