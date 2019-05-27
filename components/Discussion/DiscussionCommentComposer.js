import React, { PureComponent } from 'react'
import { compose } from 'react-apollo'
import timeahead from '../../lib/timeahead'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import { Link } from '../../lib/routes'
import produce from 'immer'

import { withDiscussionDisplayAuthor } from './graphql/enhancers/withDiscussionDisplayAuthor'
import { withDiscussionPreferences } from './graphql/enhancers/withDiscussionPreferences'
import { withDiscussionComments } from './graphql/enhancers/withDiscussionComments'
import { withSubmitComment } from './graphql/enhancers/withSubmitComment'

import DiscussionPreferences from './DiscussionPreferences'
import SecondaryActions from './SecondaryActions'

import {
  Loader,
  DiscussionContext,
  CommentComposer,
  CommentComposerPlaceholder,
  Interaction,
  Editorial,
  DEFAULT_PROFILE_PICTURE
} from '@project-r/styleguide'

import Box from '../Frame/Box'

class DiscussionCommentComposer extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      state: props.state || 'idle', // idle | focused | submitting | error
      showPreferences: false
    }

    this.onFocus = () => {
      this.setState({ state: 'focused' })
    }

    this.onCancel = () => {
      this.setState({ state: 'idle' })
    }

    this.showPreferences = () => {
      this.setState({
        showPreferences: true
      })
    }

    this.closePreferences = () => {
      this.setState({
        showPreferences: false
      })
    }

    this.submitComment = async ({ text, tags }) => {
      this.setState({ state: 'submitting' })

      return new Promise(resolve => {
        this.props.submitComment(null, text, tags).then(
          () => {
            resolve({ ok: true })
            this.setState({ state: 'idle' })
          },
          error => {
            resolve({ error: '' + error })
          }
        )
      })
    }
  }

  render () {
    const {
      t,
      discussionId,
      discussionDisplayAuthor,
      me,
      discussionClosed,
      discussionUserCanComment,
      discussionPreferences: { loading, error, discussion },
      now,
      parentId
    } = this.props
    const { state, showPreferences } = this.state

    const timeAheadFromNow = dateString => {
      return timeahead(t, (now - Date.parse(dateString)) / 1000)
    }

    return (
      <Loader
        loading={loading}
        error={error || (discussion === null && t('discussion/missing'))}
        render={() => {
          const displayAuthor = produce(discussionDisplayAuthor || {}, draft => {
            if (!draft.profilePicture) {
              draft.profilePicture = DEFAULT_PROFILE_PICTURE
            }
          })

          const disableTopLevelComments = !!discussion.rules.disableTopLevelComments && parentId === null
          if (!me || disableTopLevelComments) {
            return null
          } else if (discussionClosed) {
            return <Box style={{ padding: '15px 20px' }}>{t('discussion/closed')}</Box>
          } else {
            if (!discussionUserCanComment) {
              return (
                <Box style={{ padding: '15px 20px' }}>
                  <Interaction.P>
                    {t.elements('submitComment/notEligible', {
                      pledgeLink: (
                        <Link route='pledge' key='pledge' passHref>
                          <Editorial.A>{t('submitComment/notEligible/pledgeText')}</Editorial.A>
                        </Link>
                      )
                    })}
                  </Interaction.P>
                </Box>
              )
            }

            const waitUntilDate = discussion.userWaitUntil && new Date(discussion.userWaitUntil)
            if (waitUntilDate && waitUntilDate > new Date()) {
              return (
                <Box style={{ padding: '15px 20px' }}>
                  <Interaction.P>
                    {t('styleguide/CommentComposer/wait', { time: timeAheadFromNow(waitUntilDate) })}
                  </Interaction.P>
                </Box>
              )
            }

            if (state === 'idle') {
              return <CommentComposerPlaceholder t={t} displayAuthor={displayAuthor} onClick={this.onFocus} />
            }

            const discussionContextValue = {
              discussion: produce(discussion, draft => {
                draft.displayAuthor = displayAuthor
              }),

              actions: {
                openDiscussionPreferences: () => {
                  this.showPreferences()
                  return Promise.resolve({ ok: true })
                }
              },

              composerSecondaryActions: <SecondaryActions />
            }

            return (
              <DiscussionContext.Provider value={discussionContextValue}>
                <CommentComposer
                  t={t}
                  isRoot
                  onClose={this.onCancel}
                  onSubmit={this.submitComment}
                  onSubmitLabel={t('submitComment/rootSubmitLabel')}
                />
                {showPreferences && (
                  <DiscussionPreferences discussionId={discussionId} onClose={this.closePreferences} />
                )}
              </DiscussionContext.Provider>
            )
          }
        }}
      />
    )
  }
}

export default compose(
  withT,
  withMe,
  withDiscussionDisplayAuthor,
  withDiscussionPreferences,
  withDiscussionComments,
  withSubmitComment
)(DiscussionCommentComposer)
