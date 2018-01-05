import React, {PureComponent} from 'react'
import { compose } from 'react-apollo'
import { CommentComposer, CommentComposerPlaceholder } from '@project-r/styleguide'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import { withMyPreferences, withDiscussionDisplayAuthor, submitComment } from './enhancers'
import DiscussionPreferences from './DiscussionPreferences'

class DiscussionCommentComposer extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      state: 'idle', // idle | focused | submitting | error
      error: undefined, // If state == error then this is the error string.
      showPreferences: false
    }

    this.onFocus = () => {
      this.setState({
        state: 'focused',
        error: undefined
      })
    }

    this.onCancel = () => {
      this.setState({
        state: 'idle',
        error: undefined
      })
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

    this.submitComment = content => {
      this.setState({
        state: 'submitting'
      })

      this.props.submitComment(undefined, content).then(
        () => {
          this.setState({
            state: 'idle',
            error: undefined
          })
        },
        (e) => {
          this.setState({
            state: 'error',
            error: e
          })
        }
      )
    }
  }

  render () {
    const {t, discussionId, discussionDisplayAuthor: displayAuthor, me, data: {loading, error}} = this.props
    const {state, showPreferences} = this.state

    if (loading || error || !me) {
      return null
    } else {
      if (state === 'idle') {
        return (
          <CommentComposerPlaceholder
            t={t}
            profilePicture={displayAuthor ? displayAuthor.profilePicture : null}
            onClick={this.onFocus}
          />
        )
      }

      return (
        <div>
          <CommentComposer
            t={t}
            displayAuthor={displayAuthor}
            error={this.state.error}
            onEditPreferences={this.showPreferences}
            onCancel={this.onCancel}
            submitComment={this.submitComment}
            submitLabel={t('submitComment/rootSubmitLabel')}
          />
          {showPreferences && (
            <DiscussionPreferences
              discussionId={discussionId}
              onClose={this.closePreferences}
            />
          )}
        </div>
      )
    }
  }
}

export default compose(
  withT,
  withMe,
  withMyPreferences,
  withDiscussionDisplayAuthor,
  submitComment
)(DiscussionCommentComposer)
