import React from 'react'
import { CommentTeaser } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import CommentLink from '../Discussion/CommentLink'
import { merge } from 'glamor'
import { fadeInStyle } from './index'

export default compose(withT)(({ t, node, fadeIn }) => {
  return (
    <div {...merge({}, fadeIn && fadeInStyle)}>
      <CommentTeaser
        {...node.object}
        context={{
          title: node.object.discussion.title
        }}
        preview={{ string: node.object.preview.string, more: true }}
        Link={CommentLink}
        t={t}
      />
    </div>
  )
})
