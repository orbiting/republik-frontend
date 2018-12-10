import React, { Fragment } from 'react'
import { css } from 'glamor'
import { matchType } from 'mdast-react-render/lib/utils'
import { renderMdast } from 'mdast-react-render'
import withT from '../../lib/withT'

import PathLink from '../Link/Path'
import { Link } from '../../lib/routes'
import timeago from '../../lib/timeago'

import ArticleItem from './ArticleItem'

import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'

import {
  Comment,
  CommentBodyParagraph,
  Editorial,
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
  tab,
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
  if (tab) {
    return (
      <Link
        route='discussion'
        params={{ t: tab, id: discussion ? discussion.id : undefined, focus: commentId }}
        passHref
      >
        {children}
      </Link>
    )
  }
  if (discussion) {
    const focus = commentId
    const path = discussion &&
      discussion.document &&
      discussion.document.meta &&
      discussion.document.meta.path
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
  t,
  id,
  discussion,
  preview,
  displayAuthor,
  published,
  createdAt,
  updatedAt,
  parentIds,
  tags,
  onTeaserClick
}) => {
  const timeagoFromNow = createdAtString => {
    return timeago(t, (new Date() - Date.parse(createdAtString)) / 1000)
  }
  const { string, more } = preview
  const meta = (discussion && discussion.document && discussion.document.meta) || {}
  const isGeneral = discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID
  const newPage = !isGeneral && meta.template === 'discussion'
  const onPage = meta.template === 'article'

  const onClick = (e) => {
    e.preventDefault()
    onTeaserClick({
      discussionId: discussion.id,
      meta,
      focusId: id
    })
  }

  const contextTitle = isGeneral
    ? parentIds.length === 0 && tags && tags.length && (
      <CommentLink
        key={id}
        commentId={id}
        tab='general'
      >
        <a {...styles.link} onClick={onClick}>
          {tags[0]}
        </a>
      </CommentLink>
    )
    : discussion.title
      ? (onPage && (
        <CommentLink
          key={id}
          commentId={id}
          discussion={discussion}
          tab='article'
        >
          <a {...styles.link} onClick={onClick}>
            <ArticleItem
              iconSize={18}
              title={`«${discussion.title}»`}
              newPage={false} />
          </a>
        </CommentLink>
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

  const contextDescription = !isGeneral && meta.credits && meta.credits.length > 0
    ? renderMdast(meta.credits, creditSchema)
    : undefined
  const context = contextTitle ? {
    title: contextTitle,
    description: contextDescription
  } : undefined

  return (
    <div {...styles.root}>
      <Comment
        t={t}
        displayAuthor={displayAuthor}
        Link={CommentLink}
        published={published}
        createdAt={createdAt}
        timeago={timeagoFromNow}
        context={context}
      >
        <CommentBodyParagraph>
          <CommentLink
            newPage={newPage}
            commentId={id}
            discussion={discussion}
            tab={isGeneral ? 'general' : onPage ? 'article' : undefined}
          >
            <a {...styles.linkBlockStyle}
              style={{ opacity: published ? 1 : 0.5 }}
              onClick={newPage ? undefined : onClick}>
              {!!string && (
                <Fragment>
                  {string}
                  {!!more && <span>{' '}…</span>}
                </Fragment>
              )}
            </a>
          </CommentLink>
        </CommentBodyParagraph>
      </Comment>
    </div>
  )
}

export default withT(CommentTeaser)
