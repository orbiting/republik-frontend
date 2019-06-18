import React, { Fragment } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import { Link, Router, matchPath } from '../../lib/routes'

import { colors, mediaQueries } from '@project-r/styleguide'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT,
  NAVBAR_HEIGHT_MOBILE,
  ZINDEX_NAVBAR
} from '../constants'
import { negativeColors } from './constants'

const LINKS = [
  {
    key: 'front',
    route: 'index',
    params: {}
  },
  {
    key: 'feuilleton',
    route: 'feuilleton',
    params: {}
  },
  {
    key: 'feed',
    route: 'feed',
    params: {}
  },
  {
    key: 'discussion',
    route: 'discussion',
    params: {}
  }
]

const isActiveRoute = (active, route, params = {}) => (
  !!active && active.route === route && Object.keys(params).every(
    key => active.params[key] === params[key]
  )
)

export const getNavBarStateFromRouter = router => {
  const active = matchPath(router.asPath)

  const links = LINKS.map(({ key, route, params }) => ({
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

const styles = {
  container: css({
    '@media print': {
      display: 'none'
    },
    alignItems: 'center',
    left: 0,
    right: 0,
    zIndex: ZINDEX_NAVBAR,
    position: 'relative'
  }),
  light: css({
    backgroundColor: '#fff'
  }),
  dark: css({
    backgroundColor: negativeColors.primaryBg
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
    fontSize: 15,
    lineHeight: '18px',
    textDecoration: 'none',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    [mediaQueries.mUp]: {
      fontSize: 18,
      lineHeight: '22px',
      minWidth: '25%',
      textAlign: 'center'
    }
  }),
  linkLight: css({
    color: colors.text,
    ':visited': {
      color: colors.text
    },
    '@media (hover)': {
      ':hover': {
        color: colors.primary
      }
    }
  }),
  linkDark: css({
    color: negativeColors.text,
    ':visited': {
      color: negativeColors.text
    },
    '@media (hover)': {
      ':hover': {
        color: negativeColors.lightText
      }
    }
  }),
  linkFadedLight: css({
    color: colors.disabled,
    ':visited': {
      color: colors.disabled
    },
    '@media (hover)': {
      ':hover': {
        color: colors.primary
      }
    }
  }),
  linkFadedDark: css({
    color: colors.disabled,
    ':visited': {
      color: colors.disabled
    },
    '@media (hover)': {
      ':hover': {
        color: colors.lightText
      }
    }
  })
}

const NavLink = ({ route, label, params, isActive, isFaded, dark }) => {
  if (isActive) {
    return (
      <a
        {...styles.link}
        {...dark ? styles.linkDark : styles.linkLight}
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
      <a
        {...styles.link}
        {...isFaded
          ? dark ? styles.linkFadedDark : styles.linkFadedLight
          : dark ? styles.linkDark : styles.linkLight}>
        {label}
      </a>
    </Link>
  )
}

const NavBar = ({ router, t, fixed, dark }) => {
  const { links, hasActiveLink } = getNavBarStateFromRouter(router)

  return (
    <Fragment>
      {fixed && <div {...styles.height} />}
      <div
        {...styles.container}
        {...(dark ? styles.dark : styles.light)}
        {...(fixed ? styles.fixed : undefined)}
      >
        <div {...styles.height} {...styles.wrapper}>
          {links.map((props) => (
            <NavLink {...props}
              dark={dark}
              label={t(`navbar/${props.key}`)}
              isFaded={hasActiveLink} />
          ))}
        </div>
      </div>
    </Fragment>
  )
}

export default compose(withT)(NavBar)
