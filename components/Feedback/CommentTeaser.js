import React, { Fragment } from 'react'
import { css } from 'glamor'
import get from 'lodash.get'

import PathLink from '../Link/Path'
import { Link } from '../../lib/routes'
import timeago from '../../lib/timeago'

import NewPage from 'react-icons/lib/md/open-in-new'

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
    const path = discussion && discussion.document && discussion.document.meta && discussion.document.meta.path
    if (path) {
      return (
        <PathLink
          path={path}
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
  t,
  onArticleClick
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

  const meta = discussion && discussion.document && discussion.document.meta
  const newPage = meta && meta.template === 'discussion'
  const onPage = meta && meta.template === 'article'

  const onClick = (e) => {
    e.preventDefault()
    onArticleClick({
      discussionId: discussion.id,
      meta: {
        title: meta.title,
        credits: meta.credits,
        path: meta.path
      },
      focusId: id
    })
  }

  const Wrapper = ({ children, newPage, commentId, discussion }) => {
    return newPage
      ? <CommentLink
        commentId={id}
        discussion={discussion}
      >
        {children}
      </CommentLink>
      : children
  }

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
        <Wrapper
          newPage={newPage}
          commentId={id}
          discussion={discussion}
        >
          <a {...styles.linkBlockStyle}
            style={{ opacity: published ? 1 : 0.5 }}
            onClick={newPage ? undefined : onClick}>
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
        </Wrapper>
      </CommentBodyParagraph>

      {onPage && discussion.title && (
        <p {...styles.note}>
          {t.elements('feedback/commentTeaser/articleReference', {
            link: (
              <CommentLink
                key={id}
                commentId={id}
                discussion={discussion}
              >
                <a {...linkRule} onClick={onClick}>
                  {discussion.title}
                </a>
              </CommentLink>
            )
          })}
        </p>
      )}
      {newPage && discussion.title && (
        <p {...styles.note}>
          {t.elements('feedback/commentTeaser/discussionReference', {
            link: (
              <CommentLink
                key={id}
                commentId={id}
                discussion={discussion}
              >
                <a {...linkRule}>
                  {discussion.title}{' '}
                  <span {...styles.icon} title={'Zur Debattenseite'}>
                    <NewPage size={16} fill={colors.disabled} />
                  </span>
                </a>
              </CommentLink>
            )
          })}
        </p>
      )}
    </div>
  )
}

export default CommentTeaser
