import React, { Component } from 'react'
import { compose, withApollo } from 'react-apollo'
import { css } from 'glamor'
import debounce from 'lodash.debounce'

import {
  colors,
  Interaction
} from '@project-r/styleguide'

import { questionStyles } from './questionStyles'
const { H2 } = Interaction

const styles = {
  sliderWrapper: css({
    height: 25
  }),
  slider: css({
    '-webkit-appearance': 'none',
    background: colors.secondaryBg,
    width: '100%',
    height: 5,
    outline: 'none',
    opacity: 1,
    '::-webkit-slider-thumb': {
      '-webkit-appearance': 'none',
      borderRadius: 12,
      width: 24,
      height: 24,
      background: colors.primary
    },
    '::-moz-range-thumb': {
      width: 25,
      height: 25,
      background: colors.primary
    }
  }),
  sliderDefault: css({
    background: colors.secondaryBg,
    '::-webkit-slider-thumb': {
      '-webkit-appearance': 'none',
      background: colors.disabled
    },
    '::-moz-range-thumb': {
      background: '#000'
    }
  }),
  ticks: css({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    textAlign: 'center',
    paddingLeft: 0,
    '& div:first-child': {
      textAlign: 'left',
      paddingRight: 5
    },
    '& div:last-child': {
      textAlign: 'right',
      paddingLeft: 5
    }
  })
}

class RangeQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.deriveStateFromProps(props)
    }
  }

  deriveStateFromProps (props) {
    return props.question.userAnswer ? props.question.userAnswer.payload : { value: null }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.question.userAnswer !== this.props.question.userAnswer) {
      this.setState(this.deriveStateFromProps(nextProps))
    }
  }

  renderInput = () => {
    const { question: { ticks, kind } } = this.props
    const { value } = this.state
    const [ min, max ] = ticks.reduce(
      (acc, cur) => {
        return [
          Math.min(acc[0], cur.value),
          Math.max(acc[1], cur.value)
        ]
      },
      [0, 0]
    )

    const step = kind === 'continous'
      ? ticks.length / 100
      : Math.abs(max - min) /
          (ticks.length % 2 === 0 ? ticks.length : ticks.length + 1)

    const defaultValue = (min < 0 || max < 0) && !(min < 0 && max < 0)
      ? 0
      : Math.abs(min - max) / 2

    return (
      <div {...styles.sliderWrapper}>
        <input
          {...styles.slider}
          {...(value === null && styles.sliderDefault)}
          type='range'
          min={min}
          max={max}
          step={step}
          value={value || defaultValue}
          onChange={this.handleChange}
        />
      </div>
    )
  }

  renderLabels = () => {
    const { question: { ticks } } = this.props
    return (
      <div {...styles.ticks}>
        {
          ticks.map(t =>
            <div key={t.label} style={{ width: `${100 / (ticks.length)}%` }}>{t.label}</div>
          )
        }
      </div>
    )
  }

  onChangeDebounced = debounce(this.props.onChange, 300)

  handleChange = (ev) => {
    const value = +ev.target.value
    this.setState({ value })
    this.onChangeDebounced(value)
  }

  render () {
    const { question: { text } } = this.props
    return (
      <div>
        { text &&
          <H2 {...questionStyles.label}>{text}</H2>
        }
        <div {...questionStyles.body}>
          {
            this.renderInput()
          }
          {
            this.renderLabels()
          }
        </div>
      </div>
    )
  }
}

export default compose(
  withApollo
//  graphql()
)(RangeQuestion)
