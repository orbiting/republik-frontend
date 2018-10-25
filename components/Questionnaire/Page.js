import React, { Component } from 'react'
import Frame from '../Frame'
import Loader from '../Loader'

import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {
  colors,
  Container,
  FigureCaption,
  FigureImage,
  Interaction,
  mediaQueries,
  RawHtml,
  TextInput,
  Button
} from '@project-r/styleguide'

import TextQuestion from './TextQuestion'
import ArticleQuestion from './ArticleQuestion'
import RangeQuestion from './RangeQuestion'
import ChoiceQuestion from './ChoiceQuestion'
import debounce from 'lodash.debounce'

const { P, Headline, H2 } = Interaction

const QUESTION_COMPONENTS = {
  Document: ArticleQuestion,
  Text: TextQuestion,
  Choice: ChoiceQuestion,
  Range: RangeQuestion
}

class Page extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submitAnswerDebounced = debounce(this.props.submitAnswer, 500)

  handleChange = (questionId, answerId) => (value, applyDebounce) => {
    const valueArg = value ? { value } : null
    if (applyDebounce) {
      this.submitAnswerDebounced(questionId, valueArg, answerId)
    } else {
      this.props.submitAnswer(questionId, valueArg, answerId)
    }
  }

  render () {
    const { data } = this.props
    const meta = {
      title: 'Leserumfrage',
      description: 'Machen Sie mit!'
    }

    return (
      <Frame meta={meta}>
        <Loader loading={data.loading} error={data.error} render={() => {
          const { questionnaire: { questions } } = data

          return (
            <Container>
              <Headline>Umfrage</Headline>
              {
                questions.map(q =>
                  React.createElement(
                    QUESTION_COMPONENTS[q.type.type],
                    {
                      onChange: this.handleChange(q.id, q.userAnswer ? q.userAnswer.id : undefined),
                      question: q,
                      key: q.id
                    }
                  )
                )
              }
              <Button
                primary
              >
                Abschicken
              </Button>
            </Container>
          )
        }} />
      </Frame>
    )
  }
}

const submitAnswerMutation = gql`
mutation submitAnswer($questionId: ID!, $payload: JSON) {
  submitAnswer(answer: {
    questionId: $questionId,
    payload: $payload
  }) {
    id
    userAnswer {
      id
      payload
    }
  }
}
`

const query = gql`
{
  questionnaire(slug: "renew18") {
    id
    beginDate
    endDate
    userHasSubmitted
    userSubmitDate
    questions {
      id
      order
      text
      type {
        __typename
        ... on QuestionTypeText {
          type
          maxLength
        }
        ... on QuestionTypeChoice {
          type
          cardinality
          options {
            label
            value
            category
          }
        }
        ... on QuestionTypeRange {
          type
          kind
          ticks {
            label
            value
          }
        }
        ... on QuestionTypeDocument {
          type
          template
        }
      }
      userAnswer {
        id
        payload
      }
    }
  }
}
`

export default compose(
  graphql(submitAnswerMutation, {
    props: ({ mutate }) => ({
      submitAnswer: (questionId, payload, answerId) => {
        const optimistic = {
          optimisticResponse: {
            __typename: 'Mutation',
            submitAnswer: {
              __typename: 'Question',
              id: questionId,
              userAnswer: {
                __typename: 'Answer',
                id: answerId,
                payload
              }
            }
          }
        }
        return mutate({
          variables: {
            questionId,
            payload
          },
          ...(answerId ? optimistic : {})
        })
      }
    })
  }),
  graphql(query)
)(Page)
