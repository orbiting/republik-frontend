import React, { Fragment } from 'react'
import { css } from 'glamor'
import get from 'lodash.get'
import { matchType } from 'mdast-react-render/lib/utils'
import { renderMdast } from 'mdast-react-render'

import PathLink from '../Link/Path'
import { Link } from '../../lib/routes'
import timeago from '../../lib/timeago'

import ArticleItem from './ArticleItem'

import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'

import {
  Comment,
  CommentBodyParagraph,
  Editorial,
  RawHtml,
  colors,
  fontStyles
} from '@project-r/styleguide'

const br = {
  matchMdast: matchType('break'),
  component: () => <br />,
  isVoid: true
}

const link = {
  matchMdast: matchType('link'),
  props: node => ({
    title: node.title,
    href: node.url
  }),
  component: Editorial.A
}

const creditSchema = {
  rules: [link, br]
}

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
    ? parentIds.length === 0 && tags && (
      <a {...styles.link} onClick={onClick}>
        {t(`discussion/tag/${tags[0]}`)}
      </a>
    )
    : discussion.title
      ? (onPage && (
        <a {...styles.link} onClick={onClick}>
          <ArticleItem
            iconSize={18}
            title={`«${discussion.title}»`}
            newPage={false} />
        </a>
      )) || (newPage && (
        <CommentLink
          key={id}
          commentId={id}
          discussion={discussion}
        >
          <a {...styles.link}>
            <ArticleItem
              iconSize={18}
              title={`«${discussion.title}»`}
              newPage />
          </a>
        </CommentLink>
      ))
      : undefined
  const contextDescription = !isGeneral && meta && meta.credits && meta.credits.length > 0
    ? renderMdast(meta.credits, creditSchema)
    : undefined
  const context = contextTitle ? {
    title: contextTitle,
    description: contextDescription
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
