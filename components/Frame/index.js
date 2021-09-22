import React, { useMemo, useRef, useState, useEffect } from 'react'
import { css } from 'glamor'
import 'glamor/reset'
import { compose } from 'react-apollo'
import {
  Container,
  RawHtml,
  fontFamilies,
  mediaQueries,
  ColorHtmlBodyColors,
  ColorContextProvider,
  HeaderHeightProvider
} from '@project-r/styleguide'
import Meta from './Meta'
import Header from './Header'
import Footer from '../Footer'
import Box from './Box'
import ProlongBox from './ProlongBox'
import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SUBHEADER_HEIGHT
} from '../constants'
import { withMembership } from '../Auth/checkRoles'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { useInNativeApp } from '../../lib/withInNativeApp'
import LegacyAppNoticeBox from './LegacyAppNoticeBox'

css.global('html', { boxSizing: 'border-box' })
css.global('*, *:before, *:after', { boxSizing: 'inherit' })

css.global('body', {
  width: '100%',
  fontFamily: fontFamilies.sansSerifRegular
})

css.global('button', {
  fontFamily: fontFamilies.sansSerifRegular
})

// avoid gray rects over links and icons on iOS
css.global('*', {
  WebkitTapHighlightColor: 'transparent'
})
// avoid orange highlight, observed around full screen gallery, on Android
css.global('div:focus', {
  outline: 'none'
})

const styles = {
  bodyGrowerContainer: css({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }),
  padHeader: css({
    // minus 1px for first sticky hr from header
    // - otherwise there is a jump when scroll 0 and opening hamburger
    paddingTop: HEADER_HEIGHT_MOBILE - 1,
    [mediaQueries.mUp]: {
      paddingTop: HEADER_HEIGHT - 1
    }
  }),
  bodyGrower: css({
    flexGrow: 1
  }),
  content: css({
    paddingTop: 40,
    paddingBottom: 60,
    [mediaQueries.mUp]: {
      paddingTop: 80,
      paddingBottom: 120
    }
  })
}

export const MainContainer = ({ children }) => (
  <Container style={{ maxWidth: '840px' }}>{children}</Container>
)

export const Content = ({ children, style }) => (
  <div {...styles.content} style={style}>
    {children}
  </div>
)

const Frame = ({
  t,
  me,
  children,
  raw,
  meta,
  cover,
  onNavExpanded,
  secondaryNav,
  formatColor,
  footer = true,
  pullable,
  isMember,
  hasOverviewNav: wantOverviewNav,
  stickySecondaryNav,
  isOnMarketingPage,
  pageColorSchemeKey
}) => {
  const { inNativeApp, inNativeAppLegacy } = useInNativeApp()
  const [isMobile, setIsMobile] = useState()
  const [scrollableHeaderHeight, setScrollableHeaderHeight] = useState(
    HEADER_HEIGHT_MOBILE
  )
  const [isAnyNavExpanded, setIsAnyNavExpanded] = useState(false)
  const [headerOffset, setHeaderOffset] = useState(0)

  const hasOverviewNav = isMember && wantOverviewNav
  const hasSecondaryNav = !!(secondaryNav || hasOverviewNav)

  const scrollContainerRule = useMemo(() => {
    return css({
      height: `calc(100vh - ${scrollableHeaderHeight}px)`,
      overflowY: 'scroll',
      position: 'relative',
      top: scrollableHeaderHeight
    })
  }, [hasSecondaryNav, scrollableHeaderHeight])

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

  const diff = useRef(0)
  const lastY = useRef()
  const lastDiff = useRef()

  const fixedRef = useRef()
  const scrollRef = useRef()

  useEffect(() => {
    const onScroll = () => {
      const y = Math.max(scrollRef.current.scrollTop, 0)

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

      if (!isOnMarketingPage && diff.current !== lastDiff.current) {
        fixedRef.current.style.top = `${diff.current}px`
        scrollRef.current.style.top = `${diff.current +
          scrollableHeaderHeight}px`
        scrollRef.current.style.height = `calc(100vh + ${-diff.current -
          scrollableHeaderHeight}px`
        console.log(diff.current)

        // scrollRef.current.style.marginTop =
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

    window.addEventListener('resize', measure)
    measure()
    if (scrollRef && scrollRef.current) {
      scrollRef.current.addEventListener('scroll', onScroll)
    }
    return () => {
      if (scrollRef && scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', onScroll)
      }
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
    <HeaderHeightProvider config={headerConfig}>
      <div style={{ overflow: 'hidden', height: '100vh' }}>
        {!!meta && <Meta data={meta} />}
        <Header
          onNavExpanded={onNavExpanded}
          secondaryNav={secondaryNav}
          formatColor={formatColor}
          pullable={pullable}
          hasOverviewNav={hasOverviewNav}
          stickySecondaryNav={stickySecondaryNav}
          isOnMarketingPage={isOnMarketingPage}
          pageColorSchemeKey={pageColorSchemeKey}
          hasSecondaryNav={hasSecondaryNav}
          isAnyNavExpanded={isAnyNavExpanded}
          setIsAnyNavExpanded={setIsAnyNavExpanded}
          headerOffset={headerOffset}
          setHeaderOffset={setHeaderOffset}
          scrollableHeaderHeight={scrollableHeaderHeight}
          ref={fixedRef}
        />
        {cover}
        <ColorContextProvider colorSchemeKey={pageColorSchemeKey}>
          <ColorHtmlBodyColors colorSchemeKey={pageColorSchemeKey || 'auto'} />
          <noscript>
            <Box style={{ padding: 30 }}>
              <RawHtml
                dangerouslySetInnerHTML={{
                  __html: t('noscript')
                }}
              />
            </Box>
          </noscript>
          <div ref={scrollRef} {...scrollContainerRule}>
            {inNativeAppLegacy && <LegacyAppNoticeBox t={t} />}
            {me &&
              me.prolongBeforeDate !== null &&
              me.activeMembership !== null && (
                <ProlongBox
                  t={t}
                  prolongBeforeDate={me.prolongBeforeDate}
                  membership={me.activeMembership}
                />
              )}
            {raw ? (
              children
            ) : (
              <MainContainer>
                <Content>{children}</Content>
              </MainContainer>
            )}
            {!inNativeApp && footer && (
              <Footer isOnMarketingPage={isOnMarketingPage} />
            )}
          </div>
        </ColorContextProvider>
      </div>
    </HeaderHeightProvider>
  )
}

export default compose(withMe, withMembership, withT)(Frame)
