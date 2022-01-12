import { FetchResult } from '@apollo/client'
import uuid from 'uuid/v4'
import { toRejectedString } from '../../../graphql/utils'
import Optional from '../../../../../lib/types/Optional'
import {
  SubmitCommentMutationResult,
  useSubmitCommentMutation
} from '../../graphql/mutations/SubmitCommentMutation.graphql'

export type SubmitCommentHandlerFunction = (
  content: string,
  tags: string[],
  options: {
    discussionId: Optional<string>
    parentId: Optional<string>
  }
) => Promise<FetchResult<SubmitCommentMutationResult>>

function useSubmitCommentHandler(): SubmitCommentHandlerFunction {
  const [submitCommentMutation] = useSubmitCommentMutation()

  return async (
    content: string,
    tags: string[],
    {
      discussionId,
      parentId
    }: {
      discussionId: Optional<string>
      parentId: Optional<string>
    }
  ) => {
    return submitCommentMutation({
      variables: {
        id: uuid(),
        content,
        discussionId,
        parentId,
        tags
      }
    }).catch(toRejectedString)
  }
}

export default useSubmitCommentHandler
