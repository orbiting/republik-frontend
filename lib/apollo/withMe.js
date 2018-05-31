import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import runInApp from '../utils/runInApp'

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

let lastMe
const notifyApp = me => {
  if (me === lastMe) return

  window.postMessage(JSON.stringify({
    type: 'session',
    data: me
  }), '*')

  lastMe = me
}

export default graphql(meQuery, {
  props: ({ data }) => {
    // Notify native app about session state
    runInApp(() => { notifyApp(data.me) })

    return {
      me: data.me
    }
  }
})
