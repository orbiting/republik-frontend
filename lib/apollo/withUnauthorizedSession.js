import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export const unauthorizedSessionQuery = gql`
  query unauthorizedSession($email: String!, $token: String!) {
    unauthorizedSession(email: $email, token: $token) {
      ipAddress
      userAgent
      country
      city
    }
  }
`

export default graphql(unauthorizedSessionQuery, {
  props: ({ data }) => {
    return {
      unauthorizedSession: data.unauthorizedSession || undefined
    }
  }
})
