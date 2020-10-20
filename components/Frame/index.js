import React, { useMemo } from 'react'
import { css } from 'glamor'
import 'glamor/reset'
import { compose } from 'react-apollo'
import {
  Container,
  RawHtml,
  fontFamilies,
  mediaQueries,
  ColorContextProvider
} from '@project-r/styleguide'
import Meta from './Meta'
import Header from './Header'
import Footer from './Footer'
import Box from './Box'
import AudioPlayer from '../Audio/AudioPlayer'
import ProlongBox from './ProlongBox'
import ColorSchemeSync from '../ColorScheme/Sync'
import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SUBHEADER_HEIGHT
} from '../constants'
import { withMembership } from '../Auth/checkRoles'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'

css.global('html', { boxSizing: 'border-box' })
css.global('*, *:before, *:after', { boxSizing: 'inherit' })

css.global('body', {
  width: '100%',
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
  inNativeApp,
  inNativeIOSApp,
  onNavExpanded,
  secondaryNav,
  formatColor,
  footer = true,
  pullable,
  dark,
  isMember,
  hasOverviewNav: wantOverviewNav,
  stickySecondaryNav,
  colorSchemeKey = 'light'
}) => {
  const hasOverviewNav = isMember && wantOverviewNav
  const hasSecondaryNav = !!(secondaryNav || hasOverviewNav)
  const padHeaderRule = useMemo(() => {
    return css({
      paddingTop: hasSecondaryNav
        ? HEADER_HEIGHT_MOBILE + SUBHEADER_HEIGHT
        : HEADER_HEIGHT_MOBILE - 1,
      [mediaQueries.mUp]: {
        paddingTop: hasSecondaryNav
          ? HEADER_HEIGHT + SUBHEADER_HEIGHT
          : HEADER_HEIGHT - 1
      }
    })
  }, [hasSecondaryNav])
  return (
    <ColorContextProvider root colorSchemeKey={colorSchemeKey}>
      {colorSchemeKey === 'auto' && <ColorSchemeSync />}
      <div
        {...(footer || inNativeApp ? styles.bodyGrowerContainer : undefined)}
      >
        {/* body growing only needed when rendering a footer */}
        <div
          {...(footer || inNativeApp ? styles.bodyGrower : undefined)}
          {...padHeaderRule}
        >
          {!!meta && <Meta data={meta} />}
          <Header
            colorSchemeKey={colorSchemeKey}
            dark={dark && !inNativeIOSApp}
            me={me}
            cover={cover}
            onNavExpanded={onNavExpanded}
            secondaryNav={secondaryNav}
            formatColor={formatColor}
            pullable={pullable}
            hasOverviewNav={hasOverviewNav}
            stickySecondaryNav={stickySecondaryNav}
          >
            <noscript>
              <Box style={{ padding: 30 }}>
                <RawHtml
                  dangerouslySetInnerHTML={{
                    __html: t('noscript')
                  }}
                />
              </Box>
            </noscript>
            {me && me.prolongBeforeDate !== null && (
              <ProlongBox
                t={t}
                prolongBeforeDate={me.prolongBeforeDate}
                dark={dark}
              />
            )}
            {raw ? (
              children
            ) : (
              <MainContainer>
                <Content>{children}</Content>
              </MainContainer>
            )}
          </Header>
        </div>
        {!inNativeApp && footer && <Footer />}
      </div>
      <AudioPlayer />
    </ColorContextProvider>
  )
}

export default compose(withMe, withMembership, withT, withInNativeApp)(Frame)
