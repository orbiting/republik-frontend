import React, { Component } from 'react'
import gql from 'graphql-tag'
import { compose, graphql, withApollo } from 'react-apollo'
import Close from 'react-icons/lib/md/close'
import { css, merge, select } from 'glamor'
import debounce from 'lodash.debounce'

import {
  colors,
  NarrowContainer,
  FigureCaption,
  FigureImage,
  Interaction,
  mediaQueries,
  RawHtml,
  TextInput,
  fontStyles,
  Autocomplete
} from '@project-r/styleguide'

import { questionStyles } from './questionStyles'
const { H2, H3, P, A } = Interaction

const styles = {
  slider: css({
    '-webkit-appearance': 'none',
    background: colors.primaryBg,
    width: '100%',
    height: 25,
    outline: 'none',
    opacity: 0.7,
    transition: 'opacity .2s',
    '::-webkit-slider-thumb': {
      '-webkit-appearance': 'none',
      width: 25,
      height: 25,
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
      background: '#000'
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
    return props.question.userAnswer ? props.question.userAnswer.payload : {}
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.question.userAnswer !== this.props.question.userAnswer) {
      this.setState(this.deriveStateFromProps(nextProps))
    }
  }

  renderInput = () => {
    const { question: { type: { ticks, kind } } } = this.props
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

    return (
      <input
        {...styles.slider}
        {...(!value && styles.sliderDefault)}
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={this.handleChange}
      />
    )
  }

  renderLabels = () => {
    const { question: { type: { ticks } } } = this.props
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

  handleChange = (ev) => {
    const value = +ev.target.value
    const { onChange } = this.props
    this.setState({ value })
    onChange(value, true)
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
