import React, { Component } from 'react'
import { css } from 'glamor'
import questionStyles from './questionStyles'
import uuid from 'uuid/v4'

import {
  Interaction,
  Button,
  fontStyles,
  colors
} from '@project-r/styleguide'
import withT from '../../lib/withT'
const { H2 } = Interaction

const styles = {
  body: css({
    margin: '5px 0 10px 0',
    display: 'flex',
    width: '100%',
    textAlign: 'center'
  }),
  option: css({
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  result: css({
    position: 'relative',
    width: '100%'
  }),
  resultCount: css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    ...fontStyles.serifTitle58
  }),
  resultBar: css({
    position: 'absolute',
    bottom: 0,
    width: '100%'
  })
}

class ChoiceQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      answerId: (props.question.userAnswer && props.question.userAnswer.id) || uuid()
    }
  }
  handleChange = (value) => {
    const { onChange, question: { userAnswer, cardinality } } = this.props
    const nextValue = new Set(userAnswer ? userAnswer.payload.value : [])

    if (cardinality === 0 || cardinality > 1) {
      if (nextValue.has(value)) {
        nextValue.delete(value)
      } else {
        nextValue.add(value)
      }
    } else {
      nextValue.clear()
      nextValue.add(value)
    }

    const { answerId } = this.state

    onChange(answerId, Array.from(nextValue))
  }

  render () {
    const { question: { id, text, userAnswer, options, results } } = this.props
    const optionsWithResult = options.map(o => ({
      ...o,
      result: results.find(r => r.option.value === o.value)
    }))

    const resultHeight = 100
    const numSubmitted = optionsWithResult.reduce(
      (agg, o) => o.result ? o.result.count + agg : agg,
      0
    )

    const getBarHeight = (option) =>
      numSubmitted > 0
        ? Math.max(resultHeight / numSubmitted * option.result.count, 1)
        : 1

    const getBarColor = ({ value }) =>
      value === 'true' ? colors.discrete[2] : colors.discrete[3]

    const getOpacity = ({ value }) =>
      value == userAnswer.payload.value ? 1.0 : 0.6

    return (
      <div>
        <div {...questionStyles.label}>
          { text &&
          <H2>{text}</H2>
          }
        </div>
        <div {...styles.body} style={{ minHeight: resultHeight }}>
          { optionsWithResult.map(option =>
            <div {...styles.option} key={`${id}-${option.value}`}>
              { !userAnswer &&
                <Button
                  onClick={() => this.handleChange(option.value)}
                >
                  {option.label}
                </Button>
              }
              { userAnswer &&
                <div style={{ width: '100%', opacity: getOpacity(option) }}>
                  <div {...styles.result} style={{ height: resultHeight }}>
                    <div {...styles.resultBar} style={{
                      backgroundColor: getBarColor(option),
                      height: getBarHeight(option)
                    }} />
                    <div {...styles.resultCount}>{option.result.count}</div>
                  </div>
                  <div {...styles.resultLabel}>{option.label}</div>
                </div>
              }
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default withT(ChoiceQuestion)
