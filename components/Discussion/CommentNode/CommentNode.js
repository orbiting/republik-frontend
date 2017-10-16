import React, {PureComponent} from 'react'
import {css} from 'glamor'

import {Comment} from '../Comment'
import {InlineCommentComposer} from '../InlineCommentComposer'

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

class Node extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      showComposer: false
    }

    this.onAnswer = () => {
      this.setState({showComposer: true})
    }

    this.composerOnCancel = () => {
      this.setState({showComposer: false})
    }
  }

  render () {
    const {top, displayAuthor, score, content, comments} = this.props
    const {showComposer} = this.state
    const nodes = comments === undefined ? [] : comments.nodes

    if (nodes.length === 0) {
      return (
        <div {...commentNodeStyles.root}>
          <Comment
            timeago='2h'
            displayAuthor={displayAuthor}
            score={score}
            content={content}

            onAnswer={this.onAnswer}
          />

          {showComposer && <div>
            <InlineCommentComposer
              onCancel={this.composerOnCancel}
            />
          </div>}
        </div>
      )
    } else {
      const [firstChild, ...otherChildren] = nodes

      return (
        <div {...commentNodeStyles.root} {...(top ? commentNodeStyles.rootBorder : {})}>
          <Comment
            timeago='2h'
            displayAuthor={displayAuthor}
            score={score}
            content={content}

            onAnswer={this.onAnswer}
          />

          {showComposer && <div>
            <InlineCommentComposer
              onCancel={this.composerOnCancel}
            />
          </div>}

          {otherChildren.length > 0 && <div {...commentNodeStyles.childrenContainer}>
            {otherChildren.map(n => (
              <Node top={!top} key={n.id} {...n} />
            ))}
          </div>}

          <Node
            {...firstChild}
          />
        </div>
      )
    }
  }
}

const CommentNode = (props) =>
  <Node top {...props} />

export default CommentNode
