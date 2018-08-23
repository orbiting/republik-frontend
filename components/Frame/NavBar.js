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
  ':hover': {
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
  linkNavBarPage: css({
    ...linkStyle,
    color: colors.disabled,
    ':visited': {
      color: colors.disabled
    }
  })
}

const NavLink = ({ route, label, params = {}, active, closeHandler }) => {
  if (active && active.route === route) {
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
  const isNavBarPage =
    active &&
    ['index', 'feed', 'feuilleton', 'formats'].indexOf(active.route) !== -1

  return (
    <Link route={route} params={params}>
      <a {...(isNavBarPage ? styles.linkNavBarPage : styles.link)}>{label}</a>
    </Link>
  )
}

const NavBar = ({ url, t, fixed }) => {
  const active = matchPath(url.asPath)

  return (
    <Fragment>
      {fixed && <div {...styles.height} />}
      <div
        {...styles.container}
        {...(fixed ? styles.fixed : undefined)}
      >
        <div {...styles.height} {...styles.wrapper}>
          <NavLink
            route='index'
            label={t('navbar/front')}
            active={active}
          />
          {/*
          <NavLink
            route='feuilleton'
            label={t('navbar/feuilleton')}
            active={active}
          />
          */}
          <NavLink
            route='feed'
            label={t('navbar/feed')}
            active={active}
          />
          <NavLink
            route='formats'
            label={t('navbar/formats')}
            active={active}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default compose(withT)(NavBar)
