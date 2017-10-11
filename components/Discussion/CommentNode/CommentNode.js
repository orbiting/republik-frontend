import React from 'react'
import {css} from 'glamor'

import {Comment} from '../Comment'

const commentNodeStyles = {
  root: css({
    margin: '40px 0',

    '&:first-child': {
      marginTop: '0'
    },
    '&:last-child': {
      marginBottom: '0'
    }
  }),
  rootBorder: css({
    paddingLeft: '14px',
    borderLeft: '1px solid #DBDBDB'
  }),
  childrenContainer: css({
    margin: '40px 0 40px 15px'
  })
}

const CommentNode = ({displayAuthor, score, content, comments: {nodes}}) => {
  if (nodes.length === 0) {
    return (
      <div {...commentNodeStyles.root}>
        <Comment
          timeago='2h'
          displayAuthor={displayAuthor}
          score={score}
          content={content}
        />
      </div>
    )
  } else {
    const [firstChild, ...otherChildren] = nodes

    return (
      <div {...commentNodeStyles.root} {...commentNodeStyles.rootBorder}>
        <Comment
          timeago='2h'
          displayAuthor={displayAuthor}
          score={score}
          content={content}
        />

        {otherChildren.length > 0 && <div {...commentNodeStyles.childrenContainer}>
          {otherChildren.map(n => (
            <Node key={n.id} {...n} />
          ))}
        </div>}

        <Node
          {...firstChild}
        />
      </div>
    )
  }
}

const Node = ({displayAuthor, score, content, comments: {nodes}}) => {
  if (nodes.length === 0) {
    return (
      <div {...commentNodeStyles.root}>
        <Comment
          timeago='2h'
          displayAuthor={displayAuthor}
          score={score}
          content={content}
        />
      </div>
    )
  } else {
    const [firstChild, ...otherChildren] = nodes

    return (
      <div {...commentNodeStyles.root}>
        <Comment
          timeago='2h'
          displayAuthor={displayAuthor}
          score={score}
          content={content}
        />

        {otherChildren.length > 0 && <div {...commentNodeStyles.childrenContainer}>
          {otherChildren.map(n => (
            <CommentNode key={n.id} {...n} />
          ))}
        </div>}

        <Node
          {...firstChild}
        />
      </div>
    )
  }
}

export default CommentNode
