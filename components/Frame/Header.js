import React, { Component } from 'react'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'

import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { Router } from '../../lib/routes'

import { AudioPlayer, Logo, colors, mediaQueries } from '@project-r/styleguide'

import Toggle from './Toggle'
import User from './User'
import Popover from './Popover'
import NavPopover from './Popover/Nav'
import LoadingBar from './LoadingBar'

import Search from 'react-icons/lib/md/search'

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
    height: HEADER_HEIGHT_MOBILE - 1,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT - 1
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
    transition: 'opacity .2s ease-in-out'
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
    transition: 'opacity .2s ease-in-out'
  }),
  hamburger: css({
    '@media print': {
      display: 'none'
    },
    background: '#fff',
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    right: 0,
    display: 'inline-block',
    marginTop: '1px',
    height: HEADER_HEIGHT_MOBILE - 2,
    width: HEADER_HEIGHT_MOBILE - 2 + 5,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT - 2,
      width: HEADER_HEIGHT - 2 + 5
    }
  }),
  search: css({
    '@media print': {
      display: 'none'
    },
    background: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    right: HEADER_HEIGHT_MOBILE - 2 + 5,
    marginTop: '1px',
    height: HEADER_HEIGHT_MOBILE - 2,
    width: HEADER_HEIGHT_MOBILE - 2 + 5,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT - 2,
      width: HEADER_HEIGHT - 2 - 10,
      right: HEADER_HEIGHT - 2 + 5
    }
  }),
  secondary: css({
    position: 'absolute',
    top: 0,
    left: 15,
    display: 'inline-block',
    height: HEADER_HEIGHT_MOBILE,
    right: `${HEADER_HEIGHT_MOBILE}px`,
    paddingTop: '11px',
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT,
      right: `${HEADER_HEIGHT}px`,
      paddingTop: '24px'
    },
    transition: 'opacity .2s ease-in-out'
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
      t,
      me,
      cover,
      secondaryNav,
      showSecondary,
      inline,
      onPrimaryNavExpandedChange,
      primaryNavExpanded,
      formatColor,
      audioSource,
      audioCloseHandler
    } = this.props
    const { expanded, sticky } = this.state

    // If onPrimaryNavExpandedChange is defined, expanded state management is delegated
    // up to the higher-order component. Otherwise it's managed inside the component.
    const expand = onPrimaryNavExpandedChange ? primaryNavExpanded : expanded
    const secondaryVisible = showSecondary && !expand

    const opaque = this.state.opaque || expanded || inline
    const barStyle = opaque ? merge(styles.bar, styles.barOpaque) : styles.bar
    const marginBottom = sticky
      ? this.state.mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT
      : undefined
    const position = sticky || !inline ? 'fixed' : 'relative'
    const borderBottom = formatColor && !expand ? `3px solid ${formatColor}` : `1px solid ${colors.divider}`

    // The logo acts as a toggle between front and feed page when user's logged in.
    const logoRoute = url.pathname === '/' && me ? 'feed' : 'index'
    const logoLinkPath = logoRoute === 'feed' ? '/feed' : '/'
    const logoAriaLabel = logoRoute === 'feed' ? t('header/logo/feed/aria') : t('header/logo/magazine/aria')

    return (
      <div ref={this.setRef}>
        {!!cover && inline && <div {...styles.cover} style={{marginBottom}}>{cover}</div>}
        <div {...barStyle} style={{position, borderBottom}}>
          {secondaryNav && !audioSource && (
            <div {...styles.secondary} style={{opacity: secondaryVisible ? 1 : 0, zIndex: secondaryVisible ? 99 : undefined}}>
              {secondaryNav}
            </div>
          )}
          {opaque && (
            <div {...styles.user} style={{opacity: secondaryVisible ? 0 : 1}}>
              <User
                me={me}
                title={expand ? t('header/nav/close/aria') : t('header/nav/open/aria')}
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
            <div {...styles.center} style={{opacity: secondaryVisible ? 0 : 1}}>
              <a
                {...styles.logo}
                aria-label={logoAriaLabel}
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
          {opaque && !url.query.hasOwnProperty('search') && (
            <div {...styles.search} role='button' title={t('header/nav/search/aria')}>
              <Search
                fill={colors.text}
                size={28}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  Router.pushRoute('feed', {'search': ''}).then(() => window.scrollTo(0, 0))
                }} />
            </div>
          )}
          {opaque && (
            <div {...styles.hamburger}>
              <Toggle
                expanded={!!expand}
                id='primary-menu'
                title={expand ? t('header/nav/close/aria') : t('header/nav/open/aria')}
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
          {audioSource && (
            <AudioPlayer
              src={audioSource}
              closeHandler={() => { audioCloseHandler && audioCloseHandler() }}
              autoPlay
              download
              scrubberPosition='bottom'
              timePosition='left'
              t={t}
              style={{backgroundColor: '#fff', position: 'absolute', width: '100%', bottom: 0}}
              controlsPadding={this.state.mobile ? 10 : 20}
              height={this.state.mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT}
            />
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

export default compose(withMe, withT)(Header)
