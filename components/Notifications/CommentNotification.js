import React from 'react'

import { CommentTeaser } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import CommentLink from '../Discussion/CommentLink'

export default compose(withT)(({ t, node }) => {
  return (
    <CommentTeaser
      {...node.object}
      context={{
        title: node.object.discussion.title
      }}
      preview={{ string: node.object.preview.string, more: true }}
      Link={CommentLink}
      t={t}
      dialogHeader
    />
  )
})
