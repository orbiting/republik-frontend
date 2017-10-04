import React, { Component } from 'react'
import { css } from 'glamor'
import Router from 'next/router'
import { compose } from 'redux'

import { getInitials } from '../../lib/utils/name'
import withMe from '../../lib/apollo/withMe'

import {
  BrandMark,
  colors
} from '@project-r/styleguide'

import Toggle from './Toggle'
import Popover from './Popover'
import MePopover from './Popover/Me'

import LoadingBar from './LoadingBar'
import { HEADER_HEIGHT, ZINDEX_HEADER } from './constants'

const styles = {
  bar: css({
    zIndex: ZINDEX_HEADER,
    position: 'fixed',
    '@media print': {
      position: 'absolute'
    },
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    height: HEADER_HEIGHT,
    borderBottom: `1px solid ${colors.divider}`,
    whiteSpace: 'nowrap'
  }),
  left: css({
    paddingTop: 15,
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
    width: 50,
    display: 'inline-block',
    float: 'left',
    marginRight: 20,
    verticalAlign: 'top',
    lineHeight: 0
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
    verticalAlign: 'top',
    textAlign: 'center',
    backgroundColor: '#ccc',
    color: '#000',
    textTransform: 'uppercase',
    width: HEADER_HEIGHT - 1,
    height: HEADER_HEIGHT - 1,
    paddingTop: 28,
    fontSize: 20
  })
}

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      popover: null
    }
  }
  render () {
    const { url, me, children } = this.props
    const { popover } = this.state

    const { repository } = url.query

    const barStyle = styles.bar

    return (
      <div>
        <div {...barStyle}>
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
              <BrandMark />
            </a>
            {!!repository &&
              <span {...styles.repoName}>
                {repository}
              </span>
            }
            <br />
            {children}
          </div>
          {!!me && <div {...styles.right}>
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
                    {getInitials(me)}
                  </span>
                  )
              }
            </a>
          </div>}
          <Popover expanded={!!popover}>
            <MePopover me={me}>
              <span style={{ float: 'right', marginTop: 5 }}>
                <Toggle
                  expanded
                  onClick={() => this.setState({ popover: null })}
                  />
              </span>
            </MePopover>
          </Popover>
        </div>
        <LoadingBar />
      </div>
    )
  }
}

export default compose(
  withMe
)(Header)
