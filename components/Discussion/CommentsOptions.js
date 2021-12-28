import { A, pxToRem, Scroller, TabButton } from '@project-r/styleguide'
import Link from 'next/link'
import { rerouteDiscussion } from './DiscussionLink'
import { getFocusUrl } from './CommentLink'
import React from 'react'
import { css } from 'glamor'

const styles = {
  reloadLink: css({
    display: 'flex',
    flexDirection: 'row-reverse',
    lineHeight: pxToRem('25px'),
    fontSize: pxToRem('16px'),
    cursor: 'pointer'
  })
}

const CommentsOptions = ({
  t,
  router,
  board,
  discussion,
  handleReload,
  resolvedOrderBy
}) => (
  <div>
    <Scroller>
      {['HOT', 'DATE', 'VOTES', 'REPLIES']
        .filter(item => (board ? true : item !== 'HOT'))
        .map(item => {
          return (
            <Link
              href={rerouteDiscussion(router, {
                order: item
              })}
              scroll={false}
              passHref
              key={item}
            >
              <TabButton
                border={false}
                text={t(`components/Discussion/OrderBy/${item}`)}
                isActive={item === resolvedOrderBy}
              />
            </Link>
          )
        })}
    </Scroller>
    <A
      {...styles.reloadLink}
      href={getFocusUrl(discussion)}
      onClick={handleReload}
    >
      {t('components/Discussion/reload')}
    </A>
  </div>
)

export default CommentsOptions
