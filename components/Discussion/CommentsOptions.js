import { A, pxToRem, Scroller, TabButton } from '@project-r/styleguide'
import Link from 'next/link'
import { rerouteDiscussion } from './DiscussionLink'
import { getFocusUrl } from './CommentLink'
import React, { useMemo } from 'react'
import { css } from 'glamor'
import PropTypes from 'prop-types'

const styles = {
  reloadLink: css({
    display: 'flex',
    flexDirection: 'row-reverse',
    lineHeight: pxToRem('25px'),
    fontSize: pxToRem('16px')
  })
}

const CommentsOptions = ({
  t,
  router,
  board,
  discussion,
  discussionType,
  handleReload,
  resolvedOrderBy
}) => {
  const availableOrderBy = useMemo(() => {
    let items

    if (discussionType === 'statements') {
      items = ['DATE', 'VOTES']
    } else {
      items = ['DATE', 'VOTES', 'REPLIES']
      if (board) {
        items = ['HOT', ...items]
      }
    }

    return items
  }, [discussionType, board])

  return (
    <div>
      <Scroller>
        {availableOrderBy.map(item => {
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
      {handleReload && (
        <A
          {...styles.reloadLink}
          href={getFocusUrl(discussion)}
          onClick={handleReload}
        >
          {t('components/Discussion/reload')}
        </A>
      )}
    </div>
  )
}

export default CommentsOptions

CommentsOptions.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  board: PropTypes.bool,
  discussion: PropTypes.object.isRequired,
  discussionType: PropTypes.string.isRequired,
  handleReload: PropTypes.func.isRequired,
  resolvedOrderBy: PropTypes.string.isRequired
}
