import React from 'react'
import {
  colors,
  Interaction,
  RawHtml,
  linkRule,
  mediaQueries,
  Label,
  fontStyles
} from '@project-r/styleguide'
import { timeFormat } from '../../lib/utils/format'
import { nest } from 'd3-collection'
import { css } from 'glamor'
import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

const dateFormat = timeFormat('%d.%m')

const groupByDate = nest().key(n => {
  return dateFormat(new Date(n.createdAt))
})

export default withT(({ t, notifications, me }) => {
  const { nodes, totalCount, unreadCount, pageInfo } = notifications
  const isNew = node => !node.readAt || new Date() < new Date(node.readAt)
  if (!nodes) return null
  return (
    <>
      {!nodes.length && (
        <>
          <Link route='subscriptionsSettings' passHref>
            <a {...linkRule}>{t('Notifications/settings')}</a>
          </Link>
          <Interaction.P style={{ marginTop: 40 }}>
            <RawHtml
              dangerouslySetInnerHTML={{
                __html: t('Notifications/empty/paragraph')
              }}
            />
          </Interaction.P>
        </>
      )}

      {groupByDate.entries(nodes.slice(0, 3)).map(({ key, values }, i, all) => {
        return (
          <>
            {values.map((node, j) => {
              const { object } = node
              if (
                !node.object ||
                (node.object.__typename === 'Comment' && !node.object.published)
              ) {
                return (
                  <div {...styles.unpublished} key={j}>
                    <Label>{t('Notifications/unpublished/label')}</Label>
                  </div>
                )
              }
              return (
                <div {...styles.notificationItem} key={j}>
                  <a {...styles.cleanLink} href={node.content.url}>
                    {dateFormat(new Date(node.createdAt))} {node.content.title}
                  </a>
                </div>
              )
            })}
          </>
        )
      })}
    </>
  )
})

const styles = {
  unpublished: css({
    borderTop: `1px solid ${colors.text}`,
    margin: 0,
    paddingTop: 10,
    paddingBottom: 40
  }),
  unpublishedTitle: css({
    ...fontStyles.sansSerifMedium14,
    [mediaQueries.mUp]: fontStyles.sansSerifMedium16,
    margin: '5px 0 3px'
  }),
  cleanLink: css({
    color: 'inherit',
    textDecoration: 'none'
  }),
  notificationItem: css({
    marginTop: 10,
    ...fontStyles.sansSerifRegular14,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [mediaQueries.mUp]: fontStyles.sansSerifRegular16
  })
}
