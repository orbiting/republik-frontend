import React, { Component } from 'react'
import Frame from '../Frame'
import Loader from '../Loader'
import ErrorMessage from '../ErrorMessage'

import { css } from 'glamor'
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
  Button,
  A,
  InlineSpinner,
} from '@project-r/styleguide'

import TextQuestion from './TextQuestion'
import ArticleQuestion from './ArticleQuestion'
import RangeQuestion from './RangeQuestion'
import ChoiceQuestion from './ChoiceQuestion'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

const { Headline, P, H3 } = Interaction

const QUESTION_TYPES = {
  QuestionTypeDocument: ArticleQuestion,
  QuestionTypeText: TextQuestion,
  QuestionTypeChoice: ChoiceQuestion,
  QuestionTypeRange: RangeQuestion
}

const styles = {
  count: css({
    background: '#fff',
    zIndex: 10,
    minHeight: 20,
    position: 'sticky',
    padding: '20px 0',
    borderBottom: `0.5px solid ${colors.divider}`,
    top: HEADER_HEIGHT-1,
    [mediaQueries.onlyS]: {
      top: HEADER_HEIGHT_MOBILE-1,
    }
  }),
  actions: css({
    textAlign: 'center',
    margin: '20px auto 20px auto',
  }),
  reset: css({
    textAlign: 'center',
  }),
  thankyou: css({
    background: colors.primaryBg,
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 30,
    textAlign: 'center'
  })
}

class Page extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  handleChange = (questionType, questionId, answerId) => async (value) => {
    const valueArg = value !== null ? { value } : null
    this.setState({updating: true})
    this.props.submitAnswer(questionType, questionId, valueArg, answerId)
      .then(() =>
        this.setState(() => ({
          updating: false,
          error: null
        }))
      )
      .catch((error) => {
        this.setState(() => ({
          updating: false,
          error
        }))
      })
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
          const { questionnaire: { id, userHasSubmitted, questions } } = data
          const { submitQuestionnaire, resetQuestionnaire } = this.props

          const questionCount = questions.map(q => q.text).filter(Boolean).length
          const userAnswerCount = questions.map(q => q.userAnswer).filter(Boolean).length

          const { error } = this.state

          if (userHasSubmitted) {
            return (
              <Container>
                <Headline>Umfrage</Headline>
                <div {...styles.thankyou}>
                  <P>
                    Ihre Meinung ist bei uns angekommen. Danke fürs Mitmachen!
                  </P>
                </div>
              </Container>
            )
          }

          return (
            <Container>
              <Headline>Umfrage</Headline>
              <div {...styles.count}>
                <div>
                  <H3>Sie haben {userAnswerCount} von {questionCount} Fragen beantwortet.</H3>
                  <P>Um den Fragebogen abzuschliessen und Ihre Antworten zu übermitteln, klicken Sie bitte am Ende der Seite auf «Abschicken».</P>
                </div>
                {
                  error &&
                  <div>
                    <ErrorMessage error={error} />
                  </div>
                }
              </div>
              {
                questions.map(q =>
                  React.createElement(
                    QUESTION_TYPES[q.__typename],
                    {
                      onChange: this.handleChange(q.__typename, q.id, q.userAnswer ? q.userAnswer.id : undefined),
                      question: q,
                      key: q.id,
                      disabled: userHasSubmitted,
                    }
                  )
                )
              }
              <div {...styles.actions}>
                <Button
                  primary
                  onClick={() => submitQuestionnaire(id)}
                  disabled={this.state.updating}
                >
                  { this.state.updating
                      ? <InlineSpinner size={40} />
                      : `Abschicken`
                  }
                </Button>
                <div {...styles.reset}>
                  <A href='#' onClick={e => { e.preventDefault(); resetQuestionnaire(id) }}>Abbrechen</A>
                </div>
              </div>
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
    ... on QuestionInterface {
      id
      userAnswer {
        id
        payload
      }
    }
  }
}
`

const resetQuestionnaireMutation = gql`
mutation resetQuestionnaire($id: ID!) {
  resetQuestionnaire(id: $id) {
    id
    userSubmitDate
    userHasSubmitted
  }
}
`

const submitQuestionnaireMutation = gql`
mutation submitQuestionnaire($id: ID!) {
  submitQuestionnaire(id: $id) {
    id
    userSubmitDate
    userHasSubmitted
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
      ... on QuestionInterface {
        id
        order
        text
        userAnswer {
          id
          payload
        }
      }
      ... on QuestionTypeText {
        maxLength
      }
      ... on QuestionTypeChoice {
        cardinality
        options {
          label
          value
          category
        }
      }
      ... on QuestionTypeRange {
        kind
        ticks {
          label
          value
        }
      }
      ... on QuestionTypeDocument {
        template
      }
    }
  }
}
`

export default compose(
  graphql(submitQuestionnaireMutation, {
    props: ({mutate}) => ({
      submitQuestionnaire: (id) => {
        return mutate({
          variables: {
            id
          }
        })
      }
    })
  }),
  graphql(resetQuestionnaireMutation, {
    props: ({mutate}) => ({
      resetQuestionnaire: (id) => {
        return mutate({
          variables: {
            id
          },
          refetchQueries: [{query}]
        })
      }
    })
  }),
  graphql(submitAnswerMutation, {
    props: ({ mutate }) => ({
      submitAnswer: (questionType, questionId, payload, answerId) => {
        const optimistic = {
          optimisticResponse: {
            __typename: 'Mutation',
            submitAnswer: {
              __typename: 'QuestionInterface',
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
