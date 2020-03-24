import React from 'react'
import {
  colors,
  Interaction,
  Center,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'
import StickySection from '../Feed/StickySection'
import CommentNotification from './CommentNotification'
import InfiniteScroll from '../Frame/InfiniteScroll'
import { timeFormat } from '../../lib/utils/format'
import { nest } from 'd3-collection'
import { css } from 'glamor'
import DocumentNotification from './DocumentNotification'
import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

const dateFormat = timeFormat('%A,\n%d.%m.%Y')

const groupByDate = nest().key(n => {
  return dateFormat(new Date(n.createdAt))
})

const styles = {
  container: css({
    paddingTop: 15,
    paddingBottom: 120,
    [mediaQueries.mUp]: {
      paddingTop: 40
    }
  }),
  more: css({
    position: 'relative',
    height: 50,
    padding: '20px 0 0 0'
  }),
  reloadBanner: css({
    backgroundColor: colors.primaryBg
  }),
  reloadBannerButton: css({
    cursor: 'pointer',
    textDecoration: 'underline'
  })
}

const ReloadBanner = withT(({ t, futureNotifications, onReload }) =>
  futureNotifications ? (
    <div {...styles.reloadBanner}>
      <Center>
        <Interaction.P>
          {t.pluralize('Notifications/refresh', {
            count: futureNotifications
          })}{' '}
          <span {...styles.reloadBannerButton} onClick={() => onReload()}>
            {t('Notifications/refresh/link')}
          </span>
        </Interaction.P>
      </Center>
    </div>
  ) : null
)

export default withT(
  ({
    t,
    notifications,
    me,
    loadedAt,
    fetchMore,
    futureNotifications,
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
              (node, index, all) =>
                all.findIndex(n => n.id === node.id) === index
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

    return (
      <>
        <ReloadBanner
          futureNotifications={futureNotifications}
          onReload={onReload}
        />
        <Center {...styles.container}>
          <div style={{ marginBottom: 80 }}>
            <Interaction.H1 style={{ marginBottom: 20 }}>
              {t.pluralize('Notifications/title', {
                count: newNodes.length
              })}
            </Interaction.H1>

            <Link route='subscriptionsSettings' passHref>
              <a {...linkRule}>{t('Notifications/settings')}</a>
            </Link>
          </div>

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
                  {values.map((node, j) => {
                    return node.object.__typename === 'Document' ? (
                      <DocumentNotification
                        isNew={isNew(node)}
                        node={node}
                        me={me}
                        key={j}
                      />
                    ) : (
                      <CommentNotification
                        isNew={isNew(node)}
                        node={node}
                        key={j}
                      />
                    )
                  })}
                </StickySection>
              )
            })}
          </InfiniteScroll>
        </Center>
      </>
    )
  }
)
