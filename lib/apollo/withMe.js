import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export const meQuery = gql`
  query me {
    me {
      id
      username
      portrait
      name
      firstName
      lastName
      email
      initials
      roles
      hasPublicProfile
      discussionNotificationChannels
    }
  }
`

export default graphql(meQuery, {
  props: ({ data }) => {
    // Notify native app about session state
    if (process.browser) {
      window.postMessage(JSON.stringify({
        type: 'session',
        data: data.me
      }), '*')
    }

    return {
      me: data.me
    }
  }
})
