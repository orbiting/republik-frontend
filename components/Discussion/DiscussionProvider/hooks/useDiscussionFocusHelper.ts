import { DiscussionObject } from '../graphql/DiscussionQuery.graphql'
import { useEffect, useState } from 'react'
import { focusSelector } from '../../../../lib/utils/scroll'

function useDiscussionFocusHelper(discussion?: DiscussionObject) {
  const [currentFocusId, setCurrentFocusId] = useState(null)
  const [focusLoading, setFocusLoading] = useState(false)
  const [focusError, setFocusError] = useState(null)

  useEffect(() => {
    if (!discussion || !discussion?.comments?.focus) {
      return
    }

    if (currentFocusId === discussion.comments.focus.id) {
      return
    }

    console.debug('New focus target', discussion.comments.focus.id)

    setCurrentFocusId(discussion.comments.focus.id)
    setFocusLoading(true)
  }, [discussion, currentFocusId])

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

    console.debug('looking for focused target')
    const foundFocusableComment = discussion.comments.nodes.find(
      comment => comment.id === currentFocusId
    )

    if (foundFocusableComment) {
      console.debug('found focused target')
      setFocusLoading(false)
      /*
       * Wrap 'focusSelector()' in a timeout to work around a bug. See
       * https://github.com/orbiting/republik-frontend/issues/243 for more
       * details
       */
      setTimeout(() => {
        console.debug(
          'navigating to focused target',
          `[data-comment-id='${currentFocusId}']`
        )
        focusSelector(`[data-comment-id='${currentFocusId}']`)
      }, 50)
    } else {
      // TODO: Run additional queries to fetch the focused comment
    }
  }, [discussion, currentFocusId, focusLoading])

  return {
    loading: discussion && focusLoading,
    error: focusError
  }
}

export default useDiscussionFocusHelper
