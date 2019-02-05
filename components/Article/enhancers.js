import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Progress from './Progress'

export const userProgressFragment = `
  fragment UserProgressOnDocument on Document {
    userProgress {
      id
      percentage
      nodeId
      createdAt
      updatedAt
    }
  }
`

const upsertDocumentProgressMutation = gql`
  mutation upsertDocumentProgress(
    $documentId: ID!
    $percentage: Float!
    $nodeId: String!
  ) {
    upsertDocumentProgress(documentId: $documentId, percentage: $percentage, nodeId: $nodeId) {
      id
      document {
        id
        ...UserProgressOnDocument
      }
    }
  }
  ${userProgressFragment}
`

export const userConsentFragment = `
  fragment Consent on User {
    hasConsentedTo(name: "PROGRESS")
  }
`

const consentQuery = gql`
  query myProgressConsent {
    myProgressConsent: me {
      id
      ...Consent
    }
  }
  ${userConsentFragment}
`

const submitConsentMutation = gql`
  mutation submitConsent {
    submitConsent(name: "PROGRESS") {
      id
      ...Consent
    }
  }
  ${userConsentFragment}
`

const revokeConsentMutation = gql`
  mutation revokeConsent {
    revokeConsent(name: "PROGRESS") {
      id
      ...Consent
    }
  }
  ${userConsentFragment}
`

export const embedsOnDocumentFragment = `
  fragment EmbedsOnDocument on Document {
    embeds {
      __typename
      ... on PlayableMedia {
        mediaId
        durationMs
        userProgress {
          id
          ms
          createdAt
          updatedAt
        }
      }
    }
  }
`

const upsertMediaProgressMutation = gql`
  mutation upsertMediaProgress(
    $mediaId: ID!
    $ms: Int!
  ) {
    upsertMediaProgress(mediaId: $mediaId, ms: $ms) {
      mediaId
      ms
      createdAt
      updatedAt
    }
  }
`

export const withProgress = WrappedComponent => {
  return compose(
    graphql(consentQuery, {
      props: ({ data, errors }) => ({
        WrappedComponent,
        data,
        loading: data.loading || !data.myProgressConsent,
        error: data.error,
        myProgressConsent: data.loading
          ? undefined
          : data.myProgressConsent
      })
    }),
    graphql(submitConsentMutation, {
      props: ({ mutate }) => ({
        submitConsent: mutate
      })
    }),
    graphql(revokeConsentMutation, {
      props: ({ mutate }) => ({
        revokeConsent: mutate
      })
    }),
    graphql(upsertDocumentProgressMutation, {
      props: ({ mutate }) => ({
        upsertDocumentProgress: (documentId, percentage, nodeId) =>
          mutate({
            variables: {
              documentId,
              percentage,
              nodeId
            }
          })
      })
    }),
    graphql(upsertMediaProgressMutation, {
      props: ({ mutate }) => ({
        upsertMediaProgress: (mediaId, ms) =>
          mutate({
            variables: {
              mediaId,
              ms
            }
          })
      })
    })
  )(Progress)
}
