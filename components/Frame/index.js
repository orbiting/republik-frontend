import React from 'react'
import { Container, fontFamilies, mediaQueries } from '@project-r/styleguide'
import Meta from './Meta'
import Header from './Header'
import Footer from './Footer'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { css } from 'glamor'
import withT from '../../lib/withT'

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
  coverless: css({
    paddingTop: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      paddingTop: HEADER_HEIGHT
    }
  }),
  bodyGrower: css({
    flexGrow: 1
  })
}

export const MainContainer = ({children}) =>
  <Container style={{ maxWidth: '840px' }}>
    {children}
  </Container>

const Index = ({
  t,
  children,
  url,
  raw,
  meta,
  nav,
  cover,
  secondaryNav,
  showSecondary
}) => (
  <div {...styles.container}>
    <div
      {...styles.bodyGrower}
      className={!cover ? styles.coverless : undefined}
    >
      {!!meta && <Meta data={meta} />}
      <Header
        url={url}
        cover={cover}
        secondaryNav={secondaryNav}
        showSecondary={showSecondary}
      />
      {raw ? (
        children
      ) : (
        <MainContainer>
          <div style={{ paddingTop: 80, paddingBottom: 120 }}>{children}</div>
        </MainContainer>
      )}
    </div>
    <Footer />
  </div>
)

export default withT(Index)
