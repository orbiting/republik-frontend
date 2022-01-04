import React, { FC, ReactNode } from 'react'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../../lib/constants'
import { useRouter } from 'next/router'
import useDiscussionData from './hooks/useDiscussionData'
import useDiscussionMutations from './hooks/useDiscussionMutations'
import useOverlay from './hooks/useOverlay'
import DiscussionOverlays from './components/DiscussionOverlays'
import DiscussionContext from './context/DiscussionContext'
import { postMessage, useInNativeApp } from '../../../lib/withInNativeApp'
import { getFocusUrl } from '../CommentLink'
import { useTranslation } from '../../../lib/withT'
import useDiscussionFocusHelper from './hooks/useDiscussionFocusHelper'

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

  const { loading: focusLoading, error: focusError } = useDiscussionFocusHelper(
    discussion
  )

  // TODO: Abstract into overlay actions hook

  const { inNativeApp } = useInNativeApp()
  const { t } = useTranslation()

  function shareHandler(comment) {
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

  const preferencesOverlay = useOverlay()
  const shareOverlay = useOverlay<string>()

  const ctxValue = {
    discussion,
    loading: loading || focusLoading,
    error: error || focusError,
    fetchMore,
    refetch,
    actions: {
      ...actions,
      shareHandler,
      openDiscussionPreferences: () => {
        preferencesOverlay.handleOpen()
        return Promise.resolve({ ok: true })
      }
    },
    orderBy,
    activeTag,
    overlays: {
      preferencesOverlay,
      shareOverlay
    }
  }

  return (
    <DiscussionContext.Provider value={ctxValue}>
      {children}
      {discussion && <DiscussionOverlays />}
    </DiscussionContext.Provider>
  )
}

export default DiscussionProvider
