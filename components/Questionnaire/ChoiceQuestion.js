import React, { Component } from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { css, merge } from 'glamor'
import { questionStyles } from './questionStyles'
import { nest } from 'd3-collection'

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
  Checkbox,
  Radio,
  Label
} from '@project-r/styleguide'
const { H2 } = Interaction

const styles = {
  options: css({
    display: 'flex',
    width: '100%'
  }),
  optionGroup: css({
  })
}

class ChoiceQuestion extends Component {
  handleChange = (nextValue) => {
    const { onChange, question: { userAnswer, id, type: { cardinality } } } = this.props

    // const next = new Set(userAnswer)

    const nextAnswer = cardinality > 1
      ? [nextValue]
      : [nextValue]

    onChange(nextAnswer)
  }

  render () {
    const { question: { text, userAnswer, type: { cardinality, options } } } = this.props
    const OptionComponent = cardinality > 1 ? Checkbox : Radio
    const optionGroups = nest().key(o => o.category).entries(options)
    const groupCount = Object.keys(optionGroups).length
    const userAnswerValues = userAnswer ? userAnswer.payload.value : []

    return (
      <div>
        { text &&
        <H2 {...questionStyles.label}>{text}</H2>
        }
        <div {...questionStyles.body} {...styles.options}>
          {
            optionGroups.map(({ key, values }) =>
              <div key={key} {...styles.optionGroup}>
                {key !== 'null' &&
                  <h4>{key}</h4>
                }
                {
                  values.map((o, i) =>
                    <div key={i}>
                      <OptionComponent onChange={() => this.handleChange(o.value)} checked={userAnswerValues.some(v => v === o.value)}>
                        {o.label}
                      </OptionComponent>
                      <br />
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

const query = gql`
{
  me {
    id
  }
}
`

export default compose(
  graphql(query)
)(ChoiceQuestion)
