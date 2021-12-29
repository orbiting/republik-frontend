import { ApolloError, useMutation, useQuery, FetchResult } from '@apollo/client'
import {
  DISCUSSION_PREFERENCES_QUERY,
  SET_DISCUSSION_PREFERENCES_MUTATION
} from '../../graphql/documents'
import { toRejectedString } from '../../graphql/utils'

type DiscussionNotificationOption = 'MY_CHILDREN' | 'ALL' | 'NONE'

// TODO: Define type
type DiscussionPreferencesQueryData = Record<string, any>

// TODO: Define type
type DiscussionPreferencesQueryVariables = Record<string, any>

type SetDiscussionPreferencesMutationVariables = {
  discussionId: string
  discussionPreferences: {
    anonymity?: boolean
    credential?: boolean
    notifications?: DiscussionNotificationOption
  }
}

// TODO: Define type
type SetDiscussionPreferencesMutationResult = Record<string, any>

export type SetDiscussionPreferencesHandler = (
  data: SetDiscussionPreferencesMutationVariables
) => Promise<FetchResult<SetDiscussionPreferencesMutationResult>>

type DiscussionPreferences = {
  discussionPreferences: DiscussionPreferencesQueryData
  loading: boolean
  error?: ApolloError
  setDiscussionPreferencesHandler: SetDiscussionPreferencesHandler
}

function useDiscussionPreferences(discussionId: string): DiscussionPreferences {
  const { data, loading, error, refetch } = useQuery<
    DiscussionPreferencesQueryData,
    DiscussionPreferencesQueryVariables
  >(DISCUSSION_PREFERENCES_QUERY, {
    variables: { discussionId }
  })

  const [setDiscussionPreferencesMutation] = useMutation<
    SetDiscussionPreferencesMutationResult,
    SetDiscussionPreferencesMutationVariables
  >(SET_DISCUSSION_PREFERENCES_MUTATION)

  /**
   * Update the discussionPreferences and trigger a refetch from the server
   * @param data
   */
  async function setDiscussionPreferencesHandler(
    data: SetDiscussionPreferencesMutationVariables
  ) {
    return setDiscussionPreferencesMutation({
      variables: data
    })
      .then(result => {
        refetch()
        return result
      })
      .catch(toRejectedString)
  }

  return {
    discussionPreferences: data,
    loading,
    error,
    setDiscussionPreferencesHandler
  }
}

export default useDiscussionPreferences
