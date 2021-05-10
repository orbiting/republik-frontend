import React from 'react'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'
import Link from 'next/link'

const DiscussionLink = ({ children, discussion }) => {
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
    return (
      <Link
        href={{
          pathname: '/dialog',
          query: { t: tab, id: tab === 'general' ? undefined : discussion.id }
        }}
        passHref
      >
        {children}
      </Link>
    )
  }
  if (discussion) {
    const path =
      discussion.document &&
      discussion.document.meta &&
      discussion.document.meta.path
        ? discussion.document.meta.path
        : discussion.path
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
