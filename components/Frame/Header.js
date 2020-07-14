import React, { Component, Fragment } from 'react'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import withT from '../../lib/withT'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { Router, matchPath } from '../../lib/routes'

import {
  Logo,
  colors,
  mediaQueries,
  ColorContext,
  HeaderHeightProvider
} from '@project-r/styleguide'

import { withMembership } from '../Auth/checkRoles'

import Toggle from './Toggle'
import User from './User'
import Popover from './Popover'
import NavPopover from './Popover/Nav'
import LoadingBar from './LoadingBar'
import Pullable from './Pullable'

import { MdSearch } from 'react-icons/md'
import BackIcon from '../Icons/Back'

import { shouldIgnoreClick } from '../../lib/utils/link'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  HEADER_ICON_SIZE,
  ZINDEX_HEADER,
  LOGO_WIDTH,
  LOGO_PADDING,
  LOGO_WIDTH_MOBILE,
  LOGO_PADDING_MOBILE,
  HEADER_HEIGHT_CONFIG
} from '../constants'

import HeaderIconA from './HeaderIconA'

import NotificationIcon from '../Notifications/NotificationIcon'

const TRANSITION_MS = 200

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
    transition: `opacity ${TRANSITION_MS}ms ease-in-out`
  }),
  logo: css({
    position: 'relative',
    display: 'inline-block',
    padding: LOGO_PADDING_MOBILE,
    width: LOGO_WIDTH_MOBILE + LOGO_PADDING_MOBILE * 2,
    [mediaQueries.mUp]: {
      padding: LOGO_PADDING,
      width: LOGO_WIDTH + LOGO_PADDING * 2
    },
    verticalAlign: 'middle'
  }),
  leftItem: css({
    '@media print': {
      display: 'none'
    },
    transition: `opacity ${TRANSITION_MS}ms ease-in-out`
  }),
  back: css({
    display: 'block',
    position: 'absolute',
    left: 0,
    top: -1,
    padding: '10px 10px 10px 15px',
    [mediaQueries.mUp]: {
      top: -1 + 8
    }
  }),
  hamburger: css({
    '@media print': {
      display: 'none'
    },
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'inline-block',
    height: HEADER_HEIGHT_MOBILE - 2,
    width: HEADER_HEIGHT_MOBILE - 2 + 1,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT - 2,
      width: HEADER_HEIGHT - 2 + 5
    }
  }),
  menuIcons: css({
    '@media print': {
      display: 'none'
    },
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    zIndex: 1,
    right: HEADER_HEIGHT_MOBILE - 10 + 2,
    height: HEADER_HEIGHT_MOBILE - 2,
    [mediaQueries.mUp]: {
      right: HEADER_HEIGHT - 12 + 5,
      height: HEADER_HEIGHT - 2
    }
  }),
  search: css({
    '@media (max-width: 339px)': {
      display: 'none !important'
    }
  }),
  secondary: css({
    position: 'absolute',
    top: 0,
    left: 15,
    display: 'inline-block',
    height: HEADER_HEIGHT_MOBILE,
    right: `${HEADER_HEIGHT_MOBILE + HEADER_ICON_SIZE}px`,
    paddingTop: '10px',
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT,
      right: `${HEADER_HEIGHT + HEADER_HEIGHT}px`,
      paddingTop: '18px'
    },
    transition: `opacity ${TRANSITION_MS}ms ease-in-out`
  }),
  sticky: css({
    position: 'sticky'
  }),
  stickyWithFallback: css({
    // auto prefix does not with multiple values :(
    // - -webkit-sticky would be missing if not defined explicitly
    // - glamor 2.20.40 / inline-style-prefixer 3.0.8
    position: ['fixed', '-webkit-sticky', 'sticky']
    // - this will produce three position statements
    // { position: fixed; position: -webkit-sticky; position: sticky; }
  }),
  hr: css({
    margin: 0,
    display: 'block',
    border: 0,
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
  })
}

