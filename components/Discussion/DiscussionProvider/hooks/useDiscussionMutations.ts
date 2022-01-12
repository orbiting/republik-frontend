import { useMutation } from '@apollo/client'
import { UNPUBLISH_COMMENT_MUTATION } from '../../graphql/documents'
import { toRejectedString } from '../../graphql/utils'

export type DiscussionMutations = {
  unpublishCommentHandler: any
}

function useDiscussionMutations(): DiscussionMutations {
  const [unpublishCommentMutation] = useMutation(UNPUBLISH_COMMENT_MUTATION)

  // TODO: Implement with overlay
  //const [featureCommentMutation] = useMutation(FEATURE_COMMENT_MUTATION)

  function unpublishCommentHandler(commentId) {
    return unpublishCommentMutation({
      variables: {
        commentId: commentId
      }
    }).catch(toRejectedString)
  }

  return {
    unpublishCommentHandler
  }
}

export default useDiscussionMutations
