import React from 'react'
import routes, { Link } from '../../lib/routes'

export default ({ path, passHref, children }) => {
  const result = routes.match(path)
  if (result.route && result.route.name && result.params) {
    return <Link route={result.route.name} params={result.params} passHref={passHref}>
      {children}
    </Link>
  }

  // unrecognized links are handled by regular a tags
  return children
}
