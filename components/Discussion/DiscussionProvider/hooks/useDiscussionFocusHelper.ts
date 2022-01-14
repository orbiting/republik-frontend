import { useEffect, useState } from 'react'
import { focusSelector } from '../../../../lib/utils/scroll'
import { useTranslation } from '../../../../lib/withT'
import { useDiscussion } from '../context/DiscussionContext'
import { errorToString } from '../../../../lib/utils/errors'

export type DiscussionFocusHelperType = {
  loading: boolean
  error: Error | null
}

/**
 * Helper hook to highlight and navigate to the closest comment in the current discussion
 */
function useDiscussionFocusHelper(): DiscussionFocusHelperType {
  const [currentFocusId, setCurrentFocusId] = useState<string | null>(null)
  const [focusLoading, setFocusLoading] = useState(false)
  const [focusError, setFocusError] = useState(null)

  const { t } = useTranslation()
  const { loading: discussionLoading, discussion, fetchMore } = useDiscussion()
  const focusId = discussion?.comments?.focus?.id

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
    } else if (discussion.comments?.focus?.parentIds?.length > 0) {
      const parentIds = Array.from(discussion.comments.focus.parentIds)
      const reversedParentIDs = parentIds.reverse()
      // Fetch the closest parentId that has been loaded
      const closestLoadedParentId = reversedParentIDs.find(parentID =>
        discussion.comments.nodes.find(comment => comment.id === parentID)
      )

      if (!closestLoadedParentId) {
        alert('NO PARENT LOADED')
        return
      }

      const distanceToParent =
        reversedParentIDs.indexOf(closestLoadedParentId) + 1

      console.debug('Fetching parent', {
        distanceToParent,
        closestLoadedParent: closestLoadedParentId,
        reversedParentIDs
      })

      fetchMore({
        discussionId: discussion.id,
        parentId: closestLoadedParentId,
        after: discussion.comments.pageInfo.endCursor,
        depth: distanceToParent
      })
        .catch(errorToString)
        .catch(setFocusError)
    }
    console.debug('no focus?')
  }, [discussion, discussionLoading, focusLoading, currentFocusId])

  return {
    loading: discussion && focusLoading,
    error: focusError
  }
}

export default useDiscussionFocusHelper
