import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'

export const userProgressFragment = `
  fragment UserProgressOnDocument on Document {
    userProgress {
      id
      percentage
      nodeId
      createdAt
      updatedAt
      max {
        id
        percentage
      }
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

const userConsentFragment = `
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

const upsertMediaProgressMutation = gql`
  mutation upsertMediaProgress(
    $mediaId: ID!
    $secs: Float!
  ) {
    upsertMediaProgress(mediaId: $mediaId, secs: $secs) {
      id
      mediaId
      secs
      createdAt
      updatedAt
    }
  }
`

export const mediaProgressQuery = gql`
  query mediaProgress($mediaId: ID!) {
    mediaProgress(mediaId: $mediaId) {
      id
      mediaId
      secs
    }
  }
`

export const userProgressOnAudioSourceFragment = `
  fragment UserProgressOnAudioSource on AudioSource {
    mediaId
    durationMs
  }
`

export const withProgressApi = compose(
  withApollo,
  graphql(consentQuery, {
    props: ({ data, errors }) => ({
      data,
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
