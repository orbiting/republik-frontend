import React, { Fragment } from 'react'
import { css } from 'glamor'
import get from 'lodash.get'

import PathLink from '../Link/Path'
import { Link } from '../../lib/routes'
import timeago from '../../lib/timeago'

import NewPage from 'react-icons/lib/md/open-in-new'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'

import {
  Comment,
  CommentBodyParagraph,
  RawHtml,
  colors,
  fontStyles
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
  link: css({
    ...fontStyles.link,
    color: colors.text,
    cursor: 'pointer',
    '&:visited': {
      color: colors.text
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
  parentIds,
  tags,
  t,
  onTeaserClick
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
  const isGeneral = discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID
  const newPage = !isGeneral && meta && meta.template === 'discussion'
  const onPage = meta && meta.template === 'article'

  const onClick = (e) => {
    e.preventDefault()
    onTeaserClick({
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
  const contextTitle = isGeneral
    ? parentIds.length === 0 && tags && <a {...styles.link} onClick={onClick}>{t(`discussion/tag/${tags[0]}`)}</a>
    : discussion.title
      ? onPage ? (
        <Fragment>
          {t.elements('feedback/commentTeaser/articleReference', {
            link: (
              <a {...styles.link} onClick={onClick}>
                «{discussion.title}»
              </a>
            )
          })}
        </Fragment>
      ) : newPage
        ? (
          <Fragment>
            {t.elements('feedback/commentTeaser/discussionReference', {
              link: (
                <CommentLink
                  key={id}
                  commentId={id}
                  discussion={discussion}
                >
                  <a {...styles.link}>
                    «{discussion.title}»{' '}
                    <span {...styles.icon} title={'Zur Debattenseite'}>
                      <NewPage size={16} fill={colors.disabled} />
                    </span>
                  </a>
                </CommentLink>
              )
            })}
          </Fragment>
        )
        : undefined
      : undefined
  const context = contextTitle ? {
    title: contextTitle,
    description: undefined // TODO: render meta.credits mdast.
  } : undefined

  return (
    <div {...styles.root}>
      <Comment
        displayAuthor={displayAuthor}
        Link={CommentLink}
        published={published}
        createdAt={createdAt}
        timeago={timeagoFromNow}
        t={t}
        context={context}
      >
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
      </Comment>
    </div>
  )
}

export default CommentTeaser
