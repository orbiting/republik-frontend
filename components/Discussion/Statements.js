import React, { Fragment, Component } from 'react'
import { compose, Mutation } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { colors, fontStyles, Loader, Label, mediaQueries, Comment } from '@project-r/styleguide'
import MdKeyboardArrowUp from 'react-icons/lib/md/keyboard-arrow-up'
import MdKeyboardArrowDown from 'react-icons/lib/md/keyboard-arrow-down'
import withMembership from '../Auth/withMembership'

import DiscussionCommentComposer from './DiscussionCommentComposer'

import { withComments } from '../Feedback/enhancers'
import { upvoteCommentQuery, downvoteCommentQuery } from './enhancers'

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
  wrapper: css({
    width: '100%',
    display: 'flex',
    alignItems: 'baseline',
    [mediaQueries.onlyS]: {
      flexDirection: 'column',
      marginTop: 15
    }
  }),
  question: css({
    '& p': {
      ...fontStyles.serifRegular19,
      [mediaQueries.onlyS]: {
        ...fontStyles.serifRegular17
      }
    }
  }),
  questionRank: css({
    ...fontStyles.sansSerifMedium14,
    textAlign: 'right',
    paddingRight: 10
  }),
  highlight: css({
    background: colors.primaryBg,
    marginTop: 5,
    padding: 10
  }),
  button: css({
    ...fontStyles.sansSerifMedium16,
    [mediaQueries.onlyS]: {
      ...fontStyles.sansSerifMedium18
    },
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
    color: colors.primary,
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    display: 'block',
    marginBottom: 5
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
    height: `26px`,
    width: '24px',
    fontSize: `26px`,
    lineHeight: `26px`,
    margin: 0,
    '& > svg': {
      flexShrink: 0
    }
  }),
  rightActions: css({
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    lineHeight: '1',
    marginLeft: 'auto'
  }),
  votes: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }),
  vote: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }),
  voteDivider: css({
    color: colors.disabled,
    padding: '0 2px'
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

class Statements extends Component {
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
    const { t, discussionId, focusId = null, data, isMember } = this.props
    const { orderBy, now, isComposing } = this.state

    this.submitHandler = (mutation, variables) => () => {
      this.setState({ loading: true })

      return mutation({
        variables
      })
        .then(() => {
          this.setState(() => ({ loading: false }))
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
              return (
                <div>
                  {comments && comments.nodes
                    .map(
                      (node, index) => {
                        const {
                          id,
                          userVote,
                          upVotes,
                          downVotes,
                          content
                        } = node
                        return (
                          <div {...styles.wrapper} key={`comment-${id}`}>
                            <div {...styles.questionRank}>{index + 1}.</div>
                            <div {...styles.question} >{Comment.renderComment(content)}</div>

                            {false && isMember &&
                            <div {...styles.rightActions}>
                              <div {...styles.votes}>
                                <Mutation
                                  mutation={upvoteCommentQuery}
                                >
                                  {(mutateComment) => (
                                    <div {...styles.vote}>
                                      <IconButton
                                        onClick={
                                          (!userVote || userVote === 'DOWN')
                                            ? this.submitHandler(mutateComment, { commentId: id })
                                            : null
                                        }
                                        title={t('styleguide/CommentActions/upvote')}>
                                        <MdKeyboardArrowUp />
                                      </IconButton>
                                      <Label
                                        title={t.pluralize('styleguide/CommentActions/upvote/count', { count: upVotes })}>{upVotes}</Label>
                                    </div>
                                  )}
                                </Mutation>
                                <div {...styles.voteDivider}>/</div>
                                <Mutation
                                  mutation={downvoteCommentQuery}

                                >
                                  {(mutateComment) => (
                                    <div {...styles.vote}>
                                      <Label
                                        title={t.pluralize('styleguide/CommentActions/downvote/count', { count: downVotes })}>{downVotes}</Label>
                                      <IconButton
                                        onClick={
                                          (!userVote || userVote === 'UP')
                                            ? this.submitHandler(mutateComment, { commentId: id })
                                            : null
                                        }
                                        title={t('styleguide/CommentActions/downvote')}>
                                        <MdKeyboardArrowDown />
                                      </IconButton>
                                    </div>
                                  )}
                                </Mutation>
                              </div>
                            </div>
                            }
                          </div>
                        )
                      }
                    )}
                </div>
              )
            }}
          />

          {false && isMember &&
          <div style={{ marginTop: 10 }}>
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
                afterCancel={() => this.setState({ isComposing: false })}
                afterSubmit={(res) => {
                  const lastId = (res && res.data && res.data.submitComment.id) || null
                  this.setState({ isComposing: false, lastId })
                  data.refetch({ lastId })
                }}
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
          }
        </div>
      </Fragment>
    )
  }
}

export default compose(
  withT,
  withMembership,
  withComments({
    orderBy: 'VOTES',
    first: 100
  })
)(Statements)
