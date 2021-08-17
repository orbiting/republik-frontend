import React from 'react'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'
import Link from 'next/link'

export const getDiscussionHref = discussion => {
  let tab
  if (discussion && discussion.document) {
    const meta = discussion.document.meta || {}
    const ownDiscussion = meta.ownDiscussion && !meta.ownDiscussion.closed
    const template = meta.template
    tab = ownDiscussion && template === 'article' && 'article'
  }
  tab =
    tab ||
    (discussion &&
      discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID &&
      'general')
  if (tab) {
    return {
      pathname: '/dialog',
      query: { t: tab, id: tab === 'general' ? undefined : discussion.id }
    }
  }
}

export const getDiscussionPath = discussion => {
  return discussion.document &&
    discussion.document.meta &&
    discussion.document.meta.path
    ? discussion.document.meta.path
    : discussion.path
}

const DiscussionLink = ({ children, discussion }) => {
  const href = getDiscussionHref(discussion)
  if (href) {
    return (
      <Link href={href} passHref>
        {children}
      </Link>
    )
  }
  if (discussion) {
    const path = getDiscussionPath(discussion)
    if (path) {
      return (
        <Link href={path} passHref>
          {children}
        </Link>
      )
    }
  }
  return children
}

export default DiscussionLink
