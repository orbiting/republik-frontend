import React from 'react'
import { compose } from 'react-apollo'
import {
  Container,
  RawHtml,
  fontFamilies,
  mediaQueries,
  colors,
  ColorContext,
  HeaderHeightProvider
} from '@project-r/styleguide'
import Meta from './Meta'
import Header from './Header'
import HeaderNew from './HeaderNew'
import Footer from './Footer'
import Box from './Box'
import ProlongBox from './ProlongBox'
import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  HEADER_HEIGHT_CONFIG
} from '../constants'
import { css } from 'glamor'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'

import 'glamor/reset'

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

const Index = ({
  t,
  me,
  children,
  raw,
  meta,
  nav,
  cover,
  inNativeApp,
  inNativeIOSApp,
  onNavExpanded,
  secondaryNav,
  showSecondary,
  formatColor,
  onSearchClick,
  footer = true,
  pullable,
  dark
}) => (
  <HeaderHeightProvider config={HEADER_HEIGHT_CONFIG}>
    <ColorContext.Provider value={dark && colors.negative}>
      <div
        {...(footer || inNativeApp ? styles.bodyGrowerContainer : undefined)}
      >
        {/* body growing only needed when rendering a footer */}
        <div
          {...(footer || inNativeApp ? styles.bodyGrower : undefined)}
          {...(!cover ? styles.padHeader : undefined)}
        >
          {dark && (
            <style
              dangerouslySetInnerHTML={{
                __html: `html, body { background-color: ${colors.negative.containerBg}; color: ${colors.negative.text}; }`
              }}
            />
          )}
          {!!meta && <Meta data={meta} />}
          <HeaderNew
            dark={dark && !inNativeIOSApp}
            me={me}
            cover={cover}
            onNavExpanded={onNavExpanded}
            secondaryNav={secondaryNav}
            showSecondary={showSecondary}
            formatColor={formatColor}
            pullable={pullable}
          />
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
        </div>
        {!inNativeApp && footer && <Footer />}
      </div>
    </ColorContext.Provider>
  </HeaderHeightProvider>
)

export default compose(withMe, withT, withInNativeApp)(Index)
