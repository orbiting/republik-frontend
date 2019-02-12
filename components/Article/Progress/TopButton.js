import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import withT from '../../../lib/withT'
import UpIcon from 'react-icons/lib/md/arrow-upward'
import { negativeColors } from '../../Frame/constants'

const ANIMATE_OUT_DURATION_SECS = 0.3
const RADIUS = 16

const styles = {
  container: css({
    backgroundColor: negativeColors.primaryBg,
    boxShadow: '0 0 0px 2px rgba(255, 255, 255, .25)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    bottom: 60,
    left: `calc(50% - ${RADIUS}px)`,
    width: `${RADIUS * 2}px`,
    height: `${RADIUS * 2}px`,
    borderRadius: `${RADIUS}px`,
    border: 'none',
    outline: 'none',
    transition: `opacity ${ANIMATE_OUT_DURATION_SECS}s ease-in-out`
  })
}

class TopButton extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      closed: false
    }
  }

  componentDidUpdate () {
    const { animateOut } = this.props
    if (!this.state.closed && animateOut) {
      setTimeout(() => {
        this.setState({ closed: true })
      }, ANIMATE_OUT_DURATION_SECS * 1000)
    }
  }

  render () {
    const { closed } = this.state
    if (closed) {
      return null
    }
    const { t, onClick, animateOut, style } = this.props
    const opacity = animateOut ? 0 : 1

    return (
      <button
        {...styles.container}
        style={{ ...style, opacity }}
        onClick={onClick}
        title={t('article/progress/topbutton/title')}
      >
        <UpIcon size={RADIUS * 1.5} fill={negativeColors.text} />
      </button>
    )
  }
}

TopButton.propTypes = {
  t: PropTypes.func,
  onClick: PropTypes.func,
  animateOut: PropTypes.bool,
  style: PropTypes.object
}

export default withT(TopButton)
