import React, { FC, ReactNode, useMemo } from 'react'
import { DiscussionContext } from '@project-r/styleguide'
import { useMutation, useQuery } from '@apollo/client'
import {
  discussionQuery,
  DOWN_VOTE_COMMENT_ACTION,
  EDIT_COMMENT_MUTATION,
  FEATURE_COMMENT_MUTATION,
  REPORT_COMMENT_MUTATION,
  SUBMIT_COMMENT_MUTATION,
  UNPUBLISH_COMMENT_MUTATION,
  UP_VOTE_COMMENT_ACTION,
  UPVOTE_COMMENT_MUTATION
} from '../Discussion/graphql/documents'
import deepMerge from '../../lib/deepMerge'
import GET_PLEADINGS_QUERY from './graphql/GetPleadings.graphql'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'
import { useRouter } from 'next/router'
import uuid from 'uuid/v4'

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
}

const DiscussionCTXProvider: FC<Props> = ({
  children,
  discussionId,
  focusId,
  options,
  ignoreDefaultOptions = false,
  board
}) => {
  const { query } = useRouter()
  const orderBy =
    query.order ||
    (board
      ? 'HOT'
      : discussionId === GENERAL_FEEDBACK_DISCUSSION_ID
      ? 'DATE'
      : 'AUTO')

  const activeTag = query.tag

  const depth = board ? 1 : 3

  // TODO: fetch discussion
  const {
    data: { discussion } = {},
    error,
    loading,
    fetchMore,
    subscribeToMore,
    refetch,
    previousData
  } = useQuery(discussionQuery, {
    variables: {
      discussionId,
      orderBy,
      activeTag,
      depth: depth,
      focusId: focusId,
      first: 50
    }
  })

  // TODO: implement fetch-more

  const [createCommentMutation] = useMutation(SUBMIT_COMMENT_MUTATION)

  const [editCommentMutation] = useMutation(EDIT_COMMENT_MUTATION)
  const [unpublishCommentMutation] = useMutation(UNPUBLISH_COMMENT_MUTATION)
  const [reportCommentMutation] = useMutation(REPORT_COMMENT_MUTATION)

  const [featureCommentMutation] = useMutation(FEATURE_COMMENT_MUTATION)

  // Vote-Actions
  const [upVoteCommentMutation] = useMutation(UPVOTE_COMMENT_MUTATION)
  const [downVoteCommentMutation] = useMutation(DOWN_VOTE_COMMENT_ACTION)
  const [unVoteCommentMutation] = useMutation(UP_VOTE_COMMENT_ACTION)

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
      refetch,
      actions: availableActions
    }
  }, [discussion, loading, error, refetch, availableActions])

  return (
    <DiscussionContext.Provider value={ctxValue}>
      {children}
    </DiscussionContext.Provider>
  )
}

export default DiscussionCTXProvider
