import React from 'react'
import { css } from 'glamor'

import { mediaQueries, useMediaQuery } from '@project-r/styleguide'

import { useWindowSize } from '../../lib/hooks/useWindowSize'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

import Footer from './Footer'

const styles = {
  container: css({
    position: 'relative',
    background: '#DEEFF5',
    overflow: 'hidden',
    // overscrollBehaviorY: 'contain',
    width: '100%',
    paddingBottom: 20
  }),
  minHeight: css({
    minHeight: `calc(100vh - ${HEADER_HEIGHT_MOBILE}px)`,
    [mediaQueries.mUp]: {
      minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`
    }
  }),
  height: css({
    height: `calc(100vh - ${HEADER_HEIGHT_MOBILE}px)`,
    [mediaQueries.mUp]: {
      height: `calc(100vh - ${HEADER_HEIGHT}px)`
    }
  })
}

const Container = ({ children, style = {} }) => {
  const heightStyle = {}
  const heightKey = style.minHeight
    ? 'height'
    : 'minHeight'
  const isDesktop = useMediaQuery(mediaQueries.mUp)
  const height = useWindowSize()[1]
  if (height) {
    heightStyle[heightKey] = height - (isDesktop ? HEADER_HEIGHT : HEADER_HEIGHT_MOBILE)
  }

  return (
    <div
      {...styles.container}
      {...styles[heightKey]}
      style={{ ...heightStyle, ...style }}>
      {children}
      <Footer />
    </div>
  )
}

export default Container
