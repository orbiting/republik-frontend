import React, { Component } from 'react'
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
  fontSize: 16,
  textDecoration: 'none',
  color: colors.text,
  ':visited': {
    color: colors.text
  },
  ':hover': {
    color: colors.primary
  },
  cursor: 'pointer',
  [mediaQueries.mUp]: {
    fontSize: 26
  }
}

const styles = {
  container: css({
    transition: 'opacity .2s ease-in-out',
    borderBottom: `1px solid ${colors.divider}`,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    height: NAVBAR_HEIGHT_MOBILE,
    left: 0,
    right: 0,
    top: HEADER_HEIGHT_MOBILE,
    padding: '0 15px',
    zIndex: ZINDEX_NAVBAR,
    [mediaQueries.mUp]: {
      height: NAVBAR_HEIGHT,
      padding: '0 25px',
      top: HEADER_HEIGHT
    },
    '& > div': {
      margin: '0 auto 0',
      // maxWidth: '665px',
      display: 'flex',
      flex: 1,
      justifyContent: 'space-around',
      [mediaQueries.mUp]: {
        // maxWidth: '685px'
      }
    },
    '& > div > div': {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
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

const NavLink = ({ route, translation, params = {}, active, closeHandler }) => {
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
        {translation}
      </a>
    )
  }
  const isNavBarPage =
    active &&
    ['index', 'feed', 'feuilleton', 'formats'].indexOf(active.route) !== -1

  return (
    <Link route={route} params={params}>
      <a {...(isNavBarPage ? styles.linkNavBarPage : styles.link)}>{translation}</a>
    </Link>
  )
}

class NavBar extends Component {
  render () {
    const { url, t, formatColor, sticky, opaque } = this.props
    const active = matchPath(url.asPath)

    return (
      <div
        {...styles.container}
        style={{
          position: sticky ? 'fixed' : 'absolute',
          opacity: sticky || opaque ? 1 : 0,
          borderBottom: formatColor ? `3px solid ${formatColor}` : `1px solid ${colors.divider}`
        }}
      >
        <div>
          <NavLink
            route='index'
            translation={t('navbar/front')}
            active={active}
          />
          <NavLink
            route='feed'
            translation={t('navbar/feed')}
            active={active}
          />
          <NavLink
            route='feuilleton'
            translation={t('navbar/feuilleton')}
            active={active}
          />
          <NavLink
            route='formats'
            translation={t('navbar/formats')}
            active={active}
          />
        </div>
      </div>
    )
  }
}

export default compose(withT)(NavBar)
