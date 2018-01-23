import React, { Component } from 'react'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'

import withMe from '../../lib/apollo/withMe'
import { Router } from '../../lib/routes'

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
const LOGO_WIDTH = 203
const LOGO_WIDTH_MOBILE = 162

const styles = {
  bar: css({
    zIndex: ZINDEX_HEADER,
    '@media print': {
      position: 'absolute'
    },
    top: 0,
    left: 0,
    right: 0
  }),
  barOpaque: css({
    backgroundColor: '#fff',
    boxSizing: 'content-box',
    height: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT
    },
    '@media print': {
      borderBottom: 0,
      backgroundColor: 'transparent'
    }
  }),
  center: css({
    margin: '0 auto 0',
    padding: '0 60px',
    textAlign: 'center',
    opacity: 1,
    transition: 'opacity .2s ease-in-out',
    '[data-show-secondary] > &': {
      opacity: 0
    }
  }),
  logo: css({
    display: 'inline-block',
    marginTop: `${Math.floor((HEADER_HEIGHT_MOBILE - LOGO_HEIGHT_MOBILE) / 2)}px`,
    width: `${LOGO_WIDTH_MOBILE}px`,
    [mediaQueries.mUp]: {
      marginTop: `${Math.floor((HEADER_HEIGHT - LOGO_HEIGHT) / 2)}px`,
      width: `${LOGO_WIDTH}px`
    },
    verticalAlign: 'middle'
  }),
  user: css({
    '@media print': {
      display: 'none'
    },
    opacity: 1,
    transition: 'opacity .2s ease-in-out',
    '[data-show-secondary] > &': {
      opacity: 0
    }
  }),
  hamburger: css({
    '@media print': {
      display: 'none'
    },
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
  }),
  secondary: css({
    position: 'absolute',
    top: 0,
    left: '15px',
    display: 'inline-block',
    height: HEADER_HEIGHT_MOBILE,
    right: `${HEADER_HEIGHT_MOBILE}px`,
    paddingTop: '11px',
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT,
      right: `${HEADER_HEIGHT}px`,
      paddingTop: '24px'
    },
    opacity: 0,
    transition: 'opacity .2s ease-in-out',
    '[data-show-secondary] > &': {
      opacity: 1,
      zIndex: 99
    }
  })
}

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      opaque: !this.props.cover,
      mobile: false,
      expanded: false,
      sticky: !this.props.inline
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const yOpaque = this.state.mobile ? 70 : 150
      const opaque = y > yOpaque || !this.props.cover
      if (opaque !== this.state.opaque) {
        this.setState(() => ({ opaque }))
      }

      if (this.props.inline && this.ref) {
        const sticky = y + HEADER_HEIGHT > this.y + this.barHeight
        if (sticky !== this.state.sticky) {
          this.setState(() => ({ sticky }))
        }
      }
    }

    this.measure = () => {
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      if (mobile !== this.state.mobile) {
        this.setState(() => ({ mobile }))
      }
      if (this.props.inline && this.ref) {
        const rect = this.ref.getBoundingClientRect()
        this.y = window.pageYOffset + rect.top
        this.barHeight = rect.height
      }
      this.onScroll()
    }

    this.setRef = ref => {
      this.ref = ref
    }

    this.close = () => {
      this.setState({ expanded: false })
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
    const {
      url,
      me,
      cover,
      secondaryNav,
      showSecondary,
      inline,
      onPrimaryNavExpandedChange,
      primaryNavExpanded,
      formatColor
    } = this.props
    const { expanded, sticky } = this.state

    // If onPrimaryNavExpandedChange is defined, expanded state management is delegated
    // up to the higher-order component. Otherwise it's managed inside the component.
    const expand = onPrimaryNavExpandedChange ? primaryNavExpanded : expanded

    const opaque = this.state.opaque || expanded || inline
    const barStyle = opaque ? merge(styles.bar, styles.barOpaque) : styles.bar
    const marginBottom = sticky
      ? this.state.mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT
      : undefined
    const position = sticky || !inline ? 'fixed' : 'relative'
    const borderBottom = formatColor && !expand ? `3px solid ${formatColor}` : `1px solid ${colors.divider}`
    const data = showSecondary ? { 'data-show-secondary': true } : {}

    // The logo acts as a toggle between front and feed page when user's logged in.
    const logoRoute = url.pathname === '/' && me ? 'feed' : 'index'
    const logoLinkPath = logoRoute === 'feed' ? '/feed' : '/'

    return (
      <div ref={this.setRef}>
        {!!cover && inline && <div {...styles.cover} style={{marginBottom}}>{cover}</div>}
        <div {...barStyle} {...data} style={{position, borderBottom}}>
          {showSecondary &&
          secondaryNav && <div {...styles.secondary}>{secondaryNav}</div>}
          {opaque && (
            <div {...styles.user}>
              <User
                me={me}
                onclickHandler={() => {
                  if (onPrimaryNavExpandedChange) {
                    onPrimaryNavExpandedChange(!expand)
                  } else {
                    this.setState({ expanded: !expand })
                  }
                }}
              />
            </div>
          )}
          {opaque && (
            <div {...styles.center}>
              <a
                {...styles.logo}
                href={logoLinkPath}
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
                  if (url.pathname === '/' && !me) {
                    window.scrollTo(0, 0)
                  } else {
                    Router.pushRoute(logoRoute).then(() => window.scrollTo(0, 0))
                  }
                }}
              >
                <Logo />
              </a>
            </div>
          )}
          {opaque && (
            <div {...styles.hamburger}>
              <Toggle
                expanded={!!expand}
                id='primary-menu'
                onClick={() => {
                  if (onPrimaryNavExpandedChange) {
                    onPrimaryNavExpandedChange(!expand)
                  } else {
                    this.setState({ expanded: !expand })
                  }
                }
              }
              />
            </div>
          )}
          <Popover expanded={!!expand}>
            <NavPopover me={me} url={url} closeHandler={this.close} />
          </Popover>
        </div>

        <LoadingBar />
        {!!cover && !inline && <div {...styles.cover}>{cover}</div>}
      </div>
    )
  }
}

export default compose(withMe)(Header)
