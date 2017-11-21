import React, { Component } from 'react'
import { css, merge } from 'glamor'
import Router from 'next/router'
import { compose } from 'redux'
import withMe from '../../lib/apollo/withMe'
import { Logo, colors, mediaQueries } from '@project-r/styleguide'
import Toggle from './Toggle'
import User from './User'
import Popover from './Popover'
import NavPopover from './Popover/Nav'
import LoadingBar from './LoadingBar'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  ZINDEX_HEADER
} from '../constants'

const LOGO_HEIGHT = 30
const LOGO_HEIGHT_MOBILE = 24

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
  center: css({
    margin: '0 auto 0',
    padding: '0 60px',
    textAlign: 'center'
  }),
  logo: css({
    display: 'inline-block',
    marginTop: `${(HEADER_HEIGHT_MOBILE - LOGO_HEIGHT_MOBILE) / 2}px`,
    [mediaQueries.mUp]: {
      marginTop: `${(HEADER_HEIGHT - LOGO_HEIGHT) / 2}px`
    },
    verticalAlign: 'middle'
  }),
  hamburger: css({
    background: '#fff',
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'inline-block',
    marginTop: '1px',
    height: HEADER_HEIGHT_MOBILE - 2,
    width: HEADER_HEIGHT_MOBILE - 2,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT - 2,
      width: HEADER_HEIGHT - 2
    }
  })
}

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      opaque: !this.props.cover,
      mobile: false,
      expanded: false
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const yOpaque = this.state.mobile ? 70 : 150
      const opaque = y > yOpaque || !this.props.cover
      if (opaque !== this.state.opaque) {
        this.setState(() => ({ opaque }))
      }
    }

    this.measure = () => {
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      if (mobile !== this.state.mobile) {
        this.setState(() => ({ mobile }))
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
    const { url, me, cover } = this.props
    const { mobile, expanded } = this.state
    const opaque = this.state.opaque || expanded
    const logoHeight = mobile ? LOGO_HEIGHT_MOBILE : LOGO_HEIGHT
    const barStyle = opaque ? merge(styles.bar, styles.barOpaque) : styles.bar

    return (
      <div>
        <div {...barStyle}>
          {opaque && (
            <User
              me={me}
              onclickHandler={() => {
                this.setState(() => ({
                  expanded: !expanded
                }))
              }}
            />
          )}
          {opaque && (
            <div {...styles.center}>
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
            </div>
          )}
          {opaque && (
            <div {...styles.hamburger}>
              <Toggle
                expanded={!!expanded}
                id='primary-menu'
                size={mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT}
                onClick={() => this.setState({ expanded: !expanded })}
              />
            </div>
          )}
          <Popover expanded={!!expanded}>
            <NavPopover me={me} />
          </Popover>
        </div>

        <LoadingBar />
        {!!cover && <div {...styles.cover}>{cover}</div>}
      </div>
    )
  }
}

export default compose(withMe)(Header)
