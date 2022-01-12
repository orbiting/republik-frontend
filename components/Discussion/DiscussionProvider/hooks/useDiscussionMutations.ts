import { useMutation } from '@apollo/client'
import {
  EDIT_COMMENT_MUTATION,
  REPORT_COMMENT_MUTATION,
  UNPUBLISH_COMMENT_MUTATION
} from '../../graphql/documents'
import { toRejectedString } from '../../graphql/utils'

export type DiscussionMutations = {
  editCommentHandler: any
  unpublishCommentHandler: any
  reportCommentHandler: any
}

function useDiscussionMutations(): DiscussionMutations {
  const [editCommentMutation] = useMutation(EDIT_COMMENT_MUTATION)
  const [unpublishCommentMutation] = useMutation(UNPUBLISH_COMMENT_MUTATION)
  const [reportCommentMutation] = useMutation(REPORT_COMMENT_MUTATION)

  // TODO: Implement with overlay
  //const [featureCommentMutation] = useMutation(FEATURE_COMMENT_MUTATION)

  function editCommentHandler(commentId, content, tags) {
    return editCommentMutation({
      variables: {
        commentId,
        content,
        tags
      }
    }).catch(toRejectedString)
  }

  function unpublishCommentHandler(commentId) {
    return unpublishCommentMutation({
      variables: {
        commentId: commentId
      }
    }).catch(toRejectedString)
  }

  function reportCommentHandler(commentId) {
    return reportCommentMutation({
      variables: {
        commentId: commentId
      }
    }).catch(toRejectedString)
  }

  // TODO: Feature comment

  return {
    editCommentHandler,
    unpublishCommentHandler,
    reportCommentHandler
  }
}

export default useDiscussionMutations
