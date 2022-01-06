import { ApolloError, useMutation, useQuery, FetchResult } from '@apollo/client'
import {
  DISCUSSION_PREFERENCES_QUERY,
  SET_DISCUSSION_PREFERENCES_MUTATION
} from '../../graphql/documents'
import { toRejectedString } from '../../graphql/utils'

type DiscussionNotificationOption = 'MY_CHILDREN' | 'ALL' | 'NONE'

// TODO: Define type
type DiscussionPreferencesQueryData = {
  me: any
  discussion: any
}

// TODO: Define type
type DiscussionPreferencesQueryVariables = Record<string, any>

type SetDiscussionPreferencesMutationVariables = {
  discussionId: string
  discussionPreferences: {
    anonymity?: boolean
    credential?: string
    notifications?: DiscussionNotificationOption
  }
}

// TODO: Define type
type SetDiscussionPreferencesMutationResult = Record<string, any>

export type SetDiscussionPreferencesHandler = (
  anonymity: boolean,
  credential: string,
  notifications?: DiscussionNotificationOption
) => Promise<FetchResult<SetDiscussionPreferencesMutationResult>>

type DiscussionPreferences = {
  preferences: DiscussionPreferencesQueryData
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
   * @param anonymity
   * @param credential
   * @param notifications
   */
  async function setDiscussionPreferencesHandler(
    anonymity: boolean,
    credential: string,
    notifications?: DiscussionNotificationOption
  ) {
    return setDiscussionPreferencesMutation({
      variables: {
        discussionId,
        discussionPreferences: {
          anonymity,
          credential: credential?.trim() || null,
          notifications
        }
      }
    })
      .then(result => {
        refetch()
        return result
      })
      .catch(toRejectedString)
  }

  return {
    preferences: data,
    loading,
    error,
    setDiscussionPreferencesHandler
  }
}

export default useDiscussionPreferences
