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
  Button,
  A,
  InlineSpinner,
  fontFamilies,
  RawHtml
} from '@project-r/styleguide'

import TextQuestion from './TextQuestion'
import ArticleQuestion from './ArticleQuestion'
import RangeQuestion from './RangeQuestion'
import ChoiceQuestion from './ChoiceQuestion'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import withT from '../../lib/withT'
import withAuthorization from '../Auth/withAuthorization'
import { errorToString } from '../../lib/utils/errors'
import { Link, Router } from '../../lib/routes'
import StatusError from '../StatusError'
import Results from './Results'

const { Headline, P } = Interaction

const QUESTION_TYPES = {
  QuestionTypeDocument: ArticleQuestion,
  QuestionTypeText: TextQuestion,
  QuestionTypeChoice: ChoiceQuestion,
  QuestionTypeRange: RangeQuestion
}

const styles = {
  intro: css({
    marginTop: 35
  }),
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

  handleSubmit = () => {
    this.setState({ submitting: true })
    const { submitQuestionnaire, data: { questionnaire: { id } } } = this.props
    this.processSubmit(
      submitQuestionnaire,
      id
    ).then(() => Router.pushRoute('/verlag').then(() => window.scrollTo(0, 0)))
  }

  handleReset = e => {
    const { resetQuestionnaire, data: { questionnaire: { id } } } = this.props
    e.preventDefault()
    this.processSubmit(
      resetQuestionnaire,
      id
    ).then(() => window.scrollTo(0, 0))
  }

  render () {
    const { data, t, meta, showResults, router } = this.props

    return (
      <Frame meta={meta}>
        <Loader loading={data.loading} error={data.error} render={() => {
          // handle not found or not started
          if (!data.questionnaire || new Date(data.questionnaire.beginDate) > new Date()) {
            return (
              <StatusError
                statusCode={404}
                serverContext={this.props.serverContext} />
            )
          }

          // handle already submitted
          const { questionnaire: { userHasSubmitted, questions } } = data
          const { error, submitting, updating } = this.state
          if (!submitting && userHasSubmitted) {
            return (
              <>
                <Headline>{t('questionnaire/title')}</Headline>
                <div {...styles.thankyou}>
                  <P>
                    {t.elements('questionnaire/thankyou', {
                      metaLink: <Link key='meta' route='/verlag' passHref>
                        <A>{t('questionnaire/thankyou/metaText')}</A>
                      </Link>
                    })}
                  </P>
                </div>
                {showResults && <>
                  <P style={{ marginBottom: 20, color: colors.error }}>
                    Diese Resultate werden <Interaction.Emphasis>nur intern</Interaction.Emphasis> angezeigt.
                  </P>
                  <Results slug={router.query.slug} />
                </>}
              </>
            )
          }

          // handle questions
          const questionCount = questions.filter(Boolean).length
          const userAnswerCount = questions.map(q => q.userAnswer).filter(Boolean).length
          return (
            <div>
              <Headline>{t('questionnaire/title')}</Headline>
              <div {...styles.intro}>
                <RawHtml type={P} dangerouslySetInnerHTML={{ __html: t('questionnaire/intro') }} /><br />
              </div>
              <div {...styles.count}>
                { error
                  ? <P {...styles.error}>{errorToString(error)}</P>
                  : <>
                    <P {...styles.strong}>{t('questionnaire/header', { questionCount, userAnswerCount })}</P>
                    {
                      questionCount === userAnswerCount
                        ? <div {...styles.progressIcon}><CheckCircle size={22} color={colors.primary} /></div>
                        : (updating || submitting)
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
                      onChange: this.createHandleChange(q.id),
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
                  disabled={updating || submitting || userAnswerCount < 1}
                >
                  { (updating || submitting)
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

const resetQuestionnaireMutation = gql`
mutation resetQuestionnaire($id: ID!) {
  resetQuestionnaire(id: $id) {
    id
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
query getQuestionnaire($slug: String!) {
  questionnaire(slug: $slug) {
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
  withRouter,
  withAuthorization(['supporter', 'editor'], 'showResults'),
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
    props: ({ mutate, ownProps: { router } }) => ({
      resetQuestionnaire: (id) => {
        return mutate({
          variables: {
            id
          },
          refetchQueries: [{ query, variables: { slug: router.query.slug } }]
        })
      }
    })
  }),
  graphql(submitAnswerMutation, {
    props: ({ mutate, ownProps: { router } }) => ({
      submitAnswer: (questionId, payload, answerId) => {
        return mutate({
          variables: {
            answerId,
            questionId,
            payload
          },
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
            data.questionnaire.questions[questionIx].userAnswer = submitAnswer.userAnswer
            proxy.writeQuery({ ...queryObj, data })
          }
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
