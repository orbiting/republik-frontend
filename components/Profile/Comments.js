import React from 'react'
import { CommentTeaser, Interaction } from '@project-r/styleguide'
import withT from '../../lib/withT'
import CommentLink from '../Discussion/CommentLink'
import InfiniteScroll from '../Frame/InfiniteScroll'

const Comments = ({ t, comments, loadMore }) => {
  if (!comments || !comments.totalCount) {
    return null
  }

  const hasMore = comments.pageInfo.hasNextPage
  const totalCount = comments.totalCount
  const currentCount = comments.nodes.length

  return (
    <InfiniteScroll
      hasMore={hasMore}
      loadMore={loadMore}
      totalCount={totalCount}
      currentCount={currentCount}
      loadMoreKey={'feed/loadMore/comments'}
    >
      <Interaction.H3 style={{ marginBottom: 20 }}>
        {t.pluralize('profile/comments/title', {
          count: comments.totalCount
        })}
      </Interaction.H3>
      {comments.nodes
        .filter(comment => comment.content)
        .map(comment => {
          const discussion = comment.discussion || {}
          const context = {
            title: discussion.title
          }
          return (
            <CommentTeaser
              key={comment.id}
              id={comment.id}
              context={context}
              preview={comment.preview}
              createdAt={comment.createdAt}
              tags={comment.tags}
              parentIds={comment.parentIds}
              discussion={discussion}
              Link={CommentLink}
              t={t}
            />
          )
        })}
    </InfiniteScroll>
  )
}

export default withT(Comments)
