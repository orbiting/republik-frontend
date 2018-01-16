import React from 'react'
import { matchPath, Link } from '../../lib/routes'

export default ({ path, query = {}, passHref, replace, scroll, children }) => {
  const result = matchPath(path)
  if (result) {
    return <Link route={result.route} params={{...query, ...result.params}} passHref={passHref} replace={replace} scroll={scroll}>
      {children}
    </Link>
  }

  // unrecognized links are handled by regular a tags
  return children
}
