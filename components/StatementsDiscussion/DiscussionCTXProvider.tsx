import React, { FC, ReactNode, useEffect, useMemo } from 'react'
import { DiscussionContext } from '@project-r/styleguide'
import { useMutation, useQuery } from '@apollo/client'
import {
  commentsSubscription,
  DISCUSSION_QUERY,
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
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'
import { useRouter } from 'next/router'
import uuid from 'uuid/v4'
import produce from '../../lib/immer'
import {
  bumpCounts,
  mergeComment,
  mergeComments
} from '../Discussion/graphql/store'

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
    refetch
  } = useQuery(DISCUSSION_QUERY, {
    variables: {
      discussionId,
      orderBy,
      activeTag,
      depth: depth,
      focusId: focusId
    }
  })

  /**
   * Merge previous and next comments when fetching more
   * @param parentId
   * @param after
   * @param appendAfter
   * @param depth
   * @param includeParent
   */
  const enhancedFetchMore = ({
    parentId,
    after,
    appendAfter,
    depth,
    includeParent
  }) =>
    fetchMore({
      variables: {
        discussionId,
        parentId,
        after,
        orderBy,
        activeTag,
        depth: depth || 3,
        includeParent
      },
      updateQuery: (previousResult, { fetchMoreResult: { discussion } }) => {
        return produce(
          previousResult,
          mergeComments({
            parentId,
            appendAfter,
            comments: discussion.comments
          })
        )
      }
    })

  const subscribeToComments = subscribeToMore({
    document: commentsSubscription,
    variables: { discussionId },
    onError(...args) {
      console.debug('subscribe:onError', args)
    },
    updateQuery: (previousResult, { subscriptionData }) => {
      console.debug('subscribe:updateQuery', subscriptionData.data)
      const initialParentId = parentId

      /*
       * Regardless of what we do here, the Comment object in the cache will be updated.
       * We only have to take care of updating objects other than the Comment, like in
       * this case update the Discussion object. This is why we only care about the
       * 'CREATED' mutation and ignore 'DELETED' (which can't happen anyways) and 'UPDATED'.
       */
      if (
        subscriptionData.data &&
        subscriptionData.data.comment.mutation === 'CREATED'
      ) {
        const comment = subscriptionData.data.comment.node

        if (initialParentId && !comment.parentIds.includes(initialParentId)) {
          return previousResult
        }

        /*
         * Ignore updates related to comments we created in the current client session.
         * If this is the first comment in the discussion, show it immediately. Otherwise
         * just bump the counts and let the user click the "Load More" buttons.
         */
        if (previousResult.discussion.comments.totalCount === 0) {
          return produce(
            previousResult,
            mergeComment({
              comment,
              initialParentId,
              activeTag
            })
          )
        } else {
          return produce(
            previousResult,
            bumpCounts({ comment, initialParentId })
          )
        }
      } else {
        return previousResult
      }
    }
  })

  useEffect(() => {
    subscribeToComments()
  }, [discussion, subscribeToComments])

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
      fetchMore: enhancedFetchMore,
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
