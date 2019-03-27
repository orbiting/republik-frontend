import React from 'react'
import routes from '../../lib/routes'
import Link from 'next/link'

const ShadowQueryLink = ({ path, query = {}, passHref, replace, scroll, children }) => {
  const result = routes.match(path)
  if (result.route) {
    return <Link
      href={result.route.getHref({ ...result.params, ...query })}
      as={result.route.getAs(result.params)}
      passHref={passHref}
      replace={replace}
      scroll={scroll}>
      {children}
    </Link>
  }

  // unrecognized links are handled by regular a tags
  return children
}

export default ShadowQueryLink
