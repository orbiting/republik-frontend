import React from 'react'
import Head from 'next/head'
import { Container, fontFamilies } from '@project-r/styleguide'
import Header from './Header'
import Footer from './Footer'
import { HEADER_HEIGHT } from '../constants'
import { css } from 'glamor'
import withT from '../../lib/withT'

import 'glamor/reset'

css.global('html', { boxSizing: 'border-box' })
css.global('*, *:before, *:after', { boxSizing: 'inherit' })

css.global('body', {
  fontFamily: fontFamilies.sansSerifRegular
})

const Index = ({ t, children, url, raw, nav }) =>
  <main>
    <Head>
      <title>{t('header/title')}</title>
    </Head>
    <Header url={url}>{nav}</Header>
    <div style={{paddingTop: HEADER_HEIGHT}}>
      {raw
        ? children
        : (
          <Container style={{maxWidth: '840px'}}>
            <div style={{paddingTop: 40, paddingBottom: 20}}>
              {children}
            </div>
          </Container>
        )
      }
    </div>
    <Footer />
  </main>

export default withT(Index)
