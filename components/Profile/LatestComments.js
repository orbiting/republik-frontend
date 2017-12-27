import React from 'react'
import { CommentTeaser, Interaction } from '@project-r/styleguide'
import timeago from '../../lib/timeago'
import withT from '../../lib/withT'

const timeagoFromNow = (t, createdAtString) => {
  return timeago(t, (Date.now() - Date.parse(createdAtString)) / 1000)
}

const LatestComments = ({ t, comments }) => {
  const filteredComments = comments && comments.filter(
    comment => comment.discussion && comment.discussion.title
  )
  if (!filteredComments || !filteredComments.length) {
    return null
  }
  return (
    <div>
      <Interaction.H3 style={{marginBottom: 20}}>
        {t.pluralize('profile/comments/title', {
          count: filteredComments.length
        })}
      </Interaction.H3>
      {filteredComments.map((comment) => {
        // Make sure not to wrap each comment teaser in a container
        // so we get the dividers for adjacent elements.
        return (
          <CommentTeaser
            key={comment.id}
            title={comment.discussion.title}
            content={comment.content}
            timeago={timeagoFromNow(t, comment.createdAt)}
            commentUrl={`/comment/${comment.id}`}
            lineClamp={3}
            t={t}
          />
        )
      })}
    </div>
  )
}

export default withT(LatestComments)
