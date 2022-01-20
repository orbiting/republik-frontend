import usePreviewCommentQuery, {
  PreviewCommentQuery,
  PreviewCommentQueryVariables
} from '../graphql/queries/PreviewCommentQuery.graphql'
import { errorToString } from '../../../lib/utils/errors'

export type PreviewCommentHandler = (
  variables: PreviewCommentQueryVariables
) => Promise<PreviewCommentQuery>

function usePreviewCommentHandler(): PreviewCommentHandler {
  const { refetch } = usePreviewCommentQuery()

  return async (
    variables: PreviewCommentQueryVariables
  ): Promise<PreviewCommentQuery> => {
    return await refetch(variables)
      .then(result => result?.data)
      .catch(errorToString)
  }
}

export default usePreviewCommentHandler
