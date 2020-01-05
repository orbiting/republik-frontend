import React from 'react'
import { compose } from 'react-apollo'

import { css } from 'glamor'
import { Link, Router } from '../../../lib/routes'

import { shouldIgnoreClick } from '../../Link/utils'

import { colors } from '@project-r/styleguide'

const styles = {
  link: css({
    textDecoration: 'none',
    color: colors.text,
    ':visited': {
      color: colors.text
    },
    '@media (hover)': {
      ':hover': {
        textDecoration: 'underline',
        textDecorationSkip: 'ink'
      }
    }
  }),
  inline: css({
    display: 'inline-block',
    '& + &': {
      marginLeft: 20
    }
  }),
  block: css({
    display: 'block'
  })
}

const NavLink = ({
  route,
  children,
  params = {},
  active,
  closeHandler,
  style,
  inline
}) => {
  if (active && active.route === route) {
    return (
      <a
        {...styles.link}
        {...(inline ? styles.inline : styles.block)}
        style={{
          cursor: 'pointer',
          ...style
        }}
        onClick={e => {
          if (shouldIgnoreClick(e)) {
            return
          }
          e.preventDefault()
          Router.replaceRoute(route, params).then(() => {
            window.scroll(0, 0)
            closeHandler()
          })
        }}
      >
        {children}
      </a>
    )
  }
  return (
    <Link route={route} params={params}>
      <a
        {...styles.link}
        {...(inline ? styles.inline : styles.block)}
        style={style}
      >
        {children}
      </a>
    </Link>
  )
}

export default NavLink
