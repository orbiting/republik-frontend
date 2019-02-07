import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

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
          secs
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
    $secs: Float!
  ) {
    upsertMediaProgress(mediaId: $mediaId, secs: $secs) {
      mediaId
      secs
      createdAt
      updatedAt
    }
  }
`

export const withProgressApi = compose(
  graphql(consentQuery, {
    props: ({ data, errors }) => ({
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
      upsertMediaProgress: (mediaId, secs) =>
        mutate({
          variables: {
            mediaId,
            secs
          }
        })
    })
  })
)
