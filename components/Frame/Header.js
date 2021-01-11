import React, { useMemo, useState, useRef, useEffect } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import {
  Logo,
  mediaQueries,
  HeaderHeightProvider,
  useColorContext
} from '@project-r/styleguide'

import { Router } from '../../lib/routes'
import { withMembership } from '../Auth/checkRoles'
import withT from '../../lib/withT'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { shouldIgnoreClick } from '../../lib/utils/link'
import NotificationIcon from '../Notifications/NotificationIcon'
import BackIcon from '../Icons/Back'
import HLine from '../Frame/HLine'

import User from './User'
import Popover from './Popover'
import NavPopover from './Popover/Nav'
import UserNavPopover from './Popover/UserNav'
import LoadingBar from './LoadingBar'
import Pullable from './Pullable'
import Toggle from './Toggle'
import SecondaryNav from './SecondaryNav'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SUBHEADER_HEIGHT,
  ZINDEX_POPOVER,
  LOGO_WIDTH,
  LOGO_PADDING,
  LOGO_WIDTH_MOBILE,
  LOGO_PADDING_MOBILE,
  TRANSITION_MS
} from '../constants'

let routeChangeStarted

const Header = ({
  isAnyNavExpanded,
  setIsAnyNavExpanded,
  headerOffset,
  setHeaderOffset,
  hasSecondaryNav,
  inNativeApp,
  inNativeIOSApp,
  me,
  t,
  secondaryNav,
  router,
  formatColor,
  pullable = true,
  hasOverviewNav,
  stickySecondaryNav
}) => {
  const [colorScheme] = useColorContext()
  const [isMobile, setIsMobile] = useState()
  const [scrollableHeaderHeight, setScrollableHeaderHeight] = useState(
    HEADER_HEIGHT_MOBILE
  )
  const [expandedNav, setExpandedNav] = useState(null)
  const [userNavExpanded, setUserNavExpanded] = useState(false)

  const fixedRef = useRef()
  const diff = useRef(0)
  const lastY = useRef()
  const lastDiff = useRef()

  const backButton = !hasOverviewNav && inNativeIOSApp && me

  const toggleExpanded = target => {
    if (target === expandedNav) {
      setIsAnyNavExpanded(false)
      setExpandedNav(null)
    } else if (isAnyNavExpanded) {
      setExpandedNav(target)
    } else {
      setIsAnyNavExpanded(!isAnyNavExpanded)
      setExpandedNav(target)
    }
  }

  const openUserNavOverMainNav = () => {
    setUserNavExpanded(true)
    setTimeout(() => {
      setExpandedNav('user')
    }, TRANSITION_MS)
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

  useEffect(() => {
    const onScroll = () => {
      const y = Math.max(window.pageYOffset, 0)

      if (isAnyNavExpanded) {
        diff.current = 0
      } else {
        const newDiff = lastY.current ? lastY.current - y : 0
        diff.current += newDiff
        diff.current = Math.min(
          Math.max(-scrollableHeaderHeight, diff.current),
          0
        )
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
      onScroll()
    }

    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [isAnyNavExpanded, scrollableHeaderHeight, isMobile])

  const hasStickySecondary = hasSecondaryNav && stickySecondaryNav
  useEffect(() => {
    setScrollableHeaderHeight(
      (isMobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT) +
        (hasSecondaryNav && !hasStickySecondary ? SUBHEADER_HEIGHT : 0) +
        // scroll away thin HLine
        (formatColor || hasStickySecondary ? 0 : 1)
    )
  }, [isMobile, hasSecondaryNav, hasStickySecondary, formatColor])

  return (
    <>
      <div
        {...styles.navBar}
        {...colorScheme.set('backgroundColor', 'default')}
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
                  <BackIcon size={24} {...colorScheme.set('fill', 'text')} />
                </a>
              )}
              <User
                me={me}
                backButton={backButton}
                isMobile={isMobile}
                id='user'
                title={t(
                  `header/nav/user/${
                    expandedNav === 'user' ? 'close' : 'open'
                  }/aria`
                )}
                onClick={() =>
                  !isAnyNavExpanded
                    ? toggleExpanded('user')
                    : expandedNav !== 'user'
                    ? openUserNavOverMainNav()
                    : closeHandler()
                }
              />
              {me && <NotificationIcon />}
            </div>
          </div>
          <div {...styles.navBarItem}>
            <a
              {...styles.logo}
              aria-label={t('header/logo/magazine/aria')}
              href={'/'}
              onClick={goTo('/', 'index')}
            >
              <Logo />
            </a>
          </div>
          <div {...styles.navBarItem}>
            <div {...styles.rightBarItem}>
              <Toggle
                expanded={isAnyNavExpanded}
                title={t(
                  `header/nav/${expandedNav === 'main' ? 'close' : 'open'}/aria`
                )}
                id='main'
                onClick={() =>
                  isAnyNavExpanded ? closeHandler() : toggleExpanded('main')
                }
              />
            </div>
          </div>
        </div>
        <SecondaryNav
          secondaryNav={secondaryNav}
          router={router}
          formatColor={formatColor}
          hasOverviewNav={hasOverviewNav}
          isSecondarySticky={headerOffset === -scrollableHeaderHeight}
        />
        <HLine formatColor={formatColor} />
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
    </>
  )
}

const HeaderWithContext = props => {
  const [isAnyNavExpanded, setIsAnyNavExpanded] = useState(false)
  const [headerOffset, setHeaderOffset] = useState(0)

  const {
    cover,
    children,
    hasOverviewNav,
    secondaryNav,
    inNativeIOSApp
  } = props

  const hasSecondaryNav = hasOverviewNav || secondaryNav
  const headerConfig = useMemo(() => {
    return [
      {
        minWidth: 0,
        headerHeight:
          HEADER_HEIGHT_MOBILE +
          (hasSecondaryNav ? SUBHEADER_HEIGHT : 0) +
          headerOffset
      },
      {
        minWidth: mediaQueries.mBreakPoint,
        headerHeight:
          HEADER_HEIGHT +
          (hasSecondaryNav ? SUBHEADER_HEIGHT : 0) +
          headerOffset
      }
    ]
  }, [hasSecondaryNav, headerOffset])

  return (
    <HeaderHeightProvider config={headerConfig}>
      <Header
        {...props}
        hasSecondaryNav={hasSecondaryNav}
        isAnyNavExpanded={isAnyNavExpanded}
        setIsAnyNavExpanded={setIsAnyNavExpanded}
        headerOffset={headerOffset}
        setHeaderOffset={setHeaderOffset}
      />
      {cover}
      {children}
    </HeaderHeightProvider>
  )
}

export default compose(
  withT,
  withMembership,
  withRouter,
  withInNativeApp
)(HeaderWithContext)

const styles = {
  navBar: css({
    height: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT
    },
    zIndex: ZINDEX_POPOVER + 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
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
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%'
  }),
  rightBarItem: css({
    marginLeft: 'auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    '@media print': {
      display: 'none'
    }
  }),
  back: css({
    display: 'block',
    padding: '12px 0px 12px 12px',
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
