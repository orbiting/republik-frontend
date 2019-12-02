import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { BOOKMARKS_COLLECTION_NAME } from '../Bookmarks/fragments'

export const userDetailsFragment = `
  fragment Details on User {
    phoneNumber
    address {
      name
      line1
      line2
      postalCode
      city
      country
    }
  }
`

const mutation = gql`
  mutation updateMe(
    $birthday: Date
    $firstName: String!
    $lastName: String!
    $phoneNumber: String
    $address: AddressInput
  ) {
    updateMe(
      birthday: $birthday
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      address: $address
    ) {
      id
    }
  }
`
export const query = gql`
  query myAddress {
    me {
      id
      name
      firstName
      lastName
      email
      birthday
      ...Details
    }
  }
  ${userDetailsFragment}
`

export const onDocumentFragment = `
fragment BookmarkOnDocument on Document {
  userBookmark: userCollectionItem(collectionName: "${BOOKMARKS_COLLECTION_NAME}") {
    id
    createdAt
  }
}
`

export const withMyDetails = graphql(query, {
  name: 'detailsData'
})

export const withMyDetailsMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    updateDetails: variables =>
      mutate({
        variables,
        refetchQueries: [
          {
            query
          }
        ]
      })
  })
})
