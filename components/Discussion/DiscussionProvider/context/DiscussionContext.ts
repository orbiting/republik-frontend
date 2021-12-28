import { createContext, useContext } from 'react'
import { ApolloError } from '@apollo/client'
import { OverlayState } from '../hooks/useOverlay'

// TODO: Add proper type
export type Discussion = any

// TODO: Type Comment received for a disucssion
type Comment = any

interface DiscussionContextValue {
  discussion: Discussion | null
  loading: boolean
  error?: ApolloError
  overlays: {
    shareOverlay: OverlayState<string>
    featureOverlay: OverlayState<Comment>
  }
}

export const DiscussionContext = createContext<DiscussionContextValue>(
  {} as DiscussionContextValue
)

const useDiscussion = () => {
  return useContext<DiscussionContextValue>(DiscussionContext)
}
