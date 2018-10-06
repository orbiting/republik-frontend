import React from 'react'
import { compose, graphql } from 'react-apollo'
import Frame from '../../components/Frame'
import Discussion from '../../components/Discussion/Discussion'
import gql from 'graphql-tag'

import { ELECTION_COOP_MEMBERS_SLUG } from '../../lib/constants'
import voteT from './voteT'

const DiscussionPage = ({url, data}) => (
  <Frame url={url}>
    <h1>Hello</h1>
    <Discussion discussionId={data.election.discussion.id} focusId={url.query.focus} mute={!!url.query.mute} url={url}/>
  </Frame>
)

const query = gql`
  query { 
    election(slug: "${ELECTION_COOP_MEMBERS_SLUG}") {
      discussion {
        id
      }
    }
  }
`

export default compose(
  voteT,
  graphql(query),
)(DiscussionPage)
