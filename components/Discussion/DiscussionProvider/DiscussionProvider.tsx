import React, { FC, ReactNode } from 'react'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../../lib/constants'
import { useRouter } from 'next/router'
import useDiscussionData from './hooks/useDiscussionData'
import useDiscussionMutations from './hooks/useDiscussionMutations'
import useOverlay from './hooks/useOverlay'
import DiscussionOverlays from './components/DiscussionOverlays'
import DiscussionContext from './context/DiscussionContext'

type Props = {
  children?: ReactNode
  discussionId: string
  board?: boolean
  parentId?: string
}

const DiscussionProvider: FC<Props> = ({
  children,
  discussionId,
  board,
  parentId
}) => {
  const { query } = useRouter()
  const orderBy =
    (query.order as string) ||
    (board
      ? 'HOT'
      : discussionId === GENERAL_FEEDBACK_DISCUSSION_ID
      ? 'DATE'
      : 'AUTO')

  const activeTag = query.tag as string
  const focusId = query.focus as string

  const depth = board ? 1 : 3

  const { discussion, error, loading, refetch, fetchMore } = useDiscussionData(
    discussionId,
    {
      orderBy,
      activeTag,
      depth,
      focusId,
      parentId
    }
  )

  const actions = useDiscussionMutations()

  const shareOverlay = useOverlay<string>()

  const ctxValue = {
    discussion,
    loading: loading,
    error: error,
    fetchMore,
    refetch,
    actions,
    orderBy,
    activeTag,
    overlays: {
      shareOverlay
    }
  }

  return (
    <DiscussionContext.Provider value={ctxValue}>
      <DiscussionOverlays />
      {children}
    </DiscussionContext.Provider>
  )
}

export default DiscussionProvider
