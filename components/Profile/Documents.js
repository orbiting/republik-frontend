import React from 'react'
import { A, Interaction, Spinner, TeaserFeed } from '@project-r/styleguide'
import withT from '../../lib/withT'
import { useInfiniteScroll } from '../../lib/hooks/useInfiniteScroll'
import { css } from 'glamor'
import HrefLink from '../Link/Href'
import FeedActionBar from '../ActionBar/Feed'
import ErrorMessage from '../ErrorMessage'

const styles = {
  more: css({
    position: 'relative',
    height: 50,
    padding: '20px 0 0 0'
  })
}

const Documents = ({ t, documents, loadMore }) => {
  const hasMore = documents && documents.pageInfo.hasNextPage
  const [
    { containerRef, infiniteScroll, loadingMore, loadingMoreError },
    setInfiniteScroll
  ] = useInfiniteScroll({
    hasMore,
    loadMore
  })

  if (!documents || !documents.totalCount) {
    return null
  }

  const totalCount = documents.totalCount
  const currentCount = documents.nodes.length

  return (
    <>
      <div ref={containerRef}>
        <Interaction.H3 style={{ marginBottom: 20 }}>
          {t.pluralize('profile/documents/title', {
            count: documents.totalCount
          })}
        </Interaction.H3>
        {documents.nodes.map(doc => (
          <TeaserFeed
            {...doc.meta}
            title={doc.meta.shortTitle || doc.meta.title}
            description={!doc.meta.shortTitle && doc.meta.description}
            Link={HrefLink}
            key={doc.meta.path}
            bar={
              <FeedActionBar
                documentId={doc.id}
                userBookmark={doc.userBookmark}
                userProgress={doc.userProgress}
                {...doc.meta}
                meta={doc.meta}
              />
            }
          />
        ))}
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

export default withT(Documents)
