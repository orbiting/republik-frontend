import React from 'react'
import { Link } from '../../lib/routes'

const getLinkProps = path => {
  const segments = path.split('/').filter(Boolean)
  // format & dossier
  if (segments.length === 2) {
    const [route, slug] = segments
    return {
      route,
      params: {
        slug
      }
    }
  }

  const [year, month, day, slug, suffix] = segments
  return {
    route: 'article',
    params: {
      year,
      month,
      day,
      slug,
      suffix
    }
  }
}

export default ({ path, children, passHref }) => {
  const props = getLinkProps(path)
  // safety check
  if (!props.params.slug) {
    return children
  }
  return (
    <Link route={props.route} params={props.params} passHref={passHref}>
      {children}
    </Link>
  )
}
