import { useContext } from 'react'
import { DiscussionContext } from '@project-r/styleguide'

/*
// TODO: Add proper type
export type Discussion = any

// TODO: Type Comment received for a disucssion
type Comment = any

interface DiscussionContextValue {
  discussion: Discussion | null
  loading: boolean
  error?: ApolloError
  fetchMore: any
  refetch
  overlays: {
    shareOverlay: OverlayState<string>
  }
}

export const DiscussionContext = createContext<DiscussionContextValue>(
  {} as DiscussionContextValue
)
 */

export default DiscussionContext

export const useDiscussion = () => {
  return useContext(DiscussionContext)
}
