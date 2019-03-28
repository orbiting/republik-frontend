import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import datetime from './datetime'
import withT from '../../../lib/withT'
import Icon from 'react-icons/lib/md/arrow-downward'
import { negativeColors } from '../../Frame/constants'

import { swissNumbers } from '../../../lib/utils/format'

import {
  colors,
  mediaQueries
} from '@project-r/styleguide'

const RADIUS = 16
const formatPercent = swissNumbers.format('.0%')

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
    padding: `${RADIUS + 5}px 15px 20px 15px`,
    width: '100%',
    [mediaQueries.mUp]: {
      paddingBottom: 20
    }
  }),
  button: css({
    cursor: 'pointer',
    backgroundColor: negativeColors.primaryBg,
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
    border: 'none',
    outline: 'none'
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
    const { t, onClick, opacity, userProgress } = this.props

    const title = t('progress/restore/title', {
      percent: formatPercent(userProgress.percentage)
    })

    return (
      <div {...styles.container} style={{ opacity }} onClick={onClick}>
        <button {...styles.button}>
          <Icon size={RADIUS * 1.5} fill={negativeColors.text} />
        </button>
        <div {...styles.label}>
          {title}
        </div>
        <div {...styles.note}>
          {datetime(t, new Date(userProgress.updatedAt), 'progress/restore')}
        </div>
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
