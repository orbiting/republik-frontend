import { useMutation } from '@apollo/client'
import {
  DOWN_VOTE_COMMENT_ACTION,
  EDIT_COMMENT_MUTATION,
  FEATURE_COMMENT_MUTATION,
  REPORT_COMMENT_MUTATION,
  SUBMIT_COMMENT_MUTATION,
  UNPUBLISH_COMMENT_MUTATION,
  UP_VOTE_COMMENT_ACTION,
  UPVOTE_COMMENT_MUTATION
} from '../../graphql/documents'
import { toRejectedString } from '../../graphql/utils'
import uuid from 'uuid/v4'

export type DiscussionMutations = {
  submitCommentHandler: any
  editCommentHandler: any
  unpublishCommentHandler: any
  reportCommentHandler: any
  upVoteCommentHandler: any
  downVoteCommentHandler: any
  unVoteCommentHandler: any
}

function useDiscussionMutations(): DiscussionMutations {
  const [submitCommentMutation] = useMutation(SUBMIT_COMMENT_MUTATION)

  const [editCommentMutation] = useMutation(EDIT_COMMENT_MUTATION)
  const [unpublishCommentMutation] = useMutation(UNPUBLISH_COMMENT_MUTATION)
  const [reportCommentMutation] = useMutation(REPORT_COMMENT_MUTATION)

  const [featureCommentMutation] = useMutation(FEATURE_COMMENT_MUTATION)

  // Vote-Actions
  const [upVoteCommentMutation] = useMutation(UPVOTE_COMMENT_MUTATION)
  const [downVoteCommentMutation] = useMutation(DOWN_VOTE_COMMENT_ACTION)
  const [unVoteCommentMutation] = useMutation(UP_VOTE_COMMENT_ACTION)

  async function submitCommentHandler(
    content,
    tags,
    { discussionId, parentId }
  ) {
    return submitCommentMutation({
      variables: {
        id: uuid(),
        discussionId,
        parentId,
        content,
        tags
      }
    }).catch(err => ({ error: `${err}` }))
  }

  async function editCommentHandler(commentId, content, tags) {
    return editCommentMutation({
      variables: {
        commentId,
        content,
        tags
      }
    }).catch(toRejectedString)
  }

  async function unpublishCommentHandler(commentId) {
    return unpublishCommentMutation({
      variables: {
        commentId: commentId
      }
    }).catch(toRejectedString)
  }

  async function reportCommentHandler(commentId) {
    return reportCommentMutation({
      variables: {
        commentId: commentId
      }
    }).catch(toRejectedString)
  }

  // TODO: Feature comment

  async function upVoteCommentHandler(commentId) {
    return upVoteCommentMutation({
      variables: {
        commentId: commentId
      }
    }).catch(toRejectedString)
  }

  async function downVoteCommentHandler(commentId) {
    return downVoteCommentMutation({
      variables: {
        commentId: commentId
      }
    }).catch(toRejectedString)
  }

  async function unVoteCommentHandler(commentId) {
    return unVoteCommentMutation({
      variables: {
        commentId: commentId
      }
    }).catch(toRejectedString)
  }

  return {
    submitCommentHandler,
    editCommentHandler,
    unpublishCommentHandler,

    reportCommentHandler,

    upVoteCommentHandler,
    downVoteCommentHandler,
    unVoteCommentHandler
  }
}

export default useDiscussionMutations
