import React from 'react'

import { routes, Link, matchPath } from '../../lib/routes'

import { GENERAL_FEEDBACK_DISCUSSION_ID, PUBLIC_BASE_URL } from '../../lib/constants'

const getFocusRoute = (discussion, commentId) => {
  if (discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID) {
    return {
      route: 'discussion',
      params: { t: 'general', focus: commentId }
    }
  } else if (
    discussion.document &&
    discussion.document.meta &&
    discussion.document.meta.template === 'article' &&
    discussion.document.meta.ownDiscussion &&
    discussion.document.meta.ownDiscussion.id === discussion.id
  ) {
    return {
      route: 'discussion',
      params: { t: 'article', id: discussion.id, focus: commentId }
    }
  } else if (discussion.path) {
    const result = matchPath(discussion.path)
    if (result) {
      return {
        route: result.route,
        params: { ...result.params, focus: commentId }
      }
    }
  }
}

export const getFocusUrl = (discussion, commentId) => {
  const focusRoute = getFocusRoute(discussion, commentId)
  if (focusRoute) {
    return `${PUBLIC_BASE_URL}${
      routes
        .find(r => r.name === focusRoute.route)
        .getAs(focusRoute.params)
    }`
  }
}

const CommentLink = ({
  displayAuthor,
  commentId,
  discussion,
  ...props
}) => {
  if (displayAuthor) {
    /*
     * If the slug is not available, it means the profile is not accessible.
     */
    if (displayAuthor.slug) {
      return (
        <Link {...props}
          route='profile'
          params={{ slug: displayAuthor.slug }} />
      )
    }
  } else if (discussion) {
    const focusRoute = getFocusRoute(discussion, commentId)
    if (focusRoute) {
      return <Link {...props} route={focusRoute.route} params={focusRoute.params} />
    }
  }

  return props.children
}

export default CommentLink
