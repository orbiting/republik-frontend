import React, { Component, useEffect, useState, useRef } from 'react'
import { compose } from 'react-apollo'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SUBHEADER_HEIGHT,
  ZINDEX_FEED_STICKY_SECTION_LABEL
} from '../constants'
import { css } from 'glamor'
import { mediaQueries, colors, useHeaderHeight } from '@project-r/styleguide'
import PropTypes from 'prop-types'
import { withTester } from '../Auth/checkRoles'

const SIDEBAR_WIDTH = 120
const MARGIN_WIDTH = 20
const STICKY_HEADER_HEIGHT = 27

const StickySection = ({ children, label, hasSpaceAfter, isTester }) => {
  const [sticky, setSticky] = useState(false)
  const [isMedium, setIsMedium] = useState(false)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const sectionRef = useRef(null)

  const [headerHeight] = useHeaderHeight()

  const onScroll = () => {
    if (sectionRef.current) {
      const y = window.pageYOffset + headerHeight
      const offset = sectionRef.current.offsetTop
      console.log(offset)
      const nextSticky =
        y > offset && // scroll pos is below top of section
        offset + height + (hasSpaceAfter ? STICKY_HEADER_HEIGHT : 0) > y // scroll pos is above bottom
      if (sticky !== nextSticky) {
        setSticky(nextSticky)
      }
    }
  }

  const measure = () => {
    const isMedium = window.innerWidth < mediaQueries.lBreakPoint
    if (sectionRef.current) {
      const { width, height } = sectionRef.current.getBoundingClientRect()
      setWidth(width)
      setHeight(height)
      setIsMedium(isMedium)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const stickyTopPosition = isTester
    ? headerHeight + SUBHEADER_HEIGHT
    : headerHeight

  return (
    <section ref={sectionRef}>
      <div {...style.header}>
        <div
          {...style.label}
          {...(sticky ? style.sticky : undefined)}
          style={{
            borderTop: sticky ? 'none' : '1px solid #000',
            top: sticky ? stickyTopPosition : undefined,
            position: sticky ? 'fixed' : 'relative',
            width: isMedium ? width : width ? SIDEBAR_WIDTH : '100%'
          }}
        >
          {label}
        </div>
      </div>
      {children}
    </section>
  )
}

const style = {
  header: css({
    backgroundColor: '#fff',
    margin: '0 0 30px 0',
    width: '100%',
    height: STICKY_HEADER_HEIGHT,
    [mediaQueries.lUp]: {
      height: 'auto',
      float: 'left',
      margin: `0 0 30px -${SIDEBAR_WIDTH + MARGIN_WIDTH}px`,
      width: SIDEBAR_WIDTH,
      '& > div': {
        width: SIDEBAR_WIDTH
      }
    }
  }),
  label: css({
    padding: '8px 0',
    borderTop: '1px solid #000',
    backgroundColor: '#fff',
    zIndex: ZINDEX_FEED_STICKY_SECTION_LABEL
  }),
  sticky: css({
    // top: HEADER_HEIGHT_MOBILE - 1,
    borderBottom: `0.5px solid ${colors.divider}`,
    // [mediaQueries.mUp]: {
    //   top: HEADER_HEIGHT - 1
    // },
    [mediaQueries.lUp]: {
      borderBottom: 'none'
    }
  })
}

StickySection.propTypes = {
  hasSpaceAfter: PropTypes.bool,
  label: PropTypes.string.isRequired
}

StickySection.defaultProps = {
  hasSpaceAfter: true
}

export default compose(withTester)(StickySection)
