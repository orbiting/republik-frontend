import React from 'react'
import {css} from 'glamor'
import {fontFamilies} from '@project-r/styleguide/lib/theme/fonts'

import CommentHeader from './CommentHeader'
import CommentActions from './CommentActions'

const commentStyles = {
  body: css({
    fontFamily: fontFamilies.serifRegular,
    fontSize: '14px',
    lineHeight: '19px',
    margin: '10px 0'
  })
}

export const Comment = ({timeago, displayAuthor, score, content, onAnswer, onUpvote, onDownvote}) => (
  <div>
    <CommentHeader
      {...displayAuthor}
      timeago={timeago}
    />

    <div {...commentStyles.body}>
      {content}
    </div>

    <CommentActions
      score={score}
      onAnswer={onAnswer}
      onUpvote={onUpvote}
      onDownvote={onDownvote}
    />
  </div>
)

export default Comment
