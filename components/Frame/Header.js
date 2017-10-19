import React, { Component } from 'react'
import { css, merge } from 'glamor'
import Router from 'next/router'
import { compose } from 'redux'

import withMe from '../../lib/apollo/withMe'

import {
  Logo,
  colors,
  mediaQueries
} from '@project-r/styleguide'

import Toggle from './Toggle'
import Popover from './Popover'
import MePopover from './Popover/Me'

import LoadingBar from './LoadingBar'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE, ZINDEX_HEADER } from '../constants'

const styles = {
  bar: css({
    zIndex: ZINDEX_HEADER,
    position: 'fixed',
    '@media print': {
      position: 'absolute'
    },
    top: 0,
    left: 0,
    right: 0
  }),
  barOpaque: css({
    backgroundColor: '#fff',
    height: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT
    },
    borderBottom: `1px solid ${colors.divider}`
  }),
  left: css({
    paddingLeft: 15,
    display: 'inline-block',
    minWidth: '75%',
    verticalAlign: 'top'
  }),
  right: css({
    display: 'inline-block',
    minWidth: '25%',
    textAlign: 'right'
  }),
  logo: css({
    display: 'inline-block',
    marginTop: '15px',
    [mediaQueries.mUp]: {
      marginTop: '25px'
    },
    verticalAlign: 'middle'
  }),
  menu: css({
    display: 'inline-block',
    paddingLeft: '20px',
    marginTop: '10px',
    [mediaQueries.mUp]: {
      marginTop: '20px'
    },
    verticalAlign: 'middle'
  }),
  repoName: css({
    marginLeft: 8,
    display: 'inline-block',
    fontSize: 22
  }),
  portrait: css({
    height: HEADER_HEIGHT - 1,
    marginLeft: 5,
    verticalAlign: 'top'
  }),
  initials: css({
    display: 'inline-block',
    marginLeft: 5,
    verticalAlign: 'center',
    textAlign: 'center',
    backgroundColor: '#ccc',
    color: '#000',
    textTransform: 'uppercase',
    height: HEADER_HEIGHT_MOBILE - 1,
    width: HEADER_HEIGHT_MOBILE - 1,
    paddingTop: 16,
    fontSize: 16,
    [mediaQueries.mUp]: {
      fontSize: 20,
      height: HEADER_HEIGHT - 1,
      paddingTop: 28,
      width: HEADER_HEIGHT - 1
    }
  })
}

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      opaque: !this.props.cover,
      mobile: false,
      popover: null
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const yOpaque = this.state.mobile ? 70 : 150
      const opaque = y > yOpaque || !this.props.cover
      if (opaque !== this.state.opaque) {
        this.setState(() => ({opaque}))
      }
    }

    this.measure = () => {
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      if (mobile !== this.state.mobile) {
        this.setState(() => ({mobile}))
      }
      this.onScroll()
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate () {
    this.measure()
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }
  render () {
    const { url, me, children, cover } = this.props
    const { opaque, mobile, popover } = this.state

    const logoHeight = mobile ? 18 : 30

    const barStyle = opaque
      ? merge(styles.bar, styles.barOpaque)
      : styles.bar

    return (
      <div>
        <div {...barStyle}>
          {opaque &&
          <div {...styles.left}>
            <a
              {...styles.logo}
              href='/'
              onClick={e => {
                if (
                  e.currentTarget.nodeName === 'A' &&
                  (e.metaKey ||
                    e.ctrlKey ||
                    e.shiftKey ||
                    (e.nativeEvent && e.nativeEvent.which === 2))
                ) {
                  // ignore click for new tab / new window behavior
                  return
                }
                e.preventDefault()
                if (url.pathname === '/') {
                  window.scrollTo(0, 0)
                } else {
                  Router.push('/').then(() => window.scrollTo(0, 0))
                }
              }}
            >
              <Logo height={logoHeight} />
            </a>
            <span {...styles.menu}>
              {children}
            </span>
          </div>}
          {opaque && !!me && <div {...styles.right}>
            <a
              href='/'
              onClick={e => {
                e.preventDefault()
                this.setState(() => ({
                  popover: popover === 'me' ? null : 'me'
                }))
              }}
            >
              {me.portrait
                ? <img src={me.portrait.url} {...styles.portrait} />
                : (
                  <span {...styles.initials}>
                    {me.initials}
                  </span>
                  )
              }
            </a>
          </div>}
          <Popover expanded={!!popover}>
            <MePopover me={me}>
              <span style={{ position: 'absolute', right: '10px', top: '10px' }}>
                <Toggle
                  expanded
                  onClick={() => this.setState({ popover: null })}
                  />
              </span>
            </MePopover>
          </Popover>
        </div>
        <LoadingBar />
        {!!cover && (
          <div {...styles.cover}>
            {cover}
          </div>
        )}
      </div>
    )
  }
}

export default compose(
  withMe
)(Header)
