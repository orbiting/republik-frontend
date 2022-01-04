import { DiscussionObject } from '../graphql/DiscussionQuery.graphql'
import { useEffect, useState } from 'react'
import { focusSelector } from '../../../../lib/utils/scroll'
import { useTranslation } from '../../../../lib/withT'

/**
 * Helper hook to highlight and navigate to the closest comment in the current discussion
 * @param focusId
 * @param discussion
 */
function useDiscussionFocusHelper(
  focusId: string | null,
  discussion?: DiscussionObject
) {
  const { t } = useTranslation()

  const [currentFocusId, setCurrentFocusId] = useState(null)
  const [focusLoading, setFocusLoading] = useState(true)
  // TODO: Implement detection of focus errors
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
      setFocusLoading(false)
    }, 50)
  }

  // TODO: Refactor - better readability
  /**
   * If the focused comment inside the discussion changes
   * update the internal state.
   */
  useEffect(() => {
    if (!focusId) {
      setFocusLoading(false)
      return
    }

    // While the discussion is loading, assume focus is also loading
    if (!discussion) {
      setFocusLoading(true)
      return
    }

    // If no focus is given or the last focus hasn't changed
    // stop loading
    if (currentFocusId === discussion?.comments?.focus?.id) {
      setFocusLoading(false)
      return
    }

    // If the url focusId could not find an according focus, set an error
    if (focusId === discussion?.comments?.focus?.id) {
      return
    } else if (focusId !== discussion?.comments?.focus?.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFocusError(new Error(t('discussion/focus/notFound')))
      const discussionSelector = `[data-discussion-id='${discussion.id}']`
      navigateToSelector(discussionSelector)
      setFocusLoading(false)
    } else {
      setCurrentFocusId(discussion.comments.focus.id)
      setFocusLoading(true)
    }
  }, [focusId, discussion, currentFocusId])

  /**
   * Search for the focused comment inside the comments of the discussion
   * In case a reply is focused, query for the missing data.
   */
  useEffect(() => {
    if (
      !discussion ||
      !discussion?.comments ||
      !currentFocusId ||
      !focusLoading
    ) {
      // End
      return
    }

    // Check if the focused comment is present inside fetched discussion-data
    const foundFocusableComment = discussion.comments.nodes.find(
      comment => comment.id === currentFocusId
    )

    let selector
    if (foundFocusableComment) {
      selector = `[data-comment-id='${currentFocusId}']`
      navigateToSelector(selector)
    } else {
      // TODO: if the comment has parentIds fetch replies for the next
      // closest parent until the focus is loaded
    }

    // TODO: If the comment is not found and has parentIds,
    // fetch the replies for the closest parentId
  }, [discussion, currentFocusId, focusLoading])

  return {
    loading: discussion && focusLoading,
    error: focusError
  }
}

export default useDiscussionFocusHelper
