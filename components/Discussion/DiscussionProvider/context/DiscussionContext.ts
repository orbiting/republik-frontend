import { Context, useContext } from 'react'
import { ApolloError } from '@apollo/client'
import { DiscussionContext } from '@project-r/styleguide'
import { DiscussionQuery } from '../graphql/queries/DiscussionQuery.graphql'
import { FetchDiscussionFunctionType } from '../hooks/useDiscussionData'
import { DiscussionFocusHelperType } from '../hooks/useDiscussionFocusHelper'
import { OverlayState } from '../hooks/useOverlay'
import { CommentFragmentType } from '../graphql/fragments/CommentFragment.graphql'

export interface DiscussionContextValue {
  id: string
  discussion: DiscussionQuery['discussion'] | undefined
  loading: boolean
  error: ApolloError | undefined
  fetchMore: FetchDiscussionFunctionType
  refetch: FetchDiscussionFunctionType
  actions: {
    shareHandler: (comment: CommentFragmentType) => Promise<unknown>
  }
  orderBy: string
  activeTag: string | undefined
  focus: DiscussionFocusHelperType
  overlays: {
    preferencesOverlay: OverlayState<unknown>
    shareOverlay: OverlayState<string>
  }
}
/*
export const DiscussionContext = createContext<DiscussionContextValue>(
  {} as DiscussionContextValue
)
 */

export default DiscussionContext

export const useDiscussion = (): DiscussionContextValue => {
  return useContext(DiscussionContext as Context<DiscussionContextValue>)
}
