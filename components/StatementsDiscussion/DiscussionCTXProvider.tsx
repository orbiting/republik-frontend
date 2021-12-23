import React, { FC, ReactNode, useMemo } from 'react'
import { DiscussionContext } from '@project-r/styleguide/src/lib'
import { useMutation } from '@apollo/client'
import {
  DOWN_VOTE_COMMENT_ACTION,
  EDIT_COMMENT_MUTATION,
  FEATURE_COMMENT_MUTATION,
  REPORT_COMMENT_MUTATION,
  SUBMIT_COMMENT_MUTATION,
  UNPUBLISH_COMMENT_MUTATION,
  UP_VOTE_COMMENT_ACTION,
  UPVOTE_COMMENT_MUTATION
} from '../Discussion/graphql/documents'
import { useMe } from '../../lib/context/MeContext'
import deepMerge from '../../lib/deepMerge'
import { options } from 'colorette'

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
    canReply: true,
    canVote: true,
    canUnpublish: true
  }
}

type Props = {
  children: ReactNode
  discussionId: string
  focusId?: string
  options?: DiscussionOptions
  ignoreDefaultOptions: boolean
}

const DiscussionCTXProvider: FC<Props> = ({
  children,
  discussionId,
  focusId,
  options,
  ignoreDefaultOptions = false
}) => {
  // TODO: fetch discussion

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

    return deepMerge({}, DEFAULT_OPTIONS, passedOptions)
  }, [options, ignoreDefaultOptions])

  const availableActions = useMemo(() => {
    const actions = {}

    if (settings.actions.canComment) {
      // TODO: implement
    }

    if (settings.actions.canEdit) {
      actions.edit = editCommentMutation
    }

    if (settings.actions.canUnpublish) {
      actions.unpublish = unpublishCommentMutation
    }

    if (settings.actions.canReport) {
      actions.report = reportCommentMutation
    }

    if (settings.actions.canFeature) {
      actions.feature = featureCommentMutation
    }

    if (settings.actions.canVote) {
      actions.upVote = upVoteCommentMutation
      actions.downVote = downVoteCommentMutation
      actions.unVote = unVoteCommentMutation
    }

    return actions
  }, [discussionId, settings])

  const ctxValue = useMemo(() => {
    return {
      actions: availableActions
    }
  }, [discussionId, options])

  return (
    <DiscussionContext.Provider value={ctxValue}>
      {children}
    </DiscussionContext.Provider>
  )
}
