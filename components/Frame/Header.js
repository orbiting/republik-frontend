import React, { Component, Fragment } from 'react'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import { Router } from '../../lib/routes'

import { AudioPlayer, Logo, colors, mediaQueries } from '@project-r/styleguide'

import withMembership from '../Auth/withMembership'

import Toggle from './Toggle'
import User from './User'
import Popover from './Popover'
import NavBar from './NavBar'
import NavPopover from './Popover/Nav'
import LoadingBar from './LoadingBar'

import Search from 'react-icons/lib/md/search'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT,
  NAVBAR_HEIGHT_MOBILE,
  ZINDEX_HEADER
} from '../constants'

const LOGO_HEIGHT = 28.02
const LOGO_WIDTH = LOGO_HEIGHT * Logo.ratio

const LOGO_HEIGHT_MOBILE = 22.78
const LOGO_WIDTH_MOBILE = LOGO_HEIGHT_MOBILE * Logo.ratio

const SEARCH_BUTTON_WIDTH = 28

const styles = {
  bar: css({
    zIndex: ZINDEX_HEADER,
    position: 'fixed',
    '@media print': {
      position: 'absolute'
    },
    top: 0,
    left: 0,
    right: 0
  }),
  barOpaque: css({
    backgroundColor: '#fff',
    height: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT
    },
    '@media print': {
      backgroundColor: 'transparent'
    }
  }),
  center: css({
    margin: '0 auto 0',
    padding: '0 60px',
    textAlign: 'center',
    transition: 'opacity .2s ease-in-out'
  }),
  logo: css({
    display: 'inline-block',
    marginTop: `${Math.floor((HEADER_HEIGHT_MOBILE - LOGO_HEIGHT_MOBILE - 1) / 2)}px`,
    width: `${LOGO_WIDTH_MOBILE}px`,
    [mediaQueries.mUp]: {
      marginTop: `${Math.floor((HEADER_HEIGHT - LOGO_HEIGHT - 1) / 2)}px`,
      width: `${LOGO_WIDTH}px`
    },
    verticalAlign: 'middle'
  }),
  user: css({
    '@media print': {
      display: 'none'
    },
    transition: 'opacity .2s ease-in-out'
  }),
  hamburger: css({
    '@media print': {
      display: 'none'
    },
    background: '#fff',
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    right: 0,
    display: 'inline-block',
    height: HEADER_HEIGHT_MOBILE - 2,
    width: HEADER_HEIGHT_MOBILE - 2 + 5,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT - 2,
      width: HEADER_HEIGHT - 2 + 5
    }
  }),
  search: css({
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    '@media print': {
      display: 'none'
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    right: HEADER_HEIGHT_MOBILE - 1,
    height: HEADER_HEIGHT_MOBILE - 2,
    width: SEARCH_BUTTON_WIDTH,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT - 2,
      width: HEADER_HEIGHT - 2 - 10,
      right: HEADER_HEIGHT - 2 + 5
    }
  }),
  secondary: css({
    position: 'absolute',
    top: 0,
    left: 15,
    display: 'inline-block',
    height: HEADER_HEIGHT_MOBILE,
    right: `${HEADER_HEIGHT_MOBILE + SEARCH_BUTTON_WIDTH}px`,
    paddingTop: '10px',
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT,
      right: `${HEADER_HEIGHT + HEADER_HEIGHT}px`,
      paddingTop: '18px'
    },
    transition: 'opacity .2s ease-in-out'
  }),
  sticky: css({
    position: 'sticky'
  }),
  stickyWithFallback: css({
    position: ['fixed', 'sticky']
  }),
  hr: css({
    margin: 0,
    display: 'block',
    border: 0,
    color: colors.divider,
    backgroundColor: colors.divider,
    width: '100%',
    zIndex: ZINDEX_HEADER
  }),
  hrThin: css({
    height: 1,
    top: HEADER_HEIGHT_MOBILE - 1,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT - 1
    }
  }),
  hrThick: css({
    height: 3,
    top: HEADER_HEIGHT_MOBILE - 3,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT - 3
    }
  }),
  hrFixedAfterNavBar: css({
    position: 'fixed',
    marginTop: NAVBAR_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      marginTop: NAVBAR_HEIGHT
    }
  })
}

const isPositionStickySupported = () => {
  const style = document.createElement('a').style
  style.cssText = 'position:sticky;position:-webkit-sticky;'
  return style.position.indexOf('sticky') !== -1
}

