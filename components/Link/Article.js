import React from 'react'
import { Link } from '../../lib/routes'

const getArticleParams = path => {
  const [year, month, day, slug] = path.split('/').filter(Boolean)
  return {
    year,
    month,
    day,
    slug
  }
}

export default ({ slug, path, children, passHref }) => {
  const params = getArticleParams(path || slug)
  // safety check for now
  if (!params.slug) {
    return children
  }
  return (
    <Link route='article' params={params} passHref={passHref}>
      {children}
    </Link>
  )
}
