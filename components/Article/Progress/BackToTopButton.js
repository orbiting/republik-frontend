import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import datetime from './datetime'
import withT from '../../../lib/withT'
import UpIcon from 'react-icons/lib/md/arrow-upward'
import { negativeColors } from '../../Frame/constants'
import { ZINDEX_BOTTOM_PANEL } from '../../constants'

import {
  colors,
  mediaQueries
} from '@project-r/styleguide'

const ANIMATE_OUT_DURATION_SECS = 0.3
const RADIUS = 16

const styles = {
  container: css({
    background: '#fff',
    borderTop: `1px solid ${colors.divider}`,
    color: colors.text,
    position: 'fixed',
    bottom: 0,
    transition: `opacity ${ANIMATE_OUT_DURATION_SECS}s ease-in-out`,
    textAlign: 'center',
    padding: `${RADIUS + 5}px 15px 30px 15px`,
    width: '100%',
    zIndex: ZINDEX_BOTTOM_PANEL,
    [mediaQueries.mUp]: {
      paddingBottom: '50px'
    }
  }),
  button: css({
    backgroundColor: negativeColors.primaryBg,
    boxShadow: '0 0 0px 2px rgba(255, 255, 255, .25)',
    cursor: 'pointer',
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
    cursor: 'pointer',
    marginBottom: 5,
    fontSize: 16,
    [mediaQueries.mUp]: {
      fontSize: 19,
      marginBottom: 10
    }
  }),
  note: css({
    color: colors.lightText,
    cursor: 'pointer',
    fontSize: 16,
    [mediaQueries.mUp]: {
      fontSize: 19
    }
  })
}

class BackToTopButton extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      closed: false
    }

    this.close = () => {
      setTimeout(() => {
        this.setState({ closed: true })
      }, ANIMATE_OUT_DURATION_SECS * 1000)
    }
  }

  componentDidUpdate () {
    const { animateOut } = this.props
    if (!this.state.closed && animateOut) {
      this.close()
    }
  }

  render () {
    const { closed } = this.state
    if (closed) {
      return null
    }
    const { t, onClick, animateOut, style, updatedAt } = this.props
    const opacity = animateOut || this.state.animateOut ? 0 : 1
    const date = updatedAt && Date.parse(updatedAt)

    return (
      <div {...styles.container} style={{ ...style, opacity }}>
        <button
          {...styles.button}
          onClick={onClick}
          title={t('article/progress/backtotopbutton/title')}
        >
          <UpIcon size={RADIUS * 1.5} fill={negativeColors.text} />
        </button>
        <div {...styles.label} onClick={onClick}>
          {t('article/progress/backtotopbutton/title')}
        </div>
        {date && (
          <div {...styles.note} onClick={() => {
            this.setState({ animateOut: true })
            this.close()
          }}>
            {datetime(t, date)}
          </div>
        )}
      </div>
    )
  }
}

BackToTopButton.propTypes = {
  t: PropTypes.func,
  onClick: PropTypes.func,
  animateOut: PropTypes.bool,
  style: PropTypes.object,
  updatedAt: PropTypes.string
}

export default withT(BackToTopButton)
