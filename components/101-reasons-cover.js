import React, { Component } from 'react'

import { css } from 'glamor'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { inQuotes } from '@project-r/styleguide'

const questionnaireQuery = gql`
  {
    questionnaire(slug: "101-reasons") {
      id
      questions(shuffle: 1) {
        ... on QuestionTypeChoice {
          id
          order
          text
          metadata
        }
      }
    }
  }
`

const styles = {
  wrapper: css({
    fontColor: 'white'
  })
}

class ReasonCover extends Component {
  render() {
    const { data } = this.props

    if (
      data.loading ||
      !data.questionnaire ||
      !data.questionnaire.questions.length
    ) {
      return
    }

    const {
      text,
      order,
      metadata: { originLong }
    } = data.questionnaire.questions[0]

    return (
      <div {...styles.wrapper}>
        <div>
          <p>Grund #{order} von 101</p>
        </div>
        <div>{inQuotes(text)}</div>
        <div>
          <p>Leserin aus {originLong}</p>
        </div>
      </div>
    )
  }
}

export default compose(graphql(questionnaireQuery))(ReasonCover)
