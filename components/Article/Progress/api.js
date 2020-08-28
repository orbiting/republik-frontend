import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { userProgressConsentFragment } from '../../../lib/apollo/withMe'

export const userProgressFragment = `
  fragment UserProgressOnDocument on Document {
    userProgress {
      id
      percentage
      nodeId
      updatedAt
      max {
        id
        percentage
        updatedAt
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
    upsertDocumentProgress(
      documentId: $documentId
      percentage: $percentage
      nodeId: $nodeId
    ) {
      id
      document {
        id
        ...UserProgressOnDocument
      }
    }
  }
  ${userProgressFragment}
`

const removeDocumentProgress = gql`
  mutation removeDocumentProgress($documentId: ID!) {
    removeDocumentProgress(documentId: $documentId) {
      id
      document {
        id
        ...UserProgressOnDocument
      }
    }
  }
  ${userProgressFragment}
`

export const progressConsentQuery = gql`
  query progressConset {
    me {
      hasConsentedTo(name: "PROGRESS")
    }
  }
`

export const submitConsentMutation = gql`
  mutation submitConsent {
    submitConsent(name: "PROGRESS") {
      id
      ...ProgressConsent
    }
  }
  ${userProgressConsentFragment}
`

export const revokeConsentMutation = gql`
  mutation revokeConsent {
    revokeConsent(name: "PROGRESS") {
      id
      ...ProgressConsent
    }
  }
  ${userProgressConsentFragment}
`

const upsertMediaProgressMutation = gql`
  mutation upsertMediaProgress($mediaId: ID!, $secs: Float!) {
    upsertMediaProgress(mediaId: $mediaId, secs: $secs) {
      id
      mediaId
      secs
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

export const withProgressApi = compose(
  graphql(submitConsentMutation, {
    props: ({ mutate }) => ({
      submitProgressConsent: mutate
    })
  }),
  graphql(revokeConsentMutation, {
    props: ({ mutate }) => ({
      revokeProgressConsent: mutate
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
  graphql(removeDocumentProgress, {
    props: ({ mutate }) => ({
      removeDocumentProgress: documentId =>
        mutate({
          variables: {
            documentId
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
