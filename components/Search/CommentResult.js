import React from 'react'
import CommentLink from '../Discussion/CommentLink'
import { CommentTeaser } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'

export default compose(withT)(({ t, node }) => {
  return (
    <CommentTeaser
      {...node.entity}
      context={{
        title: node.entity.discussion.title
      }}
      highlights={
        node.highlights &&
        // ToDo: support all path in styleguide
        node.highlights.filter(h => h.path === 'contentString')
      }
      Link={CommentLink}
      t={t}
    />
  )
})
