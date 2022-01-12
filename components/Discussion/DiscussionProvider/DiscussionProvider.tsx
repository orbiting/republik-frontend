import React, { FC, ReactNode } from 'react'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../../lib/constants'
import { useRouter } from 'next/router'
import useDiscussionData from './hooks/useDiscussionData'
import useOverlay from './hooks/useOverlay'
import DiscussionOverlays from './components/DiscussionOverlays'
import DiscussionContext, {
  DiscussionContextValue
} from './context/DiscussionContext'
import { postMessage, useInNativeApp } from '../../../lib/withInNativeApp'
import { getFocusUrl } from '../CommentLink'
import { useTranslation } from '../../../lib/withT'
import useDiscussionFocusHelper from './hooks/useDiscussionFocusHelper'
import DiscussionMetaHelper from './components/DiscussionMetaHelper'
import useDiscussionNotificationHelper from './hooks/useDiscussionNotificationHelper'
import { CommentFragmentType } from './graphql/fragments/CommentFragment.graphql'

/**
 * Wrapper component that provides the discussion data it's children.
 * It also handles logic for focusing on comments and displaying rendering of overlays.
 * @constructor
 */
const DiscussionProvider: FC<{
  children?: ReactNode
  discussionId: string
  board?: boolean
  parentId?: string
}> = ({ children, discussionId, board, parentId }) => {
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

  useDiscussionNotificationHelper(discussion)

  const { loading: focusLoading, error: focusError } = useDiscussionFocusHelper(
    focusId,
    loading,
    discussion
  )

  // TODO: Abstract into overlay actions hook

  const { inNativeApp } = useInNativeApp()
  const { t } = useTranslation()

  function shareHandler(comment: CommentFragmentType): Promise<unknown> {
    if (inNativeApp) {
      postMessage({
        type: 'share',
        payload: {
          title: discussion.title,
          url: getFocusUrl(discussion, comment),
          subject: t(
            'discussion/share/emailSubject',
            {
              title: discussion.title
            },
            ''
          ),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dialogTitle: t('article/share/title')
        }
      })
    } else {
      shareOverlay.handleOpen(getFocusUrl(discussion, comment))
    }
    return Promise.resolve({ ok: true })
  }

  // Create overlay state that is meant to be accessed by all discussion-components

  const preferencesOverlay = useOverlay<unknown>()
  const shareOverlay = useOverlay<string>()

  const contextValue: DiscussionContextValue = {
    id: discussionId,
    discussion,
    loading: loading,
    error: error,
    fetchMore,
    refetch,
    actions: {
      shareHandler
    },
    orderBy,
    activeTag,
    focus: {
      loading: focusLoading,
      error: focusError
    },
    overlays: {
      preferencesOverlay,
      shareOverlay
    }
  }

  return (
    <DiscussionContext.Provider value={contextValue}>
      <div data-discussion-id={discussionId}>
        {children}
        {discussion && (
          <>
            <DiscussionOverlays />
            <DiscussionMetaHelper />
          </>
        )}
      </div>
    </DiscussionContext.Provider>
  )
}

export default DiscussionProvider
