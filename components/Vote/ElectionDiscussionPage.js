import React from 'react'
import Frame from '../../components/Frame'
import Discussion from '../../components/Discussion/Discussion'
import { withRouter } from 'next/router'
import { A, colors, Interaction, NarrowContainer } from '@project-r/styleguide'
import { css } from 'glamor'
import { Link } from '../../lib/routes'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {
  ELECTION_COOP_MEMBERS_SLUG,
  ELECTION_COOP_PRESIDENT_SLUG,
  VOTING_COOP_BOARD_DISCUSSION,
  VOTING_COOP_META_DISCUSSION
} from '../../lib/constants'
import voteT from './voteT'
import { Body, Heading, Section, Title } from './text'
import Loader from '../Loader'

const {P} = Interaction

const DISCUSSION_TITLES = {
  [VOTING_COOP_META_DISCUSSION]: 'vote/discussion/meta',
  [VOTING_COOP_BOARD_DISCUSSION]: 'vote/discussion/board',
  [ELECTION_COOP_PRESIDENT_SLUG]: 'vote/discussion/president',
  [ELECTION_COOP_MEMBERS_SLUG]: 'vote/discussion/members',
}

const styles = {
  tabBar: css({
    margin: '30px 0',
  }),
  tab: css({
    marginRight: 20,
    display: 'inline-block'
  }),
}

const DiscussionPage = ({router, data, vt}) => {

  return (
    <Loader loading={ data.loading } error={ data.error } render={ () => {

      const selectedDiscussion = router.query.discussion || ELECTION_COOP_MEMBERS_SLUG

      const discussionId =
        (data[selectedDiscussion] && data[selectedDiscussion].discussion.id)
        || selectedDiscussion
        || data[ELECTION_COOP_MEMBERS_SLUG].discussion.id

      const translationKey = DISCUSSION_TITLES[selectedDiscussion || ELECTION_COOP_MEMBERS_SLUG]

      return (
        <Frame>
          <NarrowContainer>
            <Title>{ vt('vote/discussion/title') }</Title>
            <Section>
              <Body dangerousHTML={ vt('vote/discussion/intro') }/>
            </Section>
            { translationKey &&
            <div>
              <div { ...styles.tabBar }>
                {
                  [
                    VOTING_COOP_META_DISCUSSION,
                    VOTING_COOP_BOARD_DISCUSSION,
                    ELECTION_COOP_PRESIDENT_SLUG,
                    ELECTION_COOP_MEMBERS_SLUG
                  ].map(id =>
                    <div key={ id } { ...styles.tab }>
                      <Link route='voteDiscuss' params={ {
                        discussion: (data[id] && data[id].discussion.slug) || id,
                      } }>
                        { selectedDiscussion === id ? (
                          <span style={ {color: colors.disabled} }>
                            { vt(`${DISCUSSION_TITLES[id]}Title`) }
                          </span>
                        ) : (
                          <A href='#'>
                            { vt(`${DISCUSSION_TITLES[id]}Title`) }
                          </A>
                        )
                        }
                      </Link>
                    </div>
                  )
                }
              </div>
              <Heading>{ vt(`${translationKey}Title`) }</Heading>
              <Body dangerousHTML={ vt(`${translationKey}Intro`) }/>
              <Discussion
                discussionId={ discussionId }
                focusId={ router.query.commentId }
                mute={ !!router.query.mute }
              />
            </div>

            }
          </NarrowContainer>
        </Frame>
      )
    } }/>
  )
}

const query = gql`
  query {
  ${ELECTION_COOP_PRESIDENT_SLUG}: election(slug: "${ELECTION_COOP_PRESIDENT_SLUG}") {
    discussion {
      id
    }
   }
  ${ELECTION_COOP_MEMBERS_SLUG}: election(slug: "${ELECTION_COOP_MEMBERS_SLUG}") {
    discussion {
      id
    }
   }
  }
`

export default compose(
  voteT,
  withRouter,
  graphql(query),
)(DiscussionPage)