// Workaround for WKWebView fixed 0 rendering hickup
// - iOS 11.4
const forceRefRedraw = ref => {
  if (ref) {
    setTimeout(() => {
      const display = ref.style.display
      ref.style.display = 'none'
      /* eslint-disable-next-line no-unused-expressions */
      ref.offsetHeight
      ref.style.display = display
    }, 300)
  }
}

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      opaque: !this.props.cover,
      mobile: false,
      expanded: false
    }

    this.onScroll = () => {
      const y = window.pageYOffset

      const yOpaque = this.state.mobile ? 70 : 150
      const opaque = y > yOpaque || !this.props.cover
      if (opaque !== this.state.opaque) {
        this.setState(() => ({ opaque }))
      }
    }

    this.measure = () => {
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      if (mobile !== this.state.mobile) {
        this.setState(() => ({ mobile }))
      }
      this.onScroll()
    }

    this.onMessage = e => {
      const message = JSON.parse(e.data)
      switch (message.type) {
        case 'open-menu':
          return this.setState({ expanded: true })
        case 'close-menu':
          return this.setState({ expanded: false })
      }
    }

    this.close = () => {
      this.setState({ expanded: false })
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    document.addEventListener('message', this.onMessage)
    this.measure()

    const withoutSticky = !isPositionStickySupported()
    if (withoutSticky) {
      this.setState({ withoutSticky })
    }
  }

  componentDidUpdate () {
    this.measure()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
    document.removeEventListener('message', this.onMessage)
  }

  render () {
    const {
      url,
      t,
      me,
      cover,
      secondaryNav,
      showSecondary,
      onPrimaryNavExpandedChange,
      primaryNavExpanded,
      formatColor,
      audioSource,
      audioCloseHandler,
      inNativeApp,
      inNativeIOSApp,
      isMember
    } = this.props
    const { expanded, withoutSticky } = this.state

    // If onPrimaryNavExpandedChange is defined, expanded state management is delegated
    // up to the higher-order component. Otherwise it's managed inside the component.
    const expand = onPrimaryNavExpandedChange ? primaryNavExpanded : expanded
    const secondaryVisible = showSecondary && !expand

    const opaque = this.state.opaque || expanded
    const barStyle = opaque ? merge(styles.bar, styles.barOpaque) : styles.bar

    const isSearchActive = url.pathname === '/search'

    return (
      <Fragment>
        <div {...barStyle} ref={inNativeIOSApp ? forceRefRedraw : undefined}>
          {secondaryNav && !audioSource && (
            <div {...styles.secondary} style={{
              opacity: secondaryVisible ? 1 : 0,
              zIndex: secondaryVisible ? 99 : undefined
            }}>
              {secondaryNav}
            </div>
          )}
          {opaque && <Fragment>
            <div {...styles.user} style={{opacity: secondaryVisible ? 0 : 1}}>
              <User
                me={me}
                title={expand ? t('header/nav/close/aria') : t('header/nav/open/aria')}
                onclickHandler={() => {
                  if (onPrimaryNavExpandedChange) {
                    onPrimaryNavExpandedChange(!expand)
                  } else {
                    this.setState({ expanded: !expand })
                  }
                }}
              />
            </div>
            <div {...styles.center} style={{opacity: secondaryVisible ? 0 : 1}}>
              <a
                {...styles.logo}
                aria-label={t('header/logo/magazine/aria')}
                href={'/'}
                onClick={e => {
                  if (
                    e.currentTarget.nodeName === 'A' &&
                    (e.metaKey ||
                      e.ctrlKey ||
                      e.shiftKey ||
                      (e.nativeEvent && e.nativeEvent.which === 2))
                  ) {
                    // ignore click for new tab / new window behavior
                    return
                  }
                  e.preventDefault()
                  if (url.pathname === '/') {
                    window.scrollTo(0, 0)
                  } else {
                    Router.pushRoute('index').then(() => window.scrollTo(0, 0))
                  }
                }}
              >
                <Logo />
              </a>
            </div>
            <button
              {...styles.search}
              role='button'
              title={t('header/nav/search/aria')}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (isSearchActive) {
                  window.scrollTo(0, 0)
                } else {
                  Router.pushRoute('search').then(() => window.scrollTo(0, 0))
                }
              }}>
              <Search
                fill={isSearchActive ? colors.primary : colors.text}
                size={28} />
            </button>
            <div {...styles.hamburger}>
              <Toggle
                expanded={!!expand}
                id='primary-menu'
                title={expand ? t('header/nav/close/aria') : t('header/nav/open/aria')}
                onClick={() => {
                  if (onPrimaryNavExpandedChange) {
                    onPrimaryNavExpandedChange(!expand)
                  } else {
                    this.setState({ expanded: !expand })
                  }
                }}
              />
            </div>
          </Fragment>}
          {!inNativeApp && audioSource && (
            <AudioPlayer
              src={audioSource}
              closeHandler={() => { audioCloseHandler && audioCloseHandler() }}
              autoPlay
              download
              scrubberPosition='bottom'
              timePosition='left'
              t={t}
              style={{backgroundColor: '#fff', position: 'absolute', width: '100%', bottom: 0}}
              controlsPadding={this.state.mobile ? 10 : 20}
              height={this.state.mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT}
            />
          )}
        </div>
        {isMember && opaque && (
          <Fragment>
            <hr
              {...styles.stickyWithFallback}
              {...styles.hr}
              {...styles.hrThin} />
            <NavBar fixed={withoutSticky} url={url} />
          </Fragment>
        )}
        {opaque && <hr
          {...styles[isMember ? 'sticky' : 'stickyWithFallback']}
          {...((isMember && withoutSticky && styles.hrFixedAfterNavBar) || undefined)}
          {...styles.hr}
          {...styles[formatColor ? 'hrThick' : 'hrThin']}
          style={formatColor ? {
            color: formatColor,
            backgroundColor: formatColor
          } : undefined} />}
        <Popover expanded={!!expand}>
          <NavPopover
            me={me}
            url={url}
            closeHandler={this.close}
          />
        </Popover>
        <LoadingBar />
        {!!cover && <div {...styles.cover}>{cover}</div>}
      </Fragment>
    )
  }
}

export default compose(
  withT,
  withMembership,
  withInNativeApp
)(Header)
