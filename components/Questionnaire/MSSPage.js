import React, { Component } from 'react'
import Frame from '../Frame'
import Loader from '../Loader'
import { withRouter } from 'next/router'

import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import CheckCircle from 'react-icons/lib/md/check-circle'

import {
  colors,
  Interaction,
  mediaQueries,
  InlineSpinner,
  fontFamilies
} from '@project-r/styleguide'

import MSSQuestion from './MSSQuestion'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import withT from '../../lib/withT'
import withAuthorization from '../Auth/withAuthorization'
import { errorToString } from '../../lib/utils/errors'
import StatusError from '../StatusError'

const { Headline, P } = Interaction

const styles = {
  count: css({
    background: '#fff',
    zIndex: 10,
    position: 'sticky',
    padding: '10px 0',
    borderBottom: `0.5px solid ${colors.divider}`,
    minHeight: 55,
    top: HEADER_HEIGHT - 1,
    [mediaQueries.onlyS]: {
      top: HEADER_HEIGHT_MOBILE - 1
    }
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
  closed: css({
    marginTop: 35,
    background: colors.primaryBg,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    textAlign: 'center',
    marginBottom: 30
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
    return fn(...args)
      .then(() =>
        this.setState(() => ({
          updating: false,
          error: null
        }))
      )
      .catch((error) => {
        this.setState(() => ({
          updating: false,
          submitting: false,
          error
        }))
      })
  }

  createHandleChange = (questionId) => (answerId, value) => {
    const payload = value !== null ? { value } : null
    this.processSubmit(
      this.props.submitAnswer,
      questionId, payload, answerId
    )
  }

  render () {
    const { data, t, meta } = this.props

    return (
      <Frame meta={meta}>
        <Loader loading={data.loading} error={data.error} render={() => {
          const now = new Date()
          // handle not found or not started
          if (!data.questionnaire || new Date(data.questionnaire.beginDate) > now) {
            return (
              <StatusError
                statusCode={404}
                serverContext={this.props.serverContext} />
            )
          }

          // handle questions
          const { questionnaire: { questions, userMainstreamScore } } = data
          const { error, submitting, updating } = this.state
          const questionCount = questions.filter(Boolean).length
          const userAnswerCount = questions.map(q => q.userAnswer).filter(Boolean).length
          return (
            <div>
              <Headline>Mainstream-Score</Headline>
              <div {...styles.count}>
                { error
                  ? <P {...styles.error}>{errorToString(error)}</P>
                  : <>
                    <div style={{ display: 'flex' }}>
                      <P {...styles.strong}>{t('questionnaire/header', { questionCount, userAnswerCount })}</P>
                      {
                        questionCount === userAnswerCount
                          ? <div {...styles.progressIcon}><CheckCircle size={22} color={colors.primary} /></div>
                          : (updating || submitting)
                            ? <div style={{ marginLeft: 5, marginTop: 3 }}><InlineSpinner size={24} /></div>
                            : null
                      }
                    </div>
                    <P {...styles.strong}>Ihr Mainstream-Score: {userMainstreamScore}</P>
                  </>
                }
              </div>
              {
                questions.map(q =>
                  React.createElement(
                    MSSQuestion,
                    {
                      onChange: this.createHandleChange(q.id),
                      question: q,
                      key: q.id
                    }
                  )
                )
              }
            </div>
          )
        }} />
      </Frame>
    )
  }
}

const submitAnswerMutation = gql`
mutation submitAnswer($answerId: ID!, $questionId: ID!, $payload: JSON) {
  submitAnswer(answer: {
    id: $answerId,
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

const query = gql`
query getQuestionnaire($slug: String!) {
  questionnaire(slug: $slug) {
    id
    beginDate
    endDate
    userHasSubmitted
    userSubmitDate
    userIsEligible
    turnout { eligible submitted }
    userMainstreamScore
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
      ... on QuestionTypeChoice {
        cardinality
        options {
          label
          value
          category
        }
        results: result {
          count
          option {
            label
            value
            category
          }
        }
        turnout {skipped submitted}
        userMainstreamScore
      }
    }
  }
}
`

export default compose(
  withT,
  withRouter,
  withAuthorization(['supporter', 'editor'], 'showResults'),
  graphql(submitAnswerMutation, {
    props: ({ mutate, ownProps: { router } }) => ({
      submitAnswer: (questionId, payload, answerId) => {
        return mutate({
          variables: {
            answerId,
            questionId,
            payload
          },
          /*
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
          },
          update: (proxy, { data: { submitAnswer } }) => {
            const queryObj = { query, variables: { slug: router.query.slug } }
            const data = proxy.readQuery(queryObj)

            const questionIx = data.questionnaire.questions.findIndex(q => q.id === questionId)
            const question = data.questionnaire.questions[questionIx]
            question.userAnswer = submitAnswer.userAnswer

            console.log({ payload, submitAnswer})

            if (question.results) {
              const result = question.results.find( r =>
                r.option.value == submitAnswer.userAnswer.payload.value[0]
              )
              result.count++
            }

            proxy.writeQuery({ ...queryObj, data })
          },
          */
          refetchQueries: [{ query, variables: { slug: router.query.slug } }]
        })
      }
    })
  }),
  graphql(query, {
    options: ({ router }) => ({
      variables: {
        slug: router.query.slug
      }
    })
  })
)(Page)
