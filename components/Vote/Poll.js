import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { colors, fontFamilies, Radio, Button } from '@project-r/styleguide'

const POLL_STATES = {
  START: 'START',
  DIRTY: 'DIRTY',
  READY: 'READY',
  DONE: 'DONE'
}

const styles = {
  card: css({
    border: '1px solid black',
    padding: 15
  }),
  cardTitle: css({
    fontSize: 22,
    fontFamily: fontFamilies.sansSerifMedium
  }),
  cardBody: css({
    padding: '20px 40px'
  }),
  cardActions: css({
    display: 'flex',
    justifyContent: 'flex-end'
  }),
  optionText: css({
    fontSize: 22
  })
}

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

    this.reset = () => {
      this.setState({ selectedValue: null }, this.transition(POLL_STATES.START))
    }

    this.renderActions = () => {
      const { onFinish } = this.props
      const { pollState } = this.state
      switch (pollState) {
        case POLL_STATES.START:
          return (
            <Fragment>
              <div />,
              <Button primary disabled>Abstimmen</Button>
            </Fragment>
          )
        case POLL_STATES.DIRTY:
          return (
            <Fragment>
              <Button onClick={this.reset}>Abbrechen</Button>,
              <Button primary onClick={() => this.transition(POLL_STATES.READY)}>Abstimmen</Button>
            </Fragment>
          )
        case POLL_STATES.READY:
          return (
            <Fragment>
              <Button onClick={this.reset}>Abbrechen</Button>,
              <Button onClick={() => this.transition(POLL_STATES.DONE, onFinish)}>Stimme bestätigen</Button>
            </Fragment>
          )
        case POLL_STATES.DONE:
          return (
            <Fragment>
              <div>Danke für Ihre Stimme!</div>
            </Fragment>
          )
      }
    }
  }

  render () {
    const { options, proposition } = this.props
    const { pollState, selectedValue } = this.state
    const backgroundColor = pollState === POLL_STATES.DIRTY
      ? colors.secondaryBg
      : (pollState === POLL_STATES.READY)
        ? colors.primaryBg
        : '#fff'
    return (
      <div {...styles.card} style={{ backgroundColor }}>
        <div {...styles.cardTitle}>{proposition}</div>
        <div {...styles.cardBody}>
          {
            options.map(({value, label}) =>
              <Fragment key={value}>
                <Radio
                  value={value}
                  disabled={pollState === POLL_STATES.READY || pollState === POLL_STATES.DONE}
                  checked={value === selectedValue}
                  onChange={() => this.setState({ selectedValue: value }, this.transition(POLL_STATES.DIRTY))}
                >
                  <span {...styles.optionText}>{label}</span>
                </Radio>
                <br />
              </Fragment>
            )
          }
        </div>
        <div {...styles.cardActions}>
          {
            this.renderActions()
          }
        </div>
      </div>
    )
  }
}

Poll.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })),
  proposition: PropTypes.string,
  onFinish: PropTypes.func
}

Poll.defaultProps = {
  options: [],
  onFinish: () => {}
}

export default Poll
