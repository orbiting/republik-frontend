import { DiscussionObject } from '../graphql/DiscussionQuery.graphql'
import { useEffect, useState } from 'react'
import { focusSelector } from '../../../../lib/utils/scroll'

/**
 * Helper hook to highlight and navigate to the closest comment in the current discussion
 * @param discussion
 */
function useDiscussionFocusHelper(discussion?: DiscussionObject) {
  const [currentFocusId, setCurrentFocusId] = useState(null)
  const [focusLoading, setFocusLoading] = useState(true)
  // TODO: Implement detection of focus errors
  const [focusError] = useState(null)

  // TODO: Refactor - better readability
  /**
   * If the focused comment inside the discussion changes
   * update the internal state.
   */
  useEffect(() => {
    // While the discussion is loading, assume focus is also loading
    if (!discussion) {
      setFocusLoading(true)
      return
    }

    // If no focus is given or the last focus hasn't changed
    // stop loading
    if (
      !discussion?.comments?.focus ||
      currentFocusId === discussion.comments.focus.id
    ) {
      setFocusLoading(false)
      return
    }

    setCurrentFocusId(discussion.comments.focus.id)
    setFocusLoading(true)
  }, [discussion, currentFocusId])

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

    if (foundFocusableComment) {
      const selector = `[data-comment-id='${currentFocusId}']`

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

    // TODO: If the comment is not found and has parentIds,
    // fetch the replies for the closest parentId
  }, [discussion, currentFocusId, focusLoading])

  return {
    loading: discussion && focusLoading,
    error: focusError
  }
}

export default useDiscussionFocusHelper
