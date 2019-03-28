import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import DownIcon from 'react-icons/lib/md/arrow-downward'
import Close from 'react-icons/lib/md/close'

import datetime from './datetime'

import withT from '../../../lib/withT'
import { swissNumbers } from '../../../lib/utils/format'

import sharedStyles from '../../sharedStyles'

import {
  ProgressCircle,
  colors,
  mediaQueries
} from '@project-r/styleguide'

const RADIUS = 16
const formatPercent = swissNumbers.format('.0%')
const paddingRight = 15
const BUTTON_ICON_SIZE = 20

const styles = {
  container: css({
    background: '#fff',
    borderTop: `1px solid ${colors.divider}`,
    cursor: 'pointer',
    color: colors.text,
    position: 'fixed',
    zIndex: 10,
    bottom: 0,
    // transition: `opacity 300ms ease-in-out`,
    textAlign: 'center',
    padding: `${RADIUS + 5}px ${paddingRight}px 20px 15px`,
    width: '100%',
    [mediaQueries.mUp]: {
      paddingBottom: 20
    }
  }),
  button: css({
    backgroundColor: '#fff',
    boxShadow: '0 0 0px 1px rgba(255, 255, 255, .25)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -RADIUS,
    left: `calc(50% - ${RADIUS}px)`,
    width: `${RADIUS * 2}px`,
    height: `${RADIUS * 2}px`,
    borderRadius: `${RADIUS}px`,
    padding: 0
  }),
  buttonIcon: css({
    position: 'absolute',
    width: BUTTON_ICON_SIZE,
    height: BUTTON_ICON_SIZE,
    top: `calc(50% - ${BUTTON_ICON_SIZE / 2}px)`,
    left: `calc(50% - ${BUTTON_ICON_SIZE / 2}px)`
  }),
  close: css({
    position: 'absolute',
    padding: 10,
    right: 0,
    top: 0,
    '& svg': {
      width: 26,
      height: 26
    },
    [mediaQueries.mUp]: {
      '& svg': {
        width: 32,
        height: 32
      },
      padding: 15
    }
  }),
  label: css({
    marginBottom: 5,
    fontSize: 16,
    [mediaQueries.mUp]: {
      fontSize: 19,
      marginBottom: 10
    }
  }),
  note: css({
    color: colors.lightText,
    fontSize: 16,
    [mediaQueries.mUp]: {
      fontSize: 19
    }
  })
}

class RestoreButton extends React.Component {
  render () {
    const { t, onClick, onClose, opacity, userProgress } = this.props

    const title = t('progress/restore/title', {
      percent: formatPercent(userProgress.percentage)
    })

    return (
      <div {...styles.container} style={{ opacity }} onClick={onClick}>
        <button {...sharedStyles.plainButton} {...styles.button}>
          <ProgressCircle
            progress={userProgress.percentage * 100}
            stroke='#000'
            strokePlaceholder='#e9e9e9'
            radius={RADIUS}
            strokeWidth={3} />
          <DownIcon {...styles.buttonIcon} fill='#000' />
        </button>
        <div {...styles.label}>
          {title}
        </div>
        <div {...styles.note}>
          {datetime(t, new Date(userProgress.updatedAt), 'progress/restore')}
        </div>
        <button
          {...styles.close}
          {...sharedStyles.plainButton}
          onClick={onClose}
          title={t('progress/restore/close')}
        >
          <Close fill='#ccc' />
        </button>
      </div>
    )
  }
}

RestoreButton.propTypes = {
  t: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
  updatedAt: PropTypes.string
}

export default withT(RestoreButton)
