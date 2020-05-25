import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { MdArrowDownward, MdClose } from 'react-icons/md'

import datetime from './datetime'

import withT from '../../../lib/withT'
import { swissNumbers } from '../../../lib/utils/format'

import sharedStyles from '../../sharedStyles'

import {
  ProgressCircle,
  mediaQueries,
  useColorContext
} from '@project-r/styleguide'

const RADIUS = 16
const formatPercent = swissNumbers.format('.0%')
const paddingRight = 15
const BUTTON_ICON_SIZE = 20

const styles = {
  container: css({
    '@media print': {
      display: 'none'
    },
    cursor: 'pointer',
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
    fontSize: 16,
    [mediaQueries.mUp]: {
      fontSize: 19
    }
  })
}

const RestoreButton = ({ t, onClick, onClose, opacity, userProgress }) => {
  const [colorScheme] = useColorContext()
  const colors = {
    container: css({
      background: colorScheme.containerBg,
      borderTop: `1px solid ${colorScheme.divider}`,
      color: colorScheme.text
    }),
    button: css({
      backgroundColor: colorScheme.containerBg
    }),
    note: css({
      color: colorScheme.lightText
    })
  }
  const title = t('progress/restore/title', {
    percent: formatPercent(userProgress.percentage)
  })

  return (
    <div
      {...styles.container}
      {...colors.container}
      style={{ opacity }}
      onClick={onClick}
    >
      <button
        {...sharedStyles.plainButton}
        {...styles.button}
        {...colors.button}
      >
        <ProgressCircle
          progress={userProgress.percentage * 100}
          stroke={colorScheme.fill}
          strokePlaceholder={colorScheme.lightFill}
          radius={RADIUS}
          strokeWidth={3}
        />
        <MdArrowDownward {...styles.buttonIcon} fill={colorScheme.fill} />
      </button>
      <div {...styles.label}>{title}</div>
      <div {...styles.note} {...colors.note}>
        {datetime(t, new Date(userProgress.updatedAt), 'progress/restore')}
      </div>
      <button
        {...styles.close}
        {...sharedStyles.plainButton}
        onClick={onClose}
        title={t('progress/restore/close')}
      >
        <MdClose fill='#ccc' />
      </button>
    </div>
  )
}

RestoreButton.propTypes = {
  t: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
  updatedAt: PropTypes.string
}

export default withT(RestoreButton)
