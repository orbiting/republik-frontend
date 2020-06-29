import React, { useMemo, useState, useRef, useEffect } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import {
  Logo,
  colors,
  mediaQueries,
  ColorContext,
  HeaderHeightProvider
} from '@project-r/styleguide'

import { Router, matchPath } from '../../lib/routes'
import { withMembership } from '../Auth/checkRoles'
import withT from '../../lib/withT'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { shouldIgnoreClick } from '../Link/utils'
import NotificationIconNew from '../Notifications/NotificationIconNew'
import BackIcon from '../Icons/Back'

import UserNew from './UserNew'
import Popover from './Popover'
import NavPopover from './Popover/NavNew'
import UserNavPopover from './Popover/UserNav'
import LoadingBar from './LoadingBar'
import Pullable from './Pullable'
import HLine from './HLine'
import ToggleNew from './ToggleNew'
import SecondaryNav from './SecondaryNav'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SUBHEADER_HEIGHT,
  ZINDEX_POPOVER,
  LOGO_WIDTH,
  LOGO_PADDING,
  LOGO_WIDTH_MOBILE,
  LOGO_PADDING_MOBILE
} from '../constants'

const isActiveRoute = (active, route, params = {}) =>
  !!active &&
  active.route === route &&
  Object.keys(params).every(key => active.params[key] === params[key])

const isFront = router => {
  const active = matchPath(router.asPath)
  return isActiveRoute(active, 'index', {})
}

let routeChangeStarted

