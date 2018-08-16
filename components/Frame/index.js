import React from 'react'
import { compose } from 'react-apollo'
import { Container, RawHtml, fontFamilies, mediaQueries } from '@project-r/styleguide'
import Meta from './Meta'
import Header from './Header'
import Footer from './Footer'
import Box from './Box'
import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SAFE_TOP_HEIGHT,
  SAFE_TOP_HEIGHT_MOBILE
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

const styles = {
  container: css({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }),
  coverlessWithMe: css({
    paddingTop: SAFE_TOP_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      paddingTop: SAFE_TOP_HEIGHT
    }
  }),
  coverless: css({
    paddingTop: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      paddingTop: HEADER_HEIGHT
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

export const MainContainer = ({children}) => (
  <Container style={{ maxWidth: '840px' }}>
    {children}
  </Container>
)

export const Content = ({children, style}) => (
  <div {...styles.content} style={style}>{children}</div>
)

const Index = ({
  t,
  me,
  children,
  url,
  raw,
  meta,
  nav,
  cover,
  inNativeApp,
  onPrimaryNavExpandedChange,
  primaryNavExpanded,
  secondaryNav,
  showSecondary,
  headerInline,
  formatColor,
  audioSource,
  audioCloseHandler,
  onSearchClick,
  onNavBarChange
}) => (
  <div {...styles.container}>
    <div
      {...styles.bodyGrower}
      className={cover
        ? undefined
        : me && !inNativeApp
          ? styles.coverlessWithMe
          : styles.coverless
      }
    >
      {!!meta && <Meta data={meta} />}
      <Header
        me={me}
        url={url}
        cover={cover}
        onPrimaryNavExpandedChange={onPrimaryNavExpandedChange}
        primaryNavExpanded={primaryNavExpanded}
        secondaryNav={secondaryNav}
        showSecondary={showSecondary}
        inline={headerInline}
        formatColor={formatColor}
        audioSource={audioSource}
        audioCloseHandler={audioCloseHandler}
        inNativeApp={inNativeApp}
        onNavBarChange={onNavBarChange}
      />
      <noscript>
        <Box style={{padding: 30}}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('noscript')
            }} />
        </Box>
      </noscript>
      {raw ? (
        children
      ) : (
        <MainContainer>
          <Content>{children}</Content>
        </MainContainer>
      )}
    </div>
    {!inNativeApp && <Footer />}
  </div>
)

export default compose(
  withMe,
  withT,
  withInNativeApp
)(Index)
