// Derived from https://github.com/facebook/immutable-js/blob/7f4e61601d92fc874c99ccf7734d6f33239cec8c/pages/src/src/Header.js#L2

import React, { Fragment, Component } from 'react'
import { css } from 'glamor'
import { range } from 'd3-array'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

import {
  NarrowContainer,
  fontFamilies,
  mediaQueries,
  colors
} from '@project-r/styleguide'

const styles = {
  cover: css({
    position: 'fixed',
    left: 0,
    right: 0,
    fontFamily: fontFamilies.sansSerifMedium,
    backgroundColor: colors.primaryBg,
    top: HEADER_HEIGHT_MOBILE,
    height: 200,
    lineHeigt: 200,
    fontSize: 150,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT,
      height: 400,
      lineHeigt: 400,
      fontSize: 300
    }
  }),
  headline: css({
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center'
  }),
  secondary: css({
    color: colors.primary
  }),
  content: css({
    backgroundColor: '#fff',
    position: 'relative',
    zIndex: 1,
    marginTop: 200,
    [mediaQueries.mUp]: {
      marginTop: 400
    },
    paddingTop: 60,
    paddingBottom: 60
  })
}

class Header extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      scroll: 0,
      isMobile: true
    }

    this.handleResize = () => {
      const isMobile = window.innerWidth < mediaQueries.mBreakPoint
      if (isMobile !== this.state.isMobile) {
        this.setState({isMobile})
      }
    }
    this.handleScroll = () => {
      if (!this._req) {
        const headerHeight = window.innerHeight * 0.6
        if (window.scrollY < headerHeight) {
          this._req = window.requestAnimationFrame(() => {
            this._req = undefined
            this.setState({ scroll: window.scrollY })
          })
        }
      }
    }
  }
  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
    this.handleScroll()
    this.handleResize()
  }
  componentWillUnmount () {
    window.cancelAnimationFrame(this._req)
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
  }
  render () {
    const { children, statusCode } = this.props
    const { isMobile } = this.state
    const scroll = Math.max(this.state.scroll, 0)
    const space = isMobile ? 35 : 70

    return (
      <Fragment>
        <div {...styles.cover}>
          {(isMobile
            ? range(7)
            : range(11)
          ).map((_, i) => (
            <div key={i}
              {...styles.headline}
              {...styles.secondary}
              style={t(y(scroll, i * space), z(scroll, i * space))}>
              <span style={{opacity: o(scroll, i * space)}}>
                {statusCode}
              </span>
            </div>
          ))}
          <div {...styles.headline} style={t(scroll * -0.55, 1)}>
            <span>{statusCode}</span>
          </div>
        </div>
        <div {...styles.content}>
          <NarrowContainer>
            {children}
          </NarrowContainer>
        </div>
      </Fragment>
    )
  }
}

const y = (scroll, pos) => {
  return (pos < scroll ? pos : scroll) * -0.55
}

const o = (scroll, pos) => {
  return Math.max(
    0,
    scroll > pos
      ? 1 - (scroll - pos) / 350
      : 1
  )
}

const z = (scroll, pos) => {
  return Math.max(0, scroll > pos ? 1 - (scroll - pos) / 20000 : 1)
}

const t = (y, z) => {
  const transform = `translate3d(0, ${y}px, 0) scale(${z})`
  return {
    transform: transform,
    WebkitTransform: transform,
    MozTransform: transform,
    msTransform: transform,
    OTransform: transform
  }
}

export default Header
