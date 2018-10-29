import React, { Component } from 'react'
import { css } from 'glamor'
import { questionStyles } from './questionStyles'
import { nest } from 'd3-collection'

import {
  Interaction,
  mediaQueries,
  Checkbox,
  Radio
} from '@project-r/styleguide'
import withT from '../../lib/withT'
const { H2, H3, P } = Interaction

const styles = {
  options: css({
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap'
  }),
  optionGroup: css({
    width: '100%',
    [mediaQueries.mUp]: {
      width: '50%'
    },
    [mediaQueries.lUp]: {
      width: '33%'
    }
  }),
  optionGroupHeader: css({
    marginTop: 5,
    marginBottom: 15
  }),
  option: css({
    clear: 'both',
    paddingBottom: 10
  })
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
    const { question: { text, userAnswer, cardinality, options }, t } = this.props
    const multipleAllowed = (cardinality === 0 || cardinality > 1)
    const OptionComponent = multipleAllowed ? Checkbox : Radio
    const optionGroups = nest().key(o => o.category).entries(options)
    const userAnswerValues = userAnswer ? userAnswer.payload.value : []

    return (
      <div>
        <div {...questionStyles.label}>
          { text &&
          <H2>{text}</H2>
          }
          { multipleAllowed &&
          <P {...questionStyles.help}>{t('questionnaire/choice/helpMultiple')}</P>
          }
        </div>
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

export default withT(ChoiceQuestion)
