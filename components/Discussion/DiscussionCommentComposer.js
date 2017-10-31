import React, {PureComponent} from 'react'
import {compose} from 'redux'
import {CommentComposer, CommentComposerPlaceholder} from '@project-r/styleguide'
import withT from '../../lib/withT'
import {withMe, submitComment} from './enhancers'

class DiscussionCommentComposer extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      isFocused: false
    }

    this.onFocus = () => {
      this.setState({isFocused: true})
    }

    this.onCancel = () => {
      this.setState({isFocused: false})
    }

    this.submitComment = content => {
      this.props.submitComment(undefined, content)
      this.setState({isFocused: false})
    }
  }

  render () {
    const {t, data: {loading, error, discussion, me}} = this.props
    const {isFocused} = this.state

    if (loading || error || !me) {
      return null
    } else {
      const profilePicture = me.publicUser && me.publicUser.testimonial && me.publicUser.testimonial.image

      if (isFocused) {
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
          <CommentComposer
            t={t}
            displayAuthor={displayAuthor}
            onCancel={this.onCancel}
            submitComment={this.submitComment}
          />
        )
      } else {
        return (
          <CommentComposerPlaceholder
            t={t}
            profilePicture={profilePicture}
            onClick={this.onFocus}
          />
        )
      }
    }
  }
}

export default compose(
  withT,
  withMe,
  submitComment
)(DiscussionCommentComposer)
