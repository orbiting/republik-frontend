import React, {PureComponent} from 'react'
import {compose} from 'redux'
import {CommentComposer, CommentComposerPlaceholder} from '@project-r/styleguide'
import withT from '../../lib/withT'
import {withMe, submitComment} from './enhancers'
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
    const {t, discussionId, data: {loading, error, discussion, me}} = this.props
    const {state, showPreferences} = this.state

    if (loading || error || !me) {
      return null
    } else {
      const profilePicture = me.publicUser && me.publicUser.testimonial && me.publicUser.testimonial.image

      if (state === 'idle') {
        return (
          <CommentComposerPlaceholder
            t={t}
            profilePicture={profilePicture}
            onClick={this.onFocus}
          />
        )
      }

      const credential = (() => {
        const {userPreference} = discussion
        return userPreference ? userPreference.credential : undefined
      })()

      const displayAuthor = {
        profilePicture,
        name: me.name,
        credential
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
  submitComment
)(DiscussionCommentComposer)
