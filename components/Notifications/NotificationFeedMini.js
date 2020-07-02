import React from 'react'
import { compose, graphql } from 'react-apollo'
import { nest } from 'd3-collection'
import { css } from 'glamor'
import { parse } from 'url'
import {
  colors,
  Interaction,
  RawHtml,
  linkRule,
  mediaQueries,
  Label,
  fontStyles
} from '@project-r/styleguide'

import { notificationsMiniQuery } from '../Notifications/enhancers'
import Loader from '../Loader'
import { timeFormat } from '../../lib/utils/format'
import { Link } from '../../lib/routes'
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
  return (
    <Loader
      loading={loading}
      error={error}
      render={() => {
        const { nodes } = notifications
        const isNew = node => !node.readAt || new Date() < new Date(node.readAt)
        if (!nodes) return
        const newNodes = nodes.filter(node => isNew(node))

        return (
          <>
            {!nodes.length && (
              <>
                <Link route='subscriptionsSettings' passHref>
                  <a onClick={() => closeHandler()} {...linkRule}>
                    {t('Notifications/settings')}
                  </a>
                </Link>
                <Interaction.P>
                  <RawHtml
                    dangerouslySetInnerHTML={{
                      __html: t('Notifications/empty/paragraph')
                    }}
                  />
                </Interaction.P>
              </>
            )}

            {!newNodes.length && (
              <p>
                {t.elements('notifications/minifeed/nounread', {
                  link: (
                    <Link key='link' route='subscriptions' passHref>
                      <a onClick={() => closeHandler()} {...linkRule}>
                        {t('notifications/minifeed/nounread/link')}
                      </a>
                    </Link>
                  )
                })}
              </p>
            )}

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
                          {isNew(node) && <span {...styles.unreadDot} />}

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
    textDecoration: 'none'
  }),
  notificationItem: css({
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    ...fontStyles.sansSerifRegular14,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [mediaQueries.mUp]: fontStyles.sansSerifRegular16
  }),
  unreadDot: css({
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 8,
    border: `1px solid ${colors.containerBg}`,
    background: 'red'
  })
}

export default compose(
  withT,
  graphql(notificationsMiniQuery)
)(NotificationFeedMini)
