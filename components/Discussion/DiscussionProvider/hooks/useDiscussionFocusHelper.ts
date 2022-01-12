import { DiscussionQuery } from '../graphql/queries/DiscussionQuery.graphql'
import { useEffect, useState } from 'react'
import { focusSelector } from '../../../../lib/utils/scroll'
import { useTranslation } from '../../../../lib/withT'

export type DiscussionFocusHelperType = {
  loading: boolean
  error: Error | null
}

/**
 * Helper hook to highlight and navigate to the closest comment in the current discussion
 * @param focusId
 * @param discussionLoading
 * @param discussion
 */
function useDiscussionFocusHelper(
  focusId: string | null,
  discussionLoading: boolean,
  discussion?: DiscussionQuery['discussion']
): DiscussionFocusHelperType {
  const { t } = useTranslation()
  const [currentFocusId, setCurrentFocusId] = useState<string | null>(null)
  const [focusLoading, setFocusLoading] = useState(false)
  const [focusError, setFocusError] = useState(null)

  function navigateToSelector(selector: string) {
    /*
     * Wrap 'focusSelector()' in a timeout to work around a bug. See
     * https://github.com/orbiting/republik-frontend/issues/243 for more
     * details
     */
    setTimeout(() => {
      // When the comment has been found
      focusSelector(selector)
    }, 50)
  }

  // Sync input-focusId with state
  useEffect(() => {
    if (focusId && focusId !== currentFocusId) {
      setCurrentFocusId(focusId)
      setFocusLoading(true)
      setFocusError(null)
    }
  }, [focusId, currentFocusId])

  useEffect(() => {
    if (!focusLoading || discussionLoading || !discussion) {
      return
    }

    // If the focus element could not be fetched assume 404
    if (!discussion.comments?.focus) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFocusError(new Error(t('discussion/focus/notFound')))
      setFocusLoading(false)
      const selector = `[data-discussion-id='${discussion.id}']`
      navigateToSelector(selector)
      return
    }

    // At this point we know the focus exists

    // Check if the focus is already present in the loaded comments
    if (
      discussion.comments.nodes.find(comment => comment.id === currentFocusId)
    ) {
      setFocusLoading(false)
      const selector = `[data-comment-id='${currentFocusId}']`
      navigateToSelector(selector)
      return
    } else {
      // TODO: implement logic to fetch by parentId etc.
    }
  }, [discussion, discussionLoading, focusLoading, currentFocusId])

  return {
    loading: discussion && focusLoading,
    error: focusError
  }
}

export default useDiscussionFocusHelper
