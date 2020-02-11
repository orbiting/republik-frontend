import React from 'react'

import { routes, Link, matchPath } from '../../lib/routes'

import {
  GENERAL_FEEDBACK_DISCUSSION_ID,
  PUBLIC_BASE_URL
} from '../../lib/constants'

export const getFocusRoute = (discussion, comment) => {
  const focusParams = comment
    ? discussion.isBoard
      ? comment.parentIds && comment.parentIds.length
        ? { parent: comment.parentIds[0], focus: comment.id }
        : { parent: comment.id }
      : { focus: comment.id }
    : {}
  if (discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID) {
    return {
      route: 'discussion',
      params: { t: 'general', ...focusParams }
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
      params: { t: 'article', id: discussion.id, ...focusParams }
    }
  } else if (discussion.path) {
    const result = matchPath(discussion.path)
    if (result) {
      return {
        route: result.route,
        params: { ...result.params, ...focusParams }
      }
    }
  }
}

export const getFocusUrl = (discussion, comment) => {
  const focusRoute = getFocusRoute(discussion, comment)
  if (focusRoute) {
    return `${PUBLIC_BASE_URL}${routes
      .find(r => r.name === focusRoute.route)
      .getAs(focusRoute.params)}`
  }
}

const CommentLink = ({ displayAuthor, comment, discussion, ...props }) => {
  if (displayAuthor) {
    /*
     * If the slug is not available, it means the profile is not accessible.
     */
    if (displayAuthor.slug) {
      return (
        <Link
          {...props}
          route='profile'
          params={{ slug: displayAuthor.slug }}
        />
      )
    }
  } else if (discussion) {
    const focusRoute = getFocusRoute(discussion, comment)
    if (focusRoute) {
      return (
        <Link {...props} route={focusRoute.route} params={focusRoute.params} />
      )
    }
  }

  return props.children
}

export default CommentLink