// Workaround for WKWebView fixed 0 rendering hickup
// - iOS 11.4: header is transparent and only appears after triggering a render by scrolling down enough
const forceRefRedraw = ref => {
  if (ref) {
    const redraw = () => {
      const display = ref.style.display
      // offsetHeight
      ref.style.display = 'none'
      /* eslint-disable-next-line no-unused-expressions */
      ref.offsetHeight // this force webkit to flush styles (render them)
      ref.style.display = display
    }
    const msPerFrame = 1000 / 30 // assuming 30 fps
    const frames = [1, 10, 20, 30]
    // force a redraw on frame x after initial dom mount
    frames.forEach(frame => {
      setTimeout(redraw, msPerFrame * frame)
    })
  }
}

const isActiveRoute = (active, route, params = {}) =>
  !!active &&
  active.route === route &&
  Object.keys(params).every(key => active.params[key] === params[key])

const isFront = router => {
  const active = matchPath(router.asPath)

  return isActiveRoute(active, 'index', {})
}

const hasBackButton = props =>
  props.inNativeIOSApp && props.me && !isFront(props.router)

let routeChangeStarted

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      opaque: !props.cover,
      mobile: false,
      expanded: false,
      backButton: hasBackButton(props),
      renderSecondaryNav: props.showSecondary
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

    this.close = () => {
      this.setState({ expanded: false })
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }

  componentDidUpdate() {
    this.measure()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const backButton = hasBackButton(nextProps)
    if (this.state.backButton !== backButton) {
      this.setState({
        backButton
      })
    }
    clearTimeout(this.secondaryNavTimeout)
    if (this.state.renderSecondaryNav !== nextProps.showSecondary) {
      if (nextProps.showSecondary) {
        this.setState({ renderSecondaryNav: true })
      } else {
        this.secondaryNavTimeout = setTimeout(() => {
          this.setState({ renderSecondaryNav: false })
        }, TRANSITION_MS)
      }
    }
  }

  render() {
    const {
      router,
      t,
      me,
      cover,
      secondaryNav,
      showSecondary,
      formatColor,
      inNativeApp,
      inNativeIOSApp,
      isMember,
      pullable = true,
      children
    } = this.props
    const { backButton, renderSecondaryNav } = this.state

    const expanded = this.state.expanded
    const secondaryVisible = showSecondary && !expanded
    const dark = this.props.dark && !expanded

    const opaque = this.state.opaque || expanded
    const barStyle = opaque ? merge(styles.bar, styles.barOpaque) : styles.bar

    const bgStyle = opaque
      ? {
          backgroundColor: dark ? colors.negative.primaryBg : '#fff'
        }
      : undefined
    const hrColor = dark ? colors.negative.containerBg : colors.divider
    const hrColorStyle = {
      color: hrColor,
      backgroundColor: hrColor
    }
    const textFill = dark ? colors.negative.text : colors.text
    const logoFill = dark ? colors.logoDark || '#fff' : colors.logo || '#000'

    const toggleExpanded = () => {
      this.setState({ expanded: !expanded })
      this.props.onNavExpanded && this.props.onNavExpanded(!expanded)
    }
    const closeHandler = () => {
      if (expanded) {
        toggleExpanded()
      }
    }

    const goTo = (pathName, route) => e => {
      if (shouldIgnoreClick(e)) {
        return
      }
      e.preventDefault()
      if (router.pathname === pathName) {
        window.scrollTo(0, 0)
        closeHandler()
      } else {
        Router.pushRoute(route).then(() => window.scrollTo(0, 0))
      }
    }

    return (
      <HeaderHeightProvider config={HEADER_HEIGHT_CONFIG}>
        <ColorContext.Provider value={dark ? colors.negative : colors}>
          <div
            {...barStyle}
            ref={inNativeIOSApp ? forceRefRedraw : undefined}
            style={bgStyle}
          >
            {opaque && (
              <Fragment>
                <div
                  {...styles.center}
                  style={{ opacity: secondaryVisible ? 0 : 1 }}
                >
                  <a
                    {...styles.logo}
                    aria-label={t('header/logo/magazine/aria')}
                    href={'/'}
                    onClick={goTo('/', 'index')}
                  >
                    <Logo fill={logoFill} />
                  </a>
                </div>
                <div
                  {...styles.leftItem}
                  style={{
                    opacity: secondaryVisible || backButton ? 0 : 1
                  }}
                >
                  <User
                    dark={dark}
                    me={me}
                    expanded={expanded}
                    title={t(`header/nav/${expanded ? 'close' : 'open'}/aria`)}
                    onClick={toggleExpanded}
                  />
                </div>
                {(inNativeIOSApp || backButton) && (
                  <a
                    style={{
                      opacity: backButton ? 1 : 0,
                      pointerEvents: backButton ? undefined : 'none',
                      href: '#back'
                    }}
                    title={t('header/back')}
                    onClick={e => {
                      e.preventDefault()
                      if (backButton) {
                        routeChangeStarted = false
                        window.history.back()
                        setTimeout(() => {
                          if (!routeChangeStarted) {
                            Router.replaceRoute('index').then(() =>
                              window.scrollTo(0, 0)
                            )
                          }
                        }, 200)
                      }
                    }}
                    {...styles.leftItem}
                    {...styles.back}
                  >
                    <BackIcon size={25} fill={textFill} />
                  </a>
                )}
                {secondaryNav && (
                  <div
                    {...styles.secondary}
                    style={{
                      left: backButton ? 40 : undefined,
                      opacity: secondaryVisible ? 1 : 0,
                      pointerEvents: secondaryVisible ? undefined : 'none'
                    }}
                  >
                    {renderSecondaryNav && secondaryNav}
                  </div>
                )}
                <div {...styles.menuIcons}>
                  {me && <NotificationIcon fill={textFill} />}
                  {isMember && (
                    <HeaderIconA
                      {...styles.search}
                      title={t('header/nav/search/aria')}
                      href='/suche'
                      onClick={goTo('/search', 'search')}
                    >
                      <MdSearch fill={textFill} size={HEADER_ICON_SIZE} />
                    </HeaderIconA>
                  )}
                </div>
                <div {...styles.hamburger} style={bgStyle}>
                  <Toggle
                    dark={dark}
                    expanded={expanded}
                    id='primary-menu'
                    title={t(`header/nav/${expanded ? 'close' : 'open'}/aria`)}
                    onClick={toggleExpanded}
                  />
                </div>
              </Fragment>
            )}
          </div>
          {opaque && (
            <hr
              {...styles.stickyWithFallback}
              {...styles.hr}
              {...styles[formatColor ? 'hrThick' : 'hrThin']}
              style={
                formatColor
                  ? {
                      color: formatColor,
                      backgroundColor: formatColor
                    }
                  : hrColorStyle
              }
            />
          )}
          <Popover expanded={expanded}>
            <NavPopover
              me={me}
              router={router}
              expanded={expanded}
              closeHandler={closeHandler}
            />
          </Popover>
          <LoadingBar
            onRouteChangeStart={() => {
              routeChangeStarted = true
            }}
          />
          {!!cover && <div {...styles.cover}>{cover}</div>}
          {inNativeApp && pullable && (
            <Pullable
              dark={dark}
              onRefresh={() => {
                if (inNativeIOSApp) {
                  postMessage({ type: 'haptic', payload: { type: 'impact' } })
                }
                // give the browser 3 frames (1000/30fps) to start animating the spinner
                setTimeout(() => {
                  window.location.reload(true)
                }, 33 * 3)
              }}
            />
          )}
        </ColorContext.Provider>
        {children}
      </HeaderHeightProvider>
    )
  }
}

export default compose(
  withT,
  withMembership,
  withRouter,
  withInNativeApp
)(Header)
