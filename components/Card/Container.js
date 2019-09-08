import React from 'react'
import { css } from 'glamor'

import { withMembership } from '../Auth/checkRoles'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE, NAVBAR_HEIGHT, NAVBAR_HEIGHT_MOBILE } from '../constants'
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
    minHeight: `calc(100vh - ${HEADER_HEIGHT_MOBILE + 1}px)`,
    [mediaQueries.mUp]: {
      minHeight: `calc(100vh - ${HEADER_HEIGHT + 1}px)`
    }
  }),
  minMemberHeight: css({
    minHeight: `calc(100vh - ${HEADER_HEIGHT_MOBILE + NAVBAR_HEIGHT_MOBILE + 1}px)`,
    [mediaQueries.mUp]: {
      minHeight: `calc(100vh - ${HEADER_HEIGHT + NAVBAR_HEIGHT + 1}px)`
    }
  }),
  height: css({
    height: `calc(100vh - ${HEADER_HEIGHT_MOBILE + 1}px)`,
    [mediaQueries.mUp]: {
      height: `calc(100vh - ${HEADER_HEIGHT + 1}px)`
    }
  }),
  memberHeight: css({
    height: `calc(100vh - ${HEADER_HEIGHT_MOBILE + NAVBAR_HEIGHT_MOBILE + 1}px)`,
    [mediaQueries.mUp]: {
      height: `calc(100vh - ${HEADER_HEIGHT + NAVBAR_HEIGHT + 1}px)`
    }
  })
}

const Container = ({ children, style = {}, isMember }) => {
  const heightKey = style.minHeight
    ? isMember ? 'memberHeight' : 'height'
    : isMember ? 'minMemberHeight' : 'minHeight'
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
