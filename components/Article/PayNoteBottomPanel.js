import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { trackEventOnClick } from '../../lib/piwik'

import Close from 'react-icons/lib/md/close'
import {
  Center,
  mediaQueries
} from '@project-r/styleguide'
import { negativeColors } from '../Frame/Footer'
import {
  ZINDEX_BOTTOM_PANEL
} from '../constants'
import sharedStyles from '../sharedStyles'

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
    padding: '10px',
    '& svg': {
      width: 26,
      height: 26
    },
    [mediaQueries.mUp]: {
      '& svg': {
        width: 32,
        height: 32
      },
      padding: `${PADDING}px`
    }
  }),
  textContainer: css({
    maxHeight: `calc(50vh - 60px - ${IOS_BOTTOM_HOT_AREA}px)`,
    padding: PADDING,
    overflow: 'auto'
  }),
  actions: css({
    position: 'relative',
    boxShadow: `0 -5px ${PADDING - 5}px ${negativeColors.primaryBg}`,
    paddingLeft: PADDING,
    paddingRight: PADDING,
    [mediaQueries.onlyS]: {
      display: 'flex',
      flexDirection: 'column'
    },
    [mediaQueries.mUp]: {
      paddingBottom: PADDING + 5
    }
  }),
  later: css({
    display: 'none',
    [mediaQueries.onlyS]: {
      padding: 12,
      height: IOS_BOTTOM_HOT_AREA,
      paddingBottom: PADDING,
      display: 'block',
      textAlign: 'center',
      color: negativeColors.text
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
    const { t, children, button, expanded, variation } = this.props

    return (
      <div aria-expanded={expanded && this.state.expanded} {...styles.container}>
        <div {...styles.closeContainer}>
          <button
            {...sharedStyles.plainButton}
            {...styles.close}
            onClick={trackEventOnClick(['PayNote', 'close panel', variation], this.close)}
            title={t('article/payNote/bottomPanel/close')}
          >
            <Close fill={negativeColors.lightText} />
          </button>
        </div>
        <Center style={{ padding: 0 }}>
          <div {...styles.textContainer}>
            {children}
          </div>
          <div {...styles.actions}>
            {button}
            <button
              {...styles.later}
              {...sharedStyles.plainButton}
              onClick={trackEventOnClick(['PayNote', 'later panel', variation], this.close)}
            >
              {t('article/payNote/bottomPanel/actions/later')}
            </button>
          </div>
        </Center>
      </div>
    )
  }
}

BottomPanel.propTypes = {
  t: PropTypes.func.isRequired,
  children: PropTypes.node,
  expanded: PropTypes.bool
}

export default compose(
  withT
)(BottomPanel)
