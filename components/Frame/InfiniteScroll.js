import React from 'react'
import { A, Spinner } from '@project-r/styleguide'
import withT from '../../lib/withT'
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

const InfiniteScroll = ({
  t,
  hasMore,
  loadMore,
  totalCount,
  currentCount,
  children
}) => {
  const [
    { containerRef, infiniteScroll, loadingMore, loadingMoreError },
    setInfiniteScroll
  ] = useInfiniteScroll({
    hasMore,
    loadMore
  })

  return (
    <>
      <div ref={containerRef}>{children}</div>
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

export default withT(InfiniteScroll)
