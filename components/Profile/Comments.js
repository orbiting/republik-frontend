import React from 'react'
import { CommentTeaser, Interaction } from '@project-r/styleguide'
import timeago from '../../lib/timeago'
import withT from '../../lib/withT'

const timeagoFromNow = (t, createdAtString) => {
  return timeago(t, (Date.now() - Date.parse(createdAtString)) / 1000)
}

const Comments = ({ t, comments }) => {
  if (!comments || !comments.totalCount) {
    return null
  }
  return (
    <div>
      <Interaction.H3 style={{marginBottom: 20}}>
        {t.pluralize('profile/comments/title', {
          count: comments.totalCount
        })}
      </Interaction.H3>
      {comments.nodes.map((comment) => {
        const discussion = comment.discussion || {}
        return (
          <CommentTeaser
            key={comment.id}
            title={discussion.title}
            content={comment.content}
            timeago={timeagoFromNow(t, comment.createdAt)}
            commentUrl={discussion.documentPath && `${discussion.documentPath}?focus=${comment.id}`}
            lineClamp={3}
            t={t}
          />
        )
      })}
    </div>
  )
}

export default withT(Comments)