const HeaderNew = ({
  inNativeApp,
  inNativeIOSApp,
  isMember,
  dark,
  me,
  t,
  secondaryNav,
  showSecondary,
  router,
  formatColor,
  pullable = true,
  hasOverviewNav,
  children
}) => {
  const [isAnyNavExpanded, setIsAnyNavExpanded] = useState(false)
  const [expandedNav, setExpandedNav] = useState(null)
  const [isMobile, setIsMobile] = useState()
  const [headerHeightState, setHeaderHeightState] = useState()
  const [headerOffset, setHeaderOffset] = useState(0)
  const [userNavExpanded, setUserNavExpanded] = useState(false)

  const fixedRef = useRef()
  const diff = useRef(0)
  const lastY = useRef()
  const headerHeight = useRef()
  const lastDiff = useRef()

  const textFill = dark ? colors.negative.text : colors.text
  const logoFill = dark ? colors.logoDark || '#fff' : colors.logo || '#000'
  const backButton = inNativeIOSApp && me && !isFront(router)

  const toggleExpanded = target => {
    if (target.id === expandedNav) {
      setIsAnyNavExpanded(false)
      setExpandedNav(null)
    } else if (isAnyNavExpanded) {
      setExpandedNav(target.id)
    } else {
      setIsAnyNavExpanded(!isAnyNavExpanded)
      setExpandedNav(target.id)
    }
  }

  const closeHandler = () => {
    if (isAnyNavExpanded) {
      setIsAnyNavExpanded(false)
      setExpandedNav(null)
      setUserNavExpanded(false)
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

  const onScroll = () => {
    const y = Math.max(window.pageYOffset, 0)

    if (isAnyNavExpanded) {
      diff.current = 0
    } else {
      const newDiff = lastY.current ? lastY.current - y : 0
      diff.current += newDiff
      diff.current = Math.min(Math.max(-headerHeight.current, diff.current), 0)
    }

    if (diff.current !== lastDiff.current) {
      fixedRef.current.style.top = `${diff.current}px`
      setHeaderOffset(diff.current)
    }

    lastY.current = y
    lastDiff.current = diff.current
  }

  const measure = () => {
    const mobile = window.innerWidth < mediaQueries.mBreakPoint
    if (mobile !== isMobile) {
      setIsMobile(mobile)
    }
    const { height } = fixedRef.current.getBoundingClientRect()
    headerHeight.current = height
    if (height !== headerHeightState) {
      setHeaderHeightState(height)
    }
    onScroll()
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [showSecondary])

  const headerConfig = useMemo(() => {
    return [
      {
        minWidth: 0,
        headerHeight:
          HEADER_HEIGHT_MOBILE +
          (showSecondary ? SUBHEADER_HEIGHT : 0) +
          headerOffset
      },
      {
        minWidth: mediaQueries.mBreakPoint,
        headerHeight:
          HEADER_HEIGHT + (showSecondary ? SUBHEADER_HEIGHT : 0) + headerOffset
      }
    ]
  }, [secondaryNav, headerOffset])

  return (
    <HeaderHeightProvider config={headerConfig}>
      <ColorContext.Provider
        value={dark && !isAnyNavExpanded ? colors.negative : colors}
      >
        <div
          {...styles.navBar}
          style={{ backgroundColor: dark ? colors.negative.primaryBg : '#fff' }}
          ref={fixedRef}
        >
          <div {...styles.primary}>
            <div {...styles.navBarItem}>
              <div {...styles.leftBarItem}>
                {backButton && (
                  <a
                    {...styles.back}
                    style={{
                      opacity: 1,
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
                  >
                    <BackIcon size={24} fill={textFill} />
                  </a>
                )}
                <UserNew
                  dark={dark}
                  me={me}
                  backButton={backButton}
                  id='user'
                  title={t(
                    `header/nav/${
                      expandedNav === 'user' ? 'close' : 'open'
                    }/aria`
                  )}
                  onClick={
                    isAnyNavExpanded
                      ? () => setUserNavExpanded(true)
                      : e => toggleExpanded(e.currentTarget)
                  }
                />
                {me && <NotificationIconNew fill={textFill} />}
              </div>
            </div>
            <div {...styles.navBarItem}>
              <a
                {...styles.logo}
                aria-label={t('header/logo/magazine/aria')}
                href={'/'}
                onClick={goTo('/', 'index')}
              >
                <Logo fill={logoFill} />
              </a>
            </div>
            <div {...styles.navBarItem}>
              <div {...styles.rightBarItem}>
                <ToggleNew
                  expanded={isAnyNavExpanded}
                  dark={dark}
                  size={26}
                  title={t(
                    `header/nav/${
                      expandedNav === 'main' ? 'close' : 'open'
                    }/aria`
                  )}
                  id='main'
                  onClick={e =>
                    isAnyNavExpanded
                      ? closeHandler()
                      : toggleExpanded(e.currentTarget)
                  }
                />
              </div>
            </div>
          </div>
          <HLine formatColor={formatColor} dark={dark} />
          <SecondaryNav
            secondaryNav={secondaryNav}
            router={router}
            dark={dark}
            showSecondary={showSecondary}
            hasOverviewNav={hasOverviewNav}
          />
        </div>
        <Popover formatColor={formatColor} expanded={expandedNav === 'main'}>
          <NavPopover
            me={me}
            router={router}
            expanded={expandedNav === 'main'}
            closeHandler={closeHandler}
            onSearchSubmit={closeHandler}
          />
        </Popover>
        <Popover
          formatColor={formatColor}
          expanded={userNavExpanded || expandedNav === 'user'}
        >
          <UserNavPopover
            me={me}
            router={router}
            expanded={userNavExpanded || expandedNav === 'user'}
            closeHandler={closeHandler}
          />
        </Popover>
        <LoadingBar
          onRouteChangeStart={() => {
            routeChangeStarted = true
          }}
        />
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

export default compose(
  withT,
  withMembership,
  withRouter,
  withInNativeApp
)(HeaderNew)

const styles = {
  navBar: css({
    height: HEADER_HEIGHT_MOBILE,
    zIndex: ZINDEX_POPOVER + 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT
    },
    '@media print': {
      position: 'absolute'
    }
  }),
  primary: css({
    display: 'flex',
    justifyContent: 'space-between'
  }),
  navBarItem: css({
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  }),
  leftBarItem: css({
    marginRight: 'auto',
    display: 'flex'
  }),
  rightBarItem: css({
    marginLeft: 'auto',
    height: HEADER_HEIGHT_MOBILE - 2,
    width: HEADER_HEIGHT_MOBILE - 2 + 1,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT - 2,
      width: HEADER_HEIGHT - 2 + 5
    },
    '@media print': {
      display: 'none'
    }
  }),
  back: css({
    display: 'block',
    padding: '10px 0px 10px 10px',
    [mediaQueries.mUp]: {
      top: -1 + 8
    }
  }),
  logo: css({
    display: 'block',
    padding: LOGO_PADDING_MOBILE,
    width: LOGO_WIDTH_MOBILE + LOGO_PADDING_MOBILE * 2,
    verticalAlign: 'middle',
    [mediaQueries.mUp]: {
      padding: LOGO_PADDING,
      width: LOGO_WIDTH + LOGO_PADDING * 2
    }
  })
}
