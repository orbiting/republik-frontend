import React from 'react'

import {
  GENERAL_FEEDBACK_DISCUSSION_ID,
  PUBLIC_BASE_URL
} from '../../lib/constants'
import Link from 'next/link'

export const getFocusHref = (discussion, comment) => {
  const focusParams = comment
    ? discussion.isBoard
      ? comment.parentIds && comment.parentIds.length
        ? { parent: comment.parentIds[0], focus: comment.id }
        : { parent: comment.id }
      : { focus: comment.id }
    : {}
  if (discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID) {
    return {
      pathname: '/dialog',
      query: { t: 'general', ...focusParams }
    }
  } else if (
    discussion.document &&
    discussion.document.meta &&
    discussion.document.meta.template === 'article' &&
    discussion.document.meta.ownDiscussion &&
    discussion.document.meta.ownDiscussion.id === discussion.id
  ) {
    return {
      pathname: '/dialog',
      query: { t: 'article', id: discussion.id, ...focusParams }
    }
  } else if (discussion.path) {
    return {
      pathname: discussion.path,
      query: focusParams
    }
  }
}

export const getFocusUrl = (discussion, comment) => {
  const focusHref = getFocusHref(discussion, comment)
  // TODO
  // pathname: discussion.path,
  // query: focusParams
  //if (focusHref) {
  //  return `${PUBLIC_BASE_URL}${routes
  //    .find(r => r.name === focusRoute.route)
  //    .getAs(focusRoute.params)}`
  //}
  return 'test'
}

const CommentLink = ({ displayAuthor, comment, discussion, ...props }) => {
  if (displayAuthor) {
    /*
     * If the slug is not available, it means the profile is not accessible.
     */
    if (displayAuthor.slug) {
      return <Link {...props} href={`/~${displayAuthor.slug}`} />
    }
  } else if (discussion) {
    const focusRoute = getFocusHref(discussion, comment)
    if (focusRoute) {
      return <Link {...props} href={getFocusHref(discussion, comment)} />
    }
  }

  return props.children
}

export default CommentLink
