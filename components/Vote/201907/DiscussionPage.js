import React from 'react'
import Frame from '../../../components/Frame'
import Discussion from '../../../components/Discussion/Discussion'
import { withRouter } from 'next/router'
import { Center, mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { VOTING_COOP_201907_BUDGET_SLUG } from '../../../lib/constants'
import voteT from '../voteT'
import { Body, Section, Title } from '../text'
import Loader from '../../Loader'

const styles = {
  discussion: css({
    marginTop: 20,
    [mediaQueries.mUp]: {
      marginTop: 40
    }
  })
}

const DISCUSSION_SLUG = VOTING_COOP_201907_BUDGET_SLUG

const DiscussionPage = ({ router, data, vt }) => {
  const meta = {
    title: vt('info/title'),
    description: vt('info/description')
  }

  return (
    <Frame meta={meta}>
      <Loader loading={data.loading} error={data.error} render={() => {
        const discussionId = (data[DISCUSSION_SLUG] && data[DISCUSSION_SLUG].discussion.id)
        return (
          <Center>
            <Title>{ vt('vote/201907/discussion/title') }</Title>
            <Section>
              <Body dangerousHTML={vt('vote/201907/discussion/intro')} />
            </Section>
            <div {...styles.discussion}>
              <Discussion
                discussionId={discussionId}
                focusId={router.query.focus}
                mute={!!router.query.mute}
              />
            </div>
          </Center>
        )
      }} />
    </Frame>
  )
}

const query = gql`
  query discussionPage {
  ${VOTING_COOP_201907_BUDGET_SLUG}: voting(slug: "${VOTING_COOP_201907_BUDGET_SLUG}") {
    id
    discussion {
      id
      comments {
        id
        totalCount
      }
    }
   }
  }
`

export default compose(
  voteT,
  withRouter,
  graphql(query)
)(DiscussionPage)
