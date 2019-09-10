import React from 'react'
import { css } from 'glamor'

import { withMembership } from '../Auth/checkRoles'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { mediaQueries } from '@project-r/styleguide'

import Footer from './Footer'

const styles = {
  container: css({
    position: 'relative',
    background: '#add8e666',
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

const Container = ({ children, style = {}, isMember }) => {
  const heightKey = style.minHeight
    ? 'height'
    : 'minHeight'
  return (
    <div
      {...styles.container}
      {...styles[heightKey]}
      style={style}>
      {children}
      <Footer />
    </div>
  )
}

export default withMembership(Container)
