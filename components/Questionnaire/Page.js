import React, { Component } from 'react'
import Frame from '../Frame'
import Loader from '../Loader'

import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import CheckCircle from 'react-icons/lib/md/check-circle'

import {
  colors,
  Interaction,
  mediaQueries,
  Button,
  A,
  InlineSpinner,
  fontFamilies
} from '@project-r/styleguide'

import TextQuestion from './TextQuestion'
import ArticleQuestion from './ArticleQuestion'
import RangeQuestion from './RangeQuestion'
import ChoiceQuestion from './ChoiceQuestion'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import withT from '../../lib/withT'
import { errorToString } from '../../lib/utils/errors'

const { Headline, P } = Interaction

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
    position: 'sticky',
    padding: '10px 0',
    borderBottom: `0.5px solid ${colors.divider}`,
    display: 'flex',
    minHeight: 55,
    top: HEADER_HEIGHT - 1,
    [mediaQueries.onlyS]: {
      top: HEADER_HEIGHT_MOBILE - 1
    }
  }),
  actions: css({
    textAlign: 'center',
    margin: '20px auto 20px auto'
  }),
  reset: css({
    textAlign: 'center',
    marginTop: 10
  }),
  strong: css({
    fontFamily: fontFamilies.sansSerifMedium
  }),
  error: css({
    color: colors.error,
    fontFamily: fontFamilies.sansSerifMedium
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
  }),
  progressIcon: css({
    marginLeft: 5,
    marginTop: 3,
    minHeight: 30
  })
}

class Page extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  processSubmit = (fn, ...args) => {
    this.setState({ updating: true })
    fn(...args)
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

  handleChange = (questionType, questionId, answerId) => (value) => {
    const valueArg = value !== null ? { value } : null
    this.processSubmit(
      this.props.submitAnswer,
      questionType, questionId, valueArg, answerId
    )
  }

  handleSubmit = e => {
    const { submitQuestionnaire, data: { questionnaire: { id } } } = this.props
    e.preventDefault()
    this.processSubmit(
      submitQuestionnaire,
      id
    )
  }

  handleReset = e => {
    const { resetQuestionnaire, data: { questionnaire: { id } } } = this.props
    e.preventDefault()
    this.processSubmit(
      resetQuestionnaire,
      id
    )
  }

  render () {
    const { data, t } = this.props
    const meta = {
      title: t('questionnaire/title'),
      description: t('questionnaire/description')
    }

    return (
      <Frame meta={meta}>
        <Loader loading={data.loading} error={data.error} render={() => {
          const { questionnaire: { userHasSubmitted, questions } } = data

          const questionCount = questions.filter(Boolean).length
          const userAnswerCount = questions.map(q => q.userAnswer).filter(Boolean).length

          const { error } = this.state

          if (userHasSubmitted) {
            return (
              <>
                <Headline>{t('questionnaire/title')}</Headline>
                <div {...styles.thankyou}>
                  <P>
                    {t('questionnaire/thankyou')}
                  </P>
                </div>
              </>
            )
          }

          return (
            <div>
              <Headline>Umfrage</Headline>
              <P>{t('questionnaire/intro')}</P>
              <div {...styles.count}>
                { error
                  ? <P {...styles.error}>{errorToString(error)}</P>
                  : <>
                    <P {...styles.strong}>{t('questionnaire/header', { questionCount, userAnswerCount })}</P>
                    {
                      questionCount === userAnswerCount
                        ? <div {...styles.progressIcon}><CheckCircle size={22} color={colors.primary} /></div>
                        : this.state.updating
                          ? <div style={{ marginLeft: 5, marginTop: 3 }}><InlineSpinner size={24} /></div>
                          : null
                    }
                    </>
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
                      disabled: userHasSubmitted
                    }
                  )
                )
              }
              <div {...styles.actions}>
                <Button
                  primary
                  onClick={this.handleSubmit}
                  disabled={this.state.updating || userAnswerCount < 1}
                >
                  { this.state.updating
                    ? <InlineSpinner size={40} />
                    : t('questionnaire/submit')
                  }
                </Button>
                <div {...styles.reset}>
                  {userAnswerCount < 1
                    ? t('questionnaire/invalid')
                    : <A href='#' onClick={this.handleReset}>{t('questionnaire/cancel')}</A>
                  }
                </div>
              </div>
            </div>
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
  withT,
  graphql(submitQuestionnaireMutation, {
    props: ({ mutate }) => ({
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
    props: ({ mutate }) => ({
      resetQuestionnaire: (id) => {
        return mutate({
          variables: {
            id
          },
          refetchQueries: [{ query }]
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
