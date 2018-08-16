import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { colors, fontStyles,Button, A } from '@project-r/styleguide'
import { css } from 'glamor';

const styles = {
  wrapper: css({
    height: 90,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  link: css({
    marginTop: 10,
    color: colors.disabled,
    ...fontStyles.sansSerifRegular14
  }),
}

class VoteActions extends React.Component {

  state = {
    currentState: STATES.START
  }

  transition = (nextState, callback) => {
    this.setState({ currentState: nextState }, callback && callback())
  }

  reset = () => {
    const { onCancel } = this.props
    this.transition(STATES.START, onCancel)
  }

  renderButtons = () => {
    const { okLabel, confirmLabel, cancelLabel, onFinish, onCancel, active } = this.props
    const { currentState } = this.state

    const resetLink = <A href='#' {...styles.link} onClick={this.reset}>{cancelLabel}</A>

    switch (currentState) {
      case STATES.START:
        return (
          <Fragment>
            <Button disabled>
              {okLabel}
            </Button>
            <div {...styles.link}>Bitte wählen Sie eine Option um abzustimmen</div>
          </Fragment>
        )
      case STATES.DIRTY:
        return (
          <Fragment>
            <Button
              black
              onClick={() => this.transition(POLL_STATES.READY)}
            >
              {okLabel}
            </Button>
            {resetLink}
          </Fragment>
        )
      case STATES.READY:
        return (
          <Fragment>
            <Button
              primary
              onClick={() =>
                this.transition(POLL_STATES.DONE, onFinish)
              }
            >
              {confirmLabel}
            </Button>
            {resetLink}              
          </Fragment>
        )
      case STATES.DONE:
        return (
          null
        )
    }
  }

  render() {
    return(
      <div {...styles.wrapper}>
        {this.renderButtons()}
      </div>
    )
  }

}

VoteActions.propTypes = {
  active: PropTypes.any,
  cancelLabel: PropTypes.string,
  okLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onFinish: PropTypes.func,
}

VoteActions.defaultProps = {
  active: null,
  cancelLabel: 'Zurücksetzen',
  confirmLabel: 'Stimme bestätigen',
  okLabel: 'Abstimmen',
  onCancel: () => {},
  onFinish: () => {},
}

export default VoteActions