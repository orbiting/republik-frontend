import { useMutation } from '@apollo/client'
import {
  REPORT_COMMENT_MUTATION,
  UNPUBLISH_COMMENT_MUTATION
} from '../../graphql/documents'
import { toRejectedString } from '../../graphql/utils'

export type DiscussionMutations = {
  unpublishCommentHandler: any
  reportCommentHandler: any
}

function useDiscussionMutations(): DiscussionMutations {
  const [unpublishCommentMutation] = useMutation(UNPUBLISH_COMMENT_MUTATION)
  const [reportCommentMutation] = useMutation(REPORT_COMMENT_MUTATION)

  // TODO: Implement with overlay
  //const [featureCommentMutation] = useMutation(FEATURE_COMMENT_MUTATION)

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
    unpublishCommentHandler,
    reportCommentHandler
  }
}

export default useDiscussionMutations
