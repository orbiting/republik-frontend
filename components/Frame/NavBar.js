import React, { Fragment } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import { Link, Router, matchPath } from '../../lib/routes'

import { prefixHover } from '../../lib/utils/hover'

import { colors, mediaQueries } from '@project-r/styleguide'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT,
  NAVBAR_HEIGHT_MOBILE,
  ZINDEX_NAVBAR
} from '../constants'

const LINKS = [
  {
    key: 'front',
    route: 'index',
    params: {}
  },
  {
    key: 'feuilleton',
    route: 'front',
    params: {slug: 'feuilleton'}
  },
  {
    key: 'feed',
    route: 'feed',
    params: {}
  },
  {
    key: 'formats',
    route: 'formats',
    params: {}
  }
]

const isActiveRoute = (active, route, params = {}) => (
  !!active && active.route === route && Object.keys(params).every(
    key => active.params[key] === params[key]
  )
)

export const getNavBarStateFromUrl = url => {
  const active = matchPath(url.asPath)

  const links = LINKS.map(({key, route, params}) => ({
    key,
    route,
    params,
    isActive: isActiveRoute(active, route, params)
  }))
  const hasActiveLink = !!links.find(link => link.isActive)

  return {
    hasActiveLink,
    links
  }
}

const linkStyle = {
  fontSize: 15,
  lineHeight: '18px',
  textDecoration: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: colors.text,
  ':visited': {
    color: colors.text
  },
  [prefixHover()]: {
    color: colors.primary
  },
  cursor: 'pointer',
  [mediaQueries.mUp]: {
    fontSize: 18,
    lineHeight: '22px',
    minWidth: '25%',
    textAlign: 'center'
  }
}

const styles = {
  container: css({
    background: '#fff',
    alignItems: 'center',
    left: 0,
    right: 0,
    zIndex: ZINDEX_NAVBAR
  }),
  fixed: css({
    position: 'fixed',
    top: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT
    }
  }),
  height: css({
    height: NAVBAR_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      height: NAVBAR_HEIGHT
    }
  }),
  wrapper: css({
    margin: '0 auto 0',
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    justifyContent: 'space-around',
    maxWidth: '100%',
    padding: '0 15px',
    [mediaQueries.mUp]: {
      padding: '0 25px'
    }
  }),
  link: css({
    ...linkStyle
  }),
  linkFaded: css({
    ...linkStyle,
    color: colors.disabled,
    ':visited': {
      color: colors.disabled
    }
  })
}

const NavLink = ({ route, label, params, isActive, isFaded }) => {
  if (isActive) {
    return (
      <a
        {...styles.link}
        style={{ cursor: 'pointer' }}
        onClick={e => {
          e.preventDefault()
          Router.replaceRoute(route, params).then(() => {
            window.scroll(0, 0)
          })
        }}
      >
        {label}
      </a>
    )
  }

  return (
    <Link route={route} params={params}>
      <a {...(isFaded ? styles.linkFaded : styles.link)}>{label}</a>
    </Link>
  )
}

const NavBar = ({ url, t, fixed }) => {
  const { links, hasActiveLink } = getNavBarStateFromUrl(url)

  return (
    <Fragment>
      {fixed && <div {...styles.height} />}
      <div
        {...styles.container}
        {...(fixed ? styles.fixed : undefined)}
      >
        <div {...styles.height} {...styles.wrapper}>
          {links.map((props) => (
            <NavLink {...props}
              label={t(`navbar/${props.key}`)}
              isFaded={hasActiveLink} />
          ))}
        </div>
      </div>
    </Fragment>
  )
}

export default compose(withT)(NavBar)
