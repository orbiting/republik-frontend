import { Context, useContext } from 'react'
import { ApolloError } from '@apollo/client'
import { DiscussionContext } from '@project-r/styleguide'
import { DiscussionQuery } from '../graphql/queries/DiscussionQuery.graphql'
import { FetchDiscussionFunctionType } from '../hooks/useDiscussionData'
import { DiscussionFocusHelperType } from '../hooks/useDiscussionFocusHelper'
import { OverlayState } from '../hooks/overlays/useOverlay'
import { ShareOverlayState } from '../hooks/overlays/useShareCommentOverlay'

export interface DiscussionContextValue {
  id: string
  discussion: DiscussionQuery['discussion'] | undefined
  loading: boolean
  error: ApolloError | undefined
  fetchMore: FetchDiscussionFunctionType
  refetch: FetchDiscussionFunctionType
  orderBy: string
  activeTag: string | undefined
  focus: DiscussionFocusHelperType
  overlays: {
    preferencesOverlay: OverlayState<unknown>
    shareOverlay: ShareOverlayState
  }
}
/*
export const DiscussionContext = createContext<DiscussionContextValue>(
  {} as DiscussionContextValue
)
 */

// TODO: One the dialog-components no longer directly use the discussion context
// replace it with the above commented out code
export default DiscussionContext

export const useDiscussion = (): DiscussionContextValue => {
  return useContext(DiscussionContext as Context<DiscussionContextValue>)
}
