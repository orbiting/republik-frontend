import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { A, Button, colors, fontFamilies, fontStyles, Interaction, Radio } from '@project-r/styleguide'
import { timeFormat } from '../../lib/utils/format'

const {H3, P} = Interaction

const POLL_STATES = {
  START: 'START',
  DIRTY: 'DIRTY',
  READY: 'READY',
  DONE: 'DONE'
}

const styles = {
  card: css({
    margin: '40px auto',
    border: `1px solid ${colors.neutral}`,
    padding: 25,
    maxWidth: 550,
    width: '100%'
  }),
  cardTitle: css({
    fontSize: 22,
    fontFamily: fontFamilies.sansSerifMedium
  }),
  cardBody: css({
    marginTop: 15,
    padding: '0 20px 15px 0px'
  }),
  cardActions: css({
    height: 90,
    position: 'sticky',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  optionText: css({
    fontSize: 19
  }),
  link: css({
    marginTop: 10,
    ...fontStyles.sansSerifRegular14
  }),
  error: css({
    textAlign: 'center',
    width: '80%',
    margin: '10px auto',
    color: colors.error
  }),
  thankyou: css({
    background: colors.primaryBg,
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    padding: 10,
    textAlign: 'center'
  })
}

const messageDateFormat = timeFormat(' am %e. %B %Y um %H:%M ')

class Voting extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pollState: POLL_STATES.START,
      selectedValue: null
    }

    this.reset = (e) => {
      e.preventDefault()
      this.setState(
        {selectedValue: null},
        this.transition(POLL_STATES.START)
      )
    }

    this.transition = (nextState, callback) => {
      this.setState({pollState: nextState}, callback && callback())
    }

    this.renderWarning = () => {
      const {pollState, selectedValue} = this.state
      if (pollState === POLL_STATES.READY && !selectedValue) {
        return (
          <P {...styles.error}>
            Leer einlegen?
          </P>
        )
      } else {
        return null
      }
    }

    this.renderActions = () => {
      const {onFinish} = this.props
      const {pollState} = this.state

      const resetLink = <A href='#' {...styles.link} onClick={this.reset}>Zurücksetzen</A>

      switch (pollState) {
        case POLL_STATES.START:
          return (
            <Fragment>
              <Button
                primary
                onClick={() => this.transition(POLL_STATES.READY)}
              >
                Abstimmen
              </Button>
              <div {...styles.link}>Leer einlegen ist auch möglich.</div>
            </Fragment>
          )
        case POLL_STATES.DIRTY:
          return (
            <Fragment>
              <Button
                primary
                onClick={() => this.transition(POLL_STATES.READY)}
              >
                Abstimmen
              </Button>
              {resetLink}
            </Fragment>
          )
        case POLL_STATES.READY:
          return (
            <Fragment>
              <Button
                primary
                black
                onClick={() =>
                  this.transition(POLL_STATES.DONE, onFinish)
                }
              >
                Stimme bestätigen
              </Button>
              {resetLink}
            </Fragment>
          )
        case POLL_STATES.DONE:
          return (
            null
          )
      }
    }
  }

  render () {
    const {options, proposition} = this.props
    const {pollState, selectedValue} = this.state
    const {P} = Interaction
    return (
      <div {...styles.card}>
        <H3>{proposition}</H3>
        <div style={{position: 'relative'}}>
          {pollState === POLL_STATES.DONE &&
          <div {...styles.thankyou}>
            <P>
              Ihre Stimme ist am {messageDateFormat(Date.now())} bei uns eingegangen.<br />
              Danke für Ihre Teilnahme!
            </P>
          </div>
          }
          <div {...styles.cardBody}>
            {options.map(({value, label}) => (
              <Fragment key={value}>
                <Radio
                  value={value}
                  disabled={
                    pollState === POLL_STATES.DONE
                  }
                  checked={value === selectedValue}
                  onChange={() =>
                    this.setState(
                      {selectedValue: value},
                      this.transition(POLL_STATES.DIRTY)
                    )
                  }
                >
                  <span {...styles.optionText}>{label}</span>
                </Radio>
                <br />
              </Fragment>
            ))}
          </div>
          {
            this.renderWarning()
          }
          <div {...styles.cardActions}>
            {this.renderActions()}
          </div>
        </div>
      </div>
    )
  }
}

Voting.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  proposition: PropTypes.string,
  onFinish: PropTypes.func
}

Voting.defaultProps = {
  options: [],
  onFinish: () => {}
}

export default Voting
