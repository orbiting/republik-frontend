import React from 'react'
import { parse } from 'url'

import PathLink from './Path'

import { PUBLIC_BASE_URL } from '../../lib/constants'

const PUBLIC_HOSTNAME = parse(PUBLIC_BASE_URL).hostname

// ToDo:
// consider setting window.location for
// passHref false and external / unrecognized links
// for those links currently only the headline is clickable

const HrefLink = ({ href, passHref, children, query }) => {
  if (!href) {
    return children
  }

  const urlObject = parse(href, true)
  if (urlObject.hostname && urlObject.hostname !== PUBLIC_HOSTNAME) {
    // do nothing if url has a hostname and it's not ours
    return children
  }

  const path = urlObject.pathname

  return (
    <PathLink
      path={path}
      passHref={passHref}
      query={{ ...urlObject.query, ...query }}
    >
      {children}
    </PathLink>
  )
}

export default HrefLink
