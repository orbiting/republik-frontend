import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const submitAnswerMutation = gql`
  mutation submitAnswer($answerId: ID!, $questionId: ID!, $payload: JSON) {
    submitAnswer(
      answer: { id: $answerId, questionId: $questionId, payload: $payload }
    ) {
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

const getQuestionnaire = gql`
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

export const withQuestionnaire = graphql(getQuestionnaire, {
  name: 'questionnaireData',
  options: ({ slug }) => ({
    variables: {
      slug
    }
  })
})

export const withQuestionnaireMutation = graphql(submitQuestionnaireMutation, {
  props: ({ mutate }) => ({
    submitQuestionnaire: id => {
      return mutate({
        variables: {
          id
        }
      })
    }
  })
})

export const withQuestionnaireReset = graphql(resetQuestionnaireMutation, {
  props: ({ mutate, ownProps: { slug } }) => ({
    resetQuestionnaire: id => {
      return mutate({
        variables: {
          id
        },
        refetchQueries: [
          {
            query: getQuestionnaire,
            variables: { slug }
          }
        ]
      })
    }
  })
})

export const withAnswerMutation = graphql(submitAnswerMutation, {
  props: ({ mutate, ownProps: { slug } }) => ({
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
          const queryObj = {
            query: getQuestionnaire,
            variables: { slug }
          }
          const data = proxy.readQuery(queryObj)
          const questionIx = data.questionnaire.questions.findIndex(
            q => q.id === questionId
          )
          data.questionnaire.questions[questionIx].userAnswer =
            submitAnswer.userAnswer
          proxy.writeQuery({ ...queryObj, data })
        }
      })
    }
  })
})
