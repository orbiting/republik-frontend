import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

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
      phoneNumber
      email
      birthday
      address {
        name
        line1
        line2
        postalCode
        city
        country
      }
    }
  }
`

export const withMyDetails = graphql(query, {
  name: 'detailsData'
})

export const withMyDetailsMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    update: variables =>
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
