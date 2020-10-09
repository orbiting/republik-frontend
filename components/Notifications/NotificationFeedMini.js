import React from 'react'
import { compose, graphql } from 'react-apollo'
import { nest } from 'd3-collection'
import { css } from 'glamor'
import { parse } from 'url'
import {
  useColorContext,
  mediaQueries,
  fontStyles,
  Loader
} from '@project-r/styleguide'

import { notificationsMiniQuery } from '../Notifications/enhancers'
import { timeFormat } from '../../lib/utils/format'
import PathLink from '../Link/Path'
import withT from '../../lib/withT'

const dateFormat = timeFormat('%d.%m')

const groupByDate = nest().key(n => {
  return dateFormat(new Date(n.createdAt))
})

const NotificationFeedMini = ({
  t,
  data: { notifications, loading, error },
  closeHandler
}) => {
  const [colorScheme] = useColorContext()
  return (
    <Loader
      style={{ minHeight: 60 }}
      delay={200}
      loading={loading}
      error={error}
      render={() => {
        const { nodes } = notifications
        const isNew = node => !node.readAt || new Date() < new Date(node.readAt)
        if (!nodes) return
        const newNodes = nodes.filter(node => isNew(node))

        return (
          <>
            {newNodes &&
              groupByDate.entries(newNodes).map(({ key, values }, i, all) => {
                return (
                  <React.Fragment key={key}>
                    {values.map((node, j) => {
                      const { object } = node
                      const path = parse(node.content.url).path
                      if (
                        !object ||
                        (object.__typename === 'Comment' && !object.published)
                      ) {
                        return (
                          <p key={j}>{t('Notifications/unpublished/label')}</p>
                        )
                      }
                      return (
                        <div {...styles.notificationItem} key={j}>
                          {isNew(node) && (
                            <div
                              {...styles.unreadDot}
                              {...colorScheme.rules.default.borderColor}
                            />
                          )}

                          <PathLink path={path} passHref>
                            <a
                              {...styles.cleanLink}
                              onClick={() => closeHandler()}
                            >
                              {dateFormat(new Date(node.createdAt))}{' '}
                              {node.content.title}
                            </a>
                          </PathLink>
                        </div>
                      )
                    })}
                  </React.Fragment>
                )
              })}
          </>
        )
      }}
    />
  )
}

const styles = {
  cleanLink: css({
    color: 'inherit',
    textDecoration: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }),
  notificationItem: css({
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    ...fontStyles.sansSerifRegular14,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    [mediaQueries.mUp]: fontStyles.sansSerifRegular16
  }),
  unreadDot: css({
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 8,
    border: `1px solid`,
    background: 'red'
  })
}

export default compose(
  withT,
  graphql(notificationsMiniQuery, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  })
)(NotificationFeedMini)
