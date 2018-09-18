import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withInNativeApp from '../../lib/withInNativeApp'
import withT from '../../lib/withT'

import Close from 'react-icons/lib/md/close'
import {
  Center,
  mediaQueries
} from '@project-r/styleguide'
import { negativeColors } from '../Frame/Footer'
import {
  ZINDEX_BOTTOM_PANEL
} from '../constants'

const PADDING = 15
const IOS_BOTTOM_HOT_AREA = 44

const styles = {
  container: css({
    backgroundColor: negativeColors.primaryBg,
    color: negativeColors.text,
    position: 'fixed',
    zIndex: ZINDEX_BOTTOM_PANEL,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    visibility: 'hidden',
    transition: 'opacity 0.2s ease-in-out, visibility 0s linear 0.2s',
    '&[aria-expanded=true]': {
      opacity: 1,
      visibility: 'visible',
      transition: 'opacity 0.2s ease-in-out'
    },
    maxHeight: '50vh',
    overflow: 'hidden'
  }),
  closeContainer: css({
    height: '40px',
    position: 'absolute',
    top: 0,
    right: 0
  }),
  close: css({
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    outline: 'none',
    WebkitAppearance: 'none',
    padding: '10px',
    [mediaQueries.mUp]: {
      padding: `${PADDING}px`
    }
  })
}

class BottomPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: true
    }

    this.close = () => {
      this.setState({ expanded: false })
    }
  }

  render () {
    const { t, inNativeIOSApp, children, expanded } = this.props
    const paddingBottom = inNativeIOSApp
      ? undefined
      : `${IOS_BOTTOM_HOT_AREA - PADDING}px` // Center comes with bottom padding.

    return (
      <div aria-expanded={expanded && this.state.expanded} {...styles.container} style={{ paddingBottom }}>
        <div {...styles.closeContainer}>
          <button
            {...styles.close}
            onClick={this.close}
            title={t('article/bottomPanel/close')}
          >
            <Close size={32} fill={negativeColors.lightText} />
          </button>
        </div>
        <Center>
          {children}
        </Center>
      </div>
    )
  }
}

BottomPanel.propTypes = {
  t: PropTypes.func.isRequired,
  inNativeIOSApp: PropTypes.bool,
  children: PropTypes.node,
  expanded: PropTypes.bool
}

export default compose(
  withT,
  withInNativeApp
)(BottomPanel)
