import gql from 'graphql-tag'
import { documentFragment } from '../Feed/fragments'

const variablesAsJSONStrings = []

export const getRefetchQueries = () =>
  variablesAsJSONStrings.map(string => ({
    query: getCollectionItems,
    variables: JSON.parse(string)
  }))

export const registerQueryVariables = variables => {
  const string = JSON.stringify(variables)
  if (!variablesAsJSONStrings.includes(string)) {
    variablesAsJSONStrings.push(string)
  }
}

export const getCollectionItems = gql`
  query getCollectionItems(
    $cursor: String
    $collections: [String!]!
    $progress: ProgressState
  ) {
    me {
      id
      collectionItems(
        names: $collections
        first: 50
        after: $cursor
        progress: $progress
        uniqueDocuments: true
        lastDays: 30
      ) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          createdAt
          document {
            ...FeedDocument
          }
        }
      }
    }
  }
  ${documentFragment}
`
