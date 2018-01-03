import React from 'react'
import { Link } from '../../lib/routes'
import { parse } from 'url'

import { PUBLIC_BASE_URL } from '../../lib/constants'
import ArticleLink from './Article'

const PUBLIC_HOSTNAME = parse(PUBLIC_BASE_URL).hostname

// ToDo:
// consider setting window.location for
// passHref false and external / unrecognized links
// for those links currently only the headline is clickable

export default ({ href, passHref, children }) => {
  if (!href) {
    return children
  }
  const urlObject = parse(href)
  if (urlObject.hostname && urlObject.hostname !== PUBLIC_HOSTNAME) {
    // do nothing if url has a hostname and it's not ours
    return children
  }
  // path or url is ours
  const isProfile = urlObject.pathname.match(/^\/~([^/]+)/)
  if (isProfile) {
    return <Link route='profile' params={{slug: isProfile[1]}} passHref={passHref}>
      {children}
    </Link>
  }
  const isArticle = urlObject.pathname.match(/^\/\d{4}\/\d{2}\/\d{2}\/[^/]+/)
  if (isArticle) {
    return <ArticleLink path={urlObject.pathname} passHref={passHref}>
      {children}
    </ArticleLink>
  }

  // unrecognized links are handled by regular a tags
  return children
}
