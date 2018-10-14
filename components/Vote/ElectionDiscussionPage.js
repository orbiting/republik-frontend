import React from 'react'
import { compose, graphql } from 'react-apollo'
import Frame from '../../components/Frame'
import Discussion from '../../components/Discussion/Discussion'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import { Interaction, NarrowContainer } from '@project-r/styleguide'

import { ELECTION_COOP_MEMBERS_SLUG, ELECTION_COOP_PRESIDENT_SLUG, VOTING_COOP_BOARD_SLUG, } from '../../lib/constants'
import voteT from './voteT'
import { Body, Section, Title } from './text'

const DiscussionPage = ({router, data, vt}) => console.log('ElectionDiscussionPage.js:19 [router.query]', router.query) || (
  <Frame>
    <NarrowContainer>
      <Title>{ vt('vote/discussion/title') }</Title>
      <Section>
        <Body dangerousHTML={ vt('vote/discussion/intro') }/>
      </Section>
      <Discussion
        discussionId={ router.query.discussionId }
        focusId={ router.query.commentId }
        mute={ !!router.query.mute }
      />
    </NarrowContainer>
  </Frame>
)

const electionsQuery = [ELECTION_COOP_MEMBERS_SLUG, ELECTION_COOP_PRESIDENT_SLUG].map(slug => `
  ${slug}: election(slug: "${slug}") {
    discussion {
      id
    }
   }
`).join('\n')

const votingsQuery = [
  VOTING_COOP_BOARD_SLUG
].map(slug => `
  ${slug}: voting(slug: "${slug}") {
    discussion {
      id
    }
  }
`).join('\n')

const query = gql`
  query {
    ${electionsQuery}
    ${votingsQuery}
  }
`

export default compose(
  voteT,
  withRouter,
  graphql(query),
)(DiscussionPage)
