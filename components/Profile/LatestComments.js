import React from 'react'
import { css } from 'glamor'
import { CommentTeaser, Interaction } from '@project-r/styleguide'
import timeago from '../../lib/timeago'
import withT from '../../lib/withT'

const styles = {
  container: css({
    marginTop: '20px'
  })
}

export const timeagoFromNow = (t, createdAtString) => {
  return timeago(t, (Date.now() - Date.parse(createdAtString)) / 1000)
}

const LatestComments = ({ t, comments }) => {
  const filteredComments = comments && comments.filter(
    comment => comment.discussion && comment.discussion.title
  )
  if (!filteredComments || !filteredComments.length) {
    return <p>{t('profile/discussion/empty')}</p>
  } else {
    return (
      <div>
        <Interaction.H3>{t('profile/discussion')}</Interaction.H3>
        <div {...styles.container}>
          {filteredComments.map(function (comment) {
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
      </div>
    )
  }
}

export default withT(LatestComments)
