import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery
} from '@apollo/client'

/**
 * Create a new hook for a query
 * @param query graphql query that should be defined for the new hook
 */
function makeQueryHook<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>
) {
  return (
    options?: QueryHookOptions<TData, TVariables>
  ): QueryResult<TData, TVariables> =>
    useQuery<TData, TVariables>(query, options)
}

export default makeQueryHook
