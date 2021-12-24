import React, { FC, ReactNode, useEffect, useMemo } from 'react'
import { DiscussionContext } from '@project-r/styleguide'
import deepMerge from '../../lib/deepMerge'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'
import { useRouter } from 'next/router'
import uuid from 'uuid/v4'
import useDiscussionData from './hooks/useDiscussionData'
import useDiscussionMutations from './hooks/useDiscussionMutations'

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
  focusId?: string
  options?: DiscussionOptions
  ignoreDefaultOptions?: boolean
  board?: boolean
  parentId?: string
}

const DiscussionCTXProvider: FC<Props> = ({
  children,
  discussionId,
  focusId,
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

  const depth = board ? 1 : 3

  const { discussion, error, loading, refetch, fetchMore } = useDiscussionData(
    discussionId,
    {
      // TODO: Don't hard-code this
      first: 100,
      orderBy,
      activeTag,
      depth,
      focusId,
      parentId
    }
  )

  const {
    createCommentMutation,
    editCommentMutation,
    unpublishCommentMutation,
    reportCommentMutation,
    featureCommentMutation,
    upVoteCommentMutation,
    downVoteCommentMutation,
    unVoteCommentMutation
  } = useDiscussionMutations()

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

  const availableActions = useMemo(() => {
    const actions: Record<string, any> = {}

    if (settings.actions.canComment) {
      // TODO: implement
      actions.handleSubmit = (
        content,
        tags,
        { parentId } = { parentId: null }
      ) =>
        createCommentMutation({
          variables: {
            discussionId: discussion.id,
            parentId: parentId,
            content: content,
            tags: tags,
            id: uuid()
          }
        })
    }

    if (settings.actions.canEdit) {
      actions.handleEdit = editCommentMutation
    }

    if (settings.actions.canUnpublish) {
      actions.handleUnpublish = unpublishCommentMutation
    }

    if (settings.actions.canReport) {
      actions.handleReport = reportCommentMutation
    }

    if (settings.actions.canFeature) {
      actions.handleFeature = featureCommentMutation
    }

    if (settings.actions.canVote) {
      actions.handleUpVote = commentId =>
        upVoteCommentMutation({
          variables: { commentId: commentId }
        })
      actions.handleDownVote = commentId =>
        downVoteCommentMutation({
          variables: { commentId: commentId }
        })
      actions.handleUnVote = commentId =>
        unVoteCommentMutation({
          variables: { commentId: commentId }
        })
    }

    return actions
  }, [discussion, settings])

  const ctxValue = useMemo(() => {
    return {
      discussion,
      loading: loading,
      error: error,
      fetchMore,
      refetch,
      actions: availableActions,
      orderBy,
      activeTag
    }
  }, [discussion, loading, error, refetch, availableActions])

  return (
    <DiscussionContext.Provider value={ctxValue}>
      {children}
    </DiscussionContext.Provider>
  )
}

export default DiscussionCTXProvider
