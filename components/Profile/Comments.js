import React from 'react'
import { A, CommentTeaser, Interaction, Spinner } from '@project-r/styleguide'
import withT from '../../lib/withT'
import CommentLink from '../Discussion/CommentLink'
import { useInfiniteScroll } from '../../lib/hooks/useInfiniteScroll'
import ErrorMessage from '../ErrorMessage'
import { css } from 'glamor'

const styles = {
  more: css({
    position: 'relative',
    height: 50,
    padding: '20px 0 0 0'
  })
}

const Comments = ({ t, comments, loadMore }) => {
  const hasMore = comments && comments.pageInfo.hasNextPage
  const [
    { containerRef, infiniteScroll, loadingMore, loadingMoreError },
    setInfiniteScroll
  ] = useInfiniteScroll({
    hasMore,
    loadMore
  })

  if (!comments || !comments.totalCount) {
    return null
  }

  const totalCount = comments.totalCount
  const currentCount = comments.nodes.length

  return (
    <>
      <div ref={containerRef}>
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
      </div>
      <div {...styles.more}>
        {loadingMoreError && <ErrorMessage error={loadingMoreError} />}
        {loadingMore && <Spinner />}
        {!infiniteScroll && hasMore && (
          <A
            href='#'
            onClick={event => {
              event && event.preventDefault()
              setInfiniteScroll(true)
            }}
          >
            {t('feed/loadMore', {
              count: currentCount,
              remaining: totalCount - currentCount
            })}
          </A>
        )}
      </div>
    </>
  )
}

export default withT(Comments)
