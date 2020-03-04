import React from 'react'
import { Interaction } from '@project-r/styleguide'
import StickySection from '../Feed/StickySection'
import CommentNotification from './CommentNotification'
import InfiniteScroll from '../Frame/InfiniteScroll'
import { timeFormat } from '../../lib/utils/format'
import { nest } from 'd3-collection'
import { css } from 'glamor'

const dateFormat = timeFormat('%A,\n%d.%m.%Y')

const groupByDate = nest().key(n => {
  return dateFormat(new Date(n.createdAt))
})

const styles = {
  more: css({
    position: 'relative',
    height: 50,
    padding: '20px 0 0 0'
  })
}

export default ({
  notifications,
  loadedAt,
  fetchMore,
  shouldReload,
  onReload
}) => {
  const { nodes, totalCount, pageInfo } = notifications
  const hasNextPage = pageInfo && pageInfo.hasNextPage

  const loadMore = () =>
    fetchMore({
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const geNodes = data => data.notifications.nodes
        const prevNodes = geNodes(previousResult)
        const moreNodes = geNodes(fetchMoreResult)
        const mergedNodes = prevNodes
          .concat(moreNodes)
          .filter(
            (node, index, all) => all.findIndex(n => n.id === node.id) === index
          )
        return {
          ...fetchMoreResult,
          notifications: {
            ...fetchMoreResult.notifications,
            nodes: mergedNodes
          }
        }
      },
      variables: {
        after: pageInfo && pageInfo.endCursor
      }
    })

  const isNew = node => !node.readAt || loadedAt < new Date(node.readAt)

  if (!nodes) return null
  const newNodes = nodes.filter(isNew)
  const hasNewNodes = newNodes.length

  return (
    <>
      {shouldReload ? <span onClick={() => onReload()}>Reload</span> : null}
      <Interaction.H1 style={{ marginBottom: '40px' }}>
        {hasNewNodes
          ? `${hasNewNodes} neue Benarichtigung${
              newNodes.length > 1 ? 'en' : ''
            }`
          : 'Alles gelesen!'}
      </Interaction.H1>

      <InfiniteScroll
        hasMore={hasNextPage}
        loadMore={loadMore}
        totalCount={totalCount}
        currentCount={nodes.length}
        loadMoreStyles={styles.more}
      >
        {groupByDate.entries(nodes).map(({ key, values }, i, all) => {
          return (
            <StickySection
              key={i}
              hasSpaceAfter={i < all.length - 1}
              label={key}
            >
              {values.map((node, j) => (
                <CommentNotification isNew={isNew(node)} node={node} key={j} />
              ))}
            </StickySection>
          )
        })}
      </InfiniteScroll>
    </>
  )
}
