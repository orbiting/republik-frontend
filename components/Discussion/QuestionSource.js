import React, { Fragment, Component } from 'react'
import { compose, Mutation } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { colors, fontStyles, Loader, linkRule, P } from '@project-r/styleguide'
import MdKeyboardArrowUp from 'react-icons/lib/md/keyboard-arrow-up'
import MdKeyboardArrowDown from 'react-icons/lib/md/keyboard-arrow-down'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import NotificationOptions from './NotificationOptions'

import { withComments } from '../Feedback/enhancers'
import { upvoteCommentQuery, downvoteCommentQuery, unpublishComment, isAdmin, commentsSubscription } from './enhancers'

const config = {
  right: 26,
  left: 20
}

const buttonStyle = {
  outline: 'none',
  WebkitAppearance: 'none',
  background: 'transparent',
  border: 'none',
  padding: '0',
  display: 'block',
  cursor: 'pointer'
}

const styles = {
  button: css({
    ...fontStyles.sansSerifRegular21,
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    margin: '0 auto 0',
    display: 'block'
  }),
  newQuestion: css({
    ...fontStyles.sansSerifRegular16,
    outline: 'none',
    color: colors.text,
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    display: 'block'
  }),
  selectedOrderBy: css({
    textDecoration: 'underline'
  }),
  iconButton: css({
    ...buttonStyle,
    margin: '0 4px',
    '& svg': {
      margin: '0 auto'
    },

    '&[disabled]': {
      cursor: 'inherit',
      color: colors.disabled
    }
  }),
  rightButton: css({
    display: 'flex',
    justifyContent: 'center',
    height: `${config.right}px`,
    width: '24px',
    fontSize: `${config.right}px`,
    lineHeight: `${config.right}px`,
    margin: 0,
    '& > svg': {
      flexShrink: 0
    }
  }),
  leftButton: css({
    height: `${config.left}px`,
    width: `${config.left}px`,
    fontSize: `${config.left}px`,
    lineHeight: `${config.left}px`
  })
}

// Use the 'iconSize' to adjust the visual weight of the icon. For example
// the 'MdShareIcon' looks much larger next to 'MdKeyboardArrowUp' if both
// have the same dimensions.
//
// The outer dimensions of the action button element is always the same:
// square and as tall as the 'CommentAction' component.
const IconButton = ({ iconSize, type = 'right', onClick, title, children, style = {} }) => (
  <button {...styles.iconButton} {...styles[`${type}Button`]} {...style}
    title={title}
    disabled={!onClick}
    onClick={onClick}>
    {children}
  </button>
)

class QuestionSource extends Component {
  constructor (props) {
    super(props)

    this.state = {
      orderBy: 'VOTES', // DiscussionOrder
      now: Date.now(),
      isComposing: false
    }
  }

  componentDidMount () {
    this.intervalId = setInterval(() => {
      this.setState({ now: Date.now() })
    }, 10 * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  render () {
    const { t, discussionId, focusId = null, mute, meta, sharePath, data, fetchMore } = this.props
    const { orderBy, now, isComposing } = this.state

    this.submitHandler = (mutation, variables, refetch) => () => {
      this.setState({ loading: true })

      return mutation({
        variables
      })
        .then(() => {
          this.setState(() => ({ loading: false }))
          return refetch()
        })
        .catch((err) => {
          console.error(err)
          this.setState({
            loading: false
            // error: err.graphQLErrors[0].message
          })
        })
    }

    return (
      <Fragment>
        <div data-discussion-id={discussionId}>
          <Loader
            loading={data.loading}
            error={data.error}
            render={() => {
              const { comments } = data
              const { pageInfo } = comments
              return (
                <div>
                  {comments && comments.nodes
                    .map(
                      node => {
                        const {
                          id,
                          preview,
                          score,
                          userVote
                        } = node
                        const canUpvote = !userVote || userVote === 'DOWN'

                        return (
                          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline' }} key={`comment-${id}`}>
                            <div style={{ marginRight: 10, alignSelf: canUpvote ? 'flex-start' : 'flex-end' }}>
                              <Mutation
                                mutation={canUpvote ? upvoteCommentQuery : downvoteCommentQuery}

                              >
                                {(mutateComment, { loading }) => (
                                  <IconButton
                                    type='right'
                                    onClick={this.submitHandler(mutateComment, { commentId: id }, data.refetch)}
                                    title={t('styleguide/CommentActions/upvote')}
                                  >
                                    {canUpvote
                                      ? <MdKeyboardArrowUp />
                                      : <MdKeyboardArrowDown />
                                    }
                                  </IconButton>
                                )}
                              </Mutation>
                            </div>
                            <P style={{ marginRight: 10 }} title={t.pluralize('styleguide/CommentActions/upvote/count', { count: score })}>{score}</P>
                            <div>
                              <P>{preview.string}</P>
                            </div>
                          </div>
                        )
                      }
                    )}
                  {pageInfo.hasNextPage && (
                    <button
                      {...styles.button}
                      {...linkRule}
                      onClick={() => {
                        fetchMore({ after: pageInfo.endCursor })
                      }}
                    >
                      {t('feedback/fetchMore')}
                    </button>
                  )}
                </div>
              )
            }}
          />

          {isComposing &&
            <Fragment>
              <button {...styles.newQuestion} onClick={() => {
                this.setState({ isComposing: false })
              }}>
                schliessen
              </button>
              <DiscussionCommentComposer
                discussionId={discussionId}
                orderBy={orderBy}
                focusId={focusId}
                depth={1}
                parentId={null}
                now={now}
                afterSubmit={data.refetch}
                state='focused'
              />
            </Fragment>
          }
          {!isComposing &&
            <div>
              <button {...styles.newQuestion} onClick={() => {
                this.setState({ isComposing: true })
              }}>
                neue Frage stellen
              </button>
            </div>
          }
        </div>
      </Fragment>
    )
  }
}

export default compose(
  withT,
  withComments({
    orderBy: 'VOTES',
    first: 5
  })
)(QuestionSource)
