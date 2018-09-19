import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import {
  colors,
  fontFamilies,
  Radio,
  Button,
  A,
  fontStyles,
  Interaction
} from '@project-r/styleguide'
import { timeFormat } from '../../lib/utils/format'

const { H1, H2, H3, P } = Interaction

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
    padding: 15,
    maxWidth: 455,
    width: '100%'
  }),
  cardTitle: css({
    fontSize: 22,
    fontFamily: fontFamilies.sansSerifMedium
  }),
  cardBody: css({
    marginTop: 15,
    padding: '0 20px 15px 20px'
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
    color: colors.disabled,
    ...fontStyles.sansSerifRegular14
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

class Poll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pollState: POLL_STATES.START,
      selectedValue: null
    }

    this.transition = (nextState, callback) => {
      this.setState({ pollState: nextState }, callback && callback())
    }

    this.reset = (e) => {
      e.preventDefault()
      this.setState(
        { selectedValue: null },
        this.transition(POLL_STATES.START)
      )
    }

    this.renderActions = () => {
      const { onFinish } = this.props
      const { pollState } = this.state

      const resetLink = <A href='#' {...styles.link} onClick={this.reset}>Zurücksetzen</A>

      switch (pollState) {
        case POLL_STATES.START:
          return (
            <Fragment>
              <Button disabled>
                Abstimmen
              </Button>
              <div {...styles.link}>Bitte wählen Sie eine Option um abzustimmen</div>
            </Fragment>
          )
        case POLL_STATES.DIRTY:
          return (
            <Fragment>
              <Button
                black
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
    const { options, proposition } = this.props
    const { pollState, selectedValue } = this.state
    const { P } = Interaction
    return (
      <div {...styles.card}>
        <H3>{proposition}</H3>
        <div style={{ position: 'relative' }}>
          { pollState === POLL_STATES.DONE &&
          <div {...styles.thankyou}>
            <P>
              Ihre Stimme ist am {messageDateFormat(Date.now())} bei uns eingegangen.<br />
              Danke für Ihre Teilnahme!
            </P>
          </div>
          }
          <div {...styles.cardBody}>
            {options.map(({ value, label }) => (
              <Fragment key={value}>
                <Radio
                  value={value}
                  disabled={
                    pollState === POLL_STATES.DONE
                  }
                  checked={value === selectedValue}
                  onChange={() =>
                    this.setState(
                      { selectedValue: value },
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
          <div {...styles.cardActions}>
            {this.renderActions()}
          </div>
        </div>
      </div>
    )
  }
}

Poll.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  proposition: PropTypes.string,
  onFinish: PropTypes.func
}

Poll.defaultProps = {
  options: [],
  onFinish: () => {}
}

export default Poll
