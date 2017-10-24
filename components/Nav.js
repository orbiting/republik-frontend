import React from 'react'
import { linkRule } from '@project-r/styleguide'
import { intersperse } from '../lib/utils/helpers'
import { Link } from '../lib/routes'
import withT from '../lib/withT'

const menu = [
  {
    key: 'magazine',
    route: 'index'
  },
  {
    key: 'discussion',
    route: 'discussions'
  }
]

const Nav = ({ url, route, t }) => {
  return (
    <span>
      {intersperse(
        menu.map(item => {
          const label = t(`frontnav/${item.key}`)
          if (item.route === route) {
            return <span key={item.route}>{label} </span>
          }
          return (
            <Link key={item.route} route={item.route}>
              <a {...linkRule}>{label} </a>
            </Link>
          )
        }),
        (_, i) => <span key={i}>&nbsp;</span>
      )}
    </span>
  )
}

export default withT(Nav)
