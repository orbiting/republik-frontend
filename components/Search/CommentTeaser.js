import React, { Fragment } from 'react'
import { css } from 'glamor'

import PathLink from '../Link/Path'
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

export const CommentTeaser = ({
  id,
  discussion,
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
  const fragment =
    highlights &&
    highlights[0] &&
    highlights[0].fragments &&
    highlights[0].fragments[0]

  return (
    <div {...styles.root}>
      <CommentHeader
        {...displayAuthor}
        published={published}
        createdAt={createdAt}
        timeago={timeagoFromNow}
        t={t}
      />
      {discussion.documentPath && (
        <Fragment>
          <p {...styles.note}>
            {t.elements('search/commentTeaser/discussionReference', {
              link: (
                <PathLink
                  path={discussion.documentPath}
                  query={{ focus: id }}
                  passHref
                >
                  <a {...linkRule}>{discussion.title}</a>
                </PathLink>
              )
            })}
          </p>
          <CommentBodyParagraph>
            <PathLink
              path={discussion.documentPath}
              query={{ focus: id }}
              passHref
            >
              <a {...styles.linkBlockStyle}>
                <RawHtml
                  dangerouslySetInnerHTML={{
                    __html: fragment
                  }}
                />
              </a>
            </PathLink>
          </CommentBodyParagraph>
        </Fragment>
      )}
    </div>
  )
}

export default CommentTeaser
