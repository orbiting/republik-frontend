import React, { Fragment } from 'react'
import { css } from 'glamor'
import get from 'lodash.get'

import PathLink from '../Link/Path'
import { Link } from '../../lib/routes'
import timeago from '../../lib/timeago'

import {
  CommentHeader,
  CommentBodyParagraph,
  RawHtml,
  colors,
  fontStyles,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  root: css({
    borderTop: `1px solid ${colors.text}`,
    margin: '0 0 40px 0',
    paddingTop: 10
  }),
  linkBlockStyle: css({
    color: 'inherit',
    textDecoration: 'none',
    '& em': {
      background: colors.primaryBg,
      fontStyle: 'normal'
    }
  }),
  note: css({
    ...fontStyles.sansSerifRegular14,
    margin: '10px 0',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular15
    }
  })
}
const CommentLink = ({
  displayAuthor,
  commentId,
  children,
  discussion,
  ...props
}) => {
  if (displayAuthor && displayAuthor.username) {
    return (
      <Link
        route='profile'
        params={{ slug: displayAuthor.username }}
      >
        {children}
      </Link>
    )
  }
  if (discussion) {
    const focus = commentId
    if (discussion.documentPath) {
      return (
        <PathLink
          path={discussion.documentPath}
          query={{ focus }}
          passHref
          {...props}
        >
          {children}
        </PathLink>
      )
    }
    return (
      <Link
        route='discussion'
        params={{ id: discussion.id, focus }}
        {...props}
      >
        {children}
      </Link>
    )
  }
  return children
}

export const CommentTeaser = ({
  id,
  discussion,
  content,
  preview,
  highlights,
  displayAuthor,
  published,
  createdAt,
  updatedAt,
  t
}) => {
  const timeagoFromNow = createdAtString => {
    return timeago(t, (new Date() - Date.parse(createdAtString)) / 1000)
  }
  const { string, more } = preview
  const highlight = get(highlights, 'highlights[0].fragments[0]', '').trim()
  const endsWithPunctuation =
    highlight &&
    (Math.abs(highlight.lastIndexOf('...') - highlight.length) < 4 ||
      Math.abs(highlight.lastIndexOf('…') - highlight.length) < 2 ||
      Math.abs(highlight.lastIndexOf('.') - highlight.length) < 2)

  return (
    <div {...styles.root}>
      <CommentHeader
        {...displayAuthor}
        Link={CommentLink}
        published={published}
        createdAt={createdAt}
        timeago={timeagoFromNow}
        t={t}
      />

      <CommentBodyParagraph>
        <CommentLink
          commentId={id}
          discussion={discussion}
        >
          <a {...styles.linkBlockStyle} style={{opacity: published ? 1 : 0.5}}>
            {!highlight && !!string && (
              <Fragment>
                {string}
                {!!more && <span>{' '}…</span>}
              </Fragment>
            )}
            {!!highlight && (
              <Fragment>
                <RawHtml
                  dangerouslySetInnerHTML={{
                    __html: highlight
                  }}
                />
                {!endsWithPunctuation && <span>{' '}…</span>}
              </Fragment>
            )}
          </a>
        </CommentLink>
      </CommentBodyParagraph>

      {discussion.title && (
        <p {...styles.note}>
          {t.elements('search/commentTeaser/discussionReference', {
            link: (
              <CommentLink
                key={id}
                commentId={id}
                discussion={discussion}
              >
                <a {...linkRule}>«{discussion.title}»</a>
              </CommentLink>
            )
          })}
        </p>
      )}
    </div>
  )
}

export default CommentTeaser
