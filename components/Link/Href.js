import React from 'react'
import { format, parse } from 'url'
import AreaLink from './Area'
import Link from 'next/link'

const HrefLink = ({ href, passHref, children, query }) => {
  if (!href) {
    return children
  }

  const urlObject = parse(href, true)
  const hrefWithQuery = format({
    ...urlObject,
    search: undefined, // remove search to allow query overwrite
    query: { ...urlObject.query, ...query }
  })
  const Component = passHref ? Link : AreaLink

  return (
    <Component href={hrefWithQuery} passHref={passHref}>
      {children}
    </Component>
  )
}
export default HrefLink
