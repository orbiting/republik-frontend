import React, { FC, ReactNode, useMemo } from 'react'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../../lib/constants'
import { useRouter } from 'next/router'
import uuid from 'uuid/v4'
import useDiscussionData from './hooks/useDiscussionData'
import useDiscussionActions from './hooks/useDiscussionActions'
import deepMerge from '../../../lib/deepMerge'
import useOverlay from './hooks/useOverlay'
import DiscussionOverlays from './components/DiscussionOverlays'
import DiscussionContext from './context/DiscussionContext'

type DiscussionOptions = {
  actions: {
    canComment?: boolean
    canEdit?: boolean
    canUnpublish?: boolean
    canReport?: boolean
    canReply?: boolean
    canVote?: boolean
    canFeature?: boolean
  }
}

const DEFAULT_OPTIONS = {
  actions: {
    canComment: true,
    canReply: true,
    canVote: true,
    canUnpublish: true
  }
}

type Props = {
  children?: ReactNode
  discussionId: string
  options?: DiscussionOptions
  ignoreDefaultOptions?: boolean
  board?: boolean
  parentId?: string
}

const DiscussionProvider: FC<Props> = ({
  children,
  discussionId,
  options,
  ignoreDefaultOptions = false,
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

  const actions = useDiscussionActions()

  const shareOverlay = useOverlay<string>()

  /**
   * Return the settings of the discussion.
   */
  const settings = useMemo(() => {
    if (!options) {
      return DEFAULT_OPTIONS
    }

    if (ignoreDefaultOptions) {
      return options
    }

    return deepMerge({}, DEFAULT_OPTIONS, options)
  }, [options, ignoreDefaultOptions])

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
