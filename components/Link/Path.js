import React from 'react'
import { matchPath, Link } from '../../lib/routes'
import AreaLink from './Area'

const Path = ({ path, query = {}, passHref, replace, scroll, children }) => {
  const result = matchPath(path)
  if (result) {
    const Component = passHref ? Link : AreaLink
    return (
      <Component
        route={result.route}
        params={{ ...query, ...result.params }}
        passHref={passHref}
        replace={replace}
        scroll={scroll}
      >
        {children}
      </Component>
    )
  }

  // unrecognized links are handled by regular a tags
  return children
}
export default Path
