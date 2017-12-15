import React from 'react'
import { Link } from '../../lib/routes'

const getArticleParams = path => {
  const [year, month, day, slug] = path.split('/')
  return {
    year,
    month,
    day,
    slug
  }
}

export default ({ slug, children, passHref }) => {
  const params = getArticleParams(slug)
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
