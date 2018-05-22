import React from 'react'
import { css } from 'glamor'
import { renderMdast } from 'mdast-react-render'

import PathLink from '../Link/Path'
import { Link } from '../../lib/routes'
import timeago from '../../lib/timeago'

import {
  CommentHeader,
  CommentBodyParagraph,
  RawHtml,
  colors,
  fontFamilies,
  fontStyles,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

import createCommentSchema from '@project-r/styleguide/lib/templates/Comment/web'

const schema = createCommentSchema()

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
      fontFamily: fontFamilies.serifBold,
      fontStyle: 'normal'
    }
  }),
  note: css({
    ...fontStyles.sansSerifRegular12,
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
  if (displayAuthor) {
    return (
      <Link
        route='profile'
        params={{ slug: displayAuthor.username || displayAuthor.id }}
      >
        {children}
      </Link>
    )
  }
  if (commentId) {
    if (discussion.documentPath) {
      return (
        <PathLink
          path={discussion.documentPath}
          query={{ focus: commentId }}
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
        params={{ id: discussion.id, focus: commentId }}
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
  const highlight =
    highlights &&
    highlights[0] &&
    highlights[0].fragments &&
    highlights[0].fragments[0] &&
    highlights[0].fragments[0].trim()

  // TODO: This whole client-side text truncation needs more thinking.
  let firstChildValue = content && content.children[0].children[0].value
  if (firstChildValue && firstChildValue.length > 300) {
    firstChildValue = firstChildValue.substring(0, 300)
    firstChildValue = firstChildValue.substring(0, firstChildValue.lastIndexOf(' ')).trim() + ' …'
  }

  const truncatedContent = {
    ...content,
    children: content ? [
      firstChildValue
        ? {
          ...content.children[0].children[0],
          value: firstChildValue
        }
        : content.children[0]
    ] : []
  }
  const moreContent = !!content && content.children.length > 1
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
      {!!highlight && (
        <CommentBodyParagraph>
          <CommentLink
            commentId={id}
            discussion={discussion}
          >
            <a {...styles.linkBlockStyle}>
              <RawHtml
                dangerouslySetInnerHTML={{
                  __html: highlight
                }}
              />
              {!endsWithPunctuation && <span>{' '}…</span>}
            </a>
          </CommentLink>
        </CommentBodyParagraph>
      )}
      {!highlight && !!truncatedContent && (
        <div {...styles.body} style={{opacity: published ? 1 : 0.5}}>
          {renderMdast(truncatedContent, schema)}
          {!!moreContent && <span>{' '}…</span>}
        </div>
      )}
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
