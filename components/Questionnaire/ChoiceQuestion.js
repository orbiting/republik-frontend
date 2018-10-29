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
  fontFamilies,
  mediaQueries,
  RawHtml,
  TextInput,
  fontStyles,
  Checkbox,
  Radio,
  Label
} from '@project-r/styleguide'
const { H2 , H3 } = Interaction

const styles = {
  options: css({
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
  }),
  optionGroup: css({
    width: '100%',
    [mediaQueries.mUp]: {
      width: '50%',
    }
  }),
  optionGroupHeader: css({
    marginTop: 5,
    marginBottom: 15,
  }),
  option: css({
    clear: 'both',
    paddingBottom: 10,
  }),
}

class ChoiceQuestion extends Component {

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

    onChange([...nextValue])
  }

  render () {
    const { question: { text, userAnswer, cardinality, options } } = this.props
    const OptionComponent = (cardinality === 0 || cardinality > 1) ? Checkbox : Radio
    const optionGroups = nest().key(o => o.category).entries(options)
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
                  <H3 {...styles.optionGroupHeader}>{key}</H3>
                }
                <div>
                {
                  values.map((o, i) =>
                    <div key={i} {...styles.option}>
                      <OptionComponent
                        onChange={() => this.handleChange(o.value)}
                        checked={userAnswerValues.some(v => v === o.value)}
                      >
                        {o.label}
                      </OptionComponent>
                    </div>
                  )
                }
                </div>
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
