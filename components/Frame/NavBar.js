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

const slideAnimationDurationMs = 200

const slideAnimation = (borderHeight, headerHeight, navbarHeight) => {
  const kfrms = css.keyframes({
    '0%': {opacity: 1, top: headerHeight - navbarHeight + borderHeight},
    '100%': {opacity: 1, top: headerHeight}
  })
  return `${kfrms} ${slideAnimationDurationMs}ms ease-out forwards`
}

const slideOutAnimation = (borderHeight, headerHeight, navbarHeight) => {
  const kfrms = css.keyframes({
    '0%': {opacity: 1, top: headerHeight},
    '100%': {opacity: 1, top: headerHeight - navbarHeight + borderHeight}
  })
  return `${kfrms} ${slideAnimationDurationMs}ms ease-in forwards`
}

const getAnimationStyles = (isFormat, isMobile) => {
  const headerHeight = isMobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT
  const navbarHeight = isMobile ? NAVBAR_HEIGHT_MOBILE : NAVBAR_HEIGHT
  const borderHeight = isFormat ? 3 : 0

  return {
    expand: css({
      animation: slideAnimation(borderHeight, headerHeight, navbarHeight)
    }),
    collapse: css({
      animation: slideOutAnimation(borderHeight, headerHeight, navbarHeight)
    })
  }
}

const animation = getAnimationStyles(false, false)
const animationMobile = getAnimationStyles(false, true)
const animationFormat = getAnimationStyles(true, false)
const animationFormatMobile = getAnimationStyles(true, true)

const linkStyle = {
  fontSize: 16,
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
    fontSize: 19,
    minWidth: '25%',
    textAlign: 'center'
  }
}

const styles = {
  container: css({
    position: 'fixed',
    animationFillMode: 'forwards',
    borderBottom: `1px solid ${colors.divider}`,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    height: NAVBAR_HEIGHT_MOBILE,
    left: 0,
    right: 0,
    padding: '0 15px',
    zIndex: ZINDEX_NAVBAR,
    [mediaQueries.mUp]: {
      height: NAVBAR_HEIGHT,
      padding: '0 25px'
    }
  }),
  wrapper: css({
    margin: '0 auto 0',
    display: 'flex',
    flex: 1,
    justifyContent: 'space-around',
    maxWidth: '100%'
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
  }),
  initial: css({
    top: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT
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
    const { url, t, formatColor, sticky, initial, mobile } = this.props
    const active = matchPath(url.asPath)
    const animationStyles = formatColor
      ? (mobile ? animationFormatMobile : animationFormat)
      : (mobile ? animationMobile : animation)

    return (
      <div
        {...styles.container}
        {...(initial ? styles.initial : sticky ? animationStyles.expand : animationStyles.collapse)}
        style={{
          borderBottom: formatColor ? `3px solid ${formatColor}` : `1px solid ${colors.divider}`
        }}
      >
        <div {...styles.wrapper}>
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
