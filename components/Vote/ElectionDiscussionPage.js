import React from 'react'
import Frame from '../../components/Frame'
import Discussion from '../../components/Discussion/Discussion'
import { withRouter } from 'next/router'
import { A, colors, Interaction, NarrowContainer, mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'
import { Link } from '../../lib/routes'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

import { ELECTION_COOP_MEMBERS_SLUG, ELECTION_COOP_PRESIDENT_SLUG, VOTING_COOP_BOARD_SLUG } from '../../lib/constants'
import voteT from './voteT'
import { Body, Section, Strong, Title } from './text'
import Loader from '../Loader'

const { P } = Interaction

const DISCUSSION_TITLES = {
  [VOTING_COOP_BOARD_SLUG]: 'vote/discussion/board',
  [ELECTION_COOP_PRESIDENT_SLUG]: 'vote/discussion/president',
  [ELECTION_COOP_MEMBERS_SLUG]: 'vote/discussion/members'
}

const styles = {
  tabBarWRapper: css({
    margin: '0 -10px',
    padding: '0 10px',
    background: '#fff',
    position: 'sticky',
    zIndex: 10,
    top: HEADER_HEIGHT - 1,
    [mediaQueries.onlyS]: {
      top: HEADER_HEIGHT_MOBILE - 1
    }
  }),
  tabBar: css({
    padding: '10px 0px 20px 0px',
    borderTop: `0.5px solid ${colors.divider}`
  }),
  tab: css({
    marginRight: 20,
    display: 'inline-block'
  })
}

const DiscussionPage = ({ router, data, vt }) => {
  const meta = {
    title: vt('info/title'),
    description: vt('info/description')
  }

  return (
    <Frame meta={meta}>
      <Loader loading={data.loading} error={data.error} render={() => {
        const isValid = DISCUSSION_TITLES[router.query.discussion]
        const selectedDiscussion = isValid ? router.query.discussion : VOTING_COOP_BOARD_SLUG
        const discussionId = (data[selectedDiscussion] && data[selectedDiscussion].discussion.id)
        const translationKey = DISCUSSION_TITLES[selectedDiscussion]

        return (
          <NarrowContainer>
            <Title>{ vt('vote/discussion/title') }</Title>
            <Section>
              <Body dangerousHTML={vt('vote/discussion/intro')} />
            </Section>
            <div>
              <div {...styles.tabBarWRapper}>
                <div {...styles.tabBar}>
                  {
                    [
                      VOTING_COOP_BOARD_SLUG,
                      ELECTION_COOP_PRESIDENT_SLUG,
                      ELECTION_COOP_MEMBERS_SLUG
                    ].map(id =>
                      <div key={id} {...styles.tab}>
                        <P>
                          <Link route='voteDiscuss' params={{
                            discussion: (data[id] && data[id].discussion.slug) || id
                          }} passHref scroll={false}>
                            { selectedDiscussion === id ? (
                              <Strong>{ vt(`${DISCUSSION_TITLES[id]}Title`) }</Strong>
                            ) : (
                              <A>
                                { vt(`${DISCUSSION_TITLES[id]}Title`) }
                              </A>
                            )
                            }
                          </Link>
                        </P>
                      </div>
                    )
                  }
                </div>
              </div>
              <Body dangerousHTML={vt(`${translationKey}Intro`)} />
              <Discussion
                discussionId={discussionId}
                focusId={router.query.commentId}
                mute={!!router.query.mute}
              />
            </div>
          </NarrowContainer>
        )
      }} />
    </Frame>
  )
}

const query = gql`
  query {
  ${ELECTION_COOP_PRESIDENT_SLUG}: election(slug: "${ELECTION_COOP_PRESIDENT_SLUG}") {
    id
    discussion {
      id
    }
   }
  ${ELECTION_COOP_MEMBERS_SLUG}: election(slug: "${ELECTION_COOP_MEMBERS_SLUG}") {
    id
    discussion {
      id
    }
   }
  ${VOTING_COOP_BOARD_SLUG}: voting(slug: "${VOTING_COOP_BOARD_SLUG}") {
    id
    discussion {
      id
    }
   }
  }
`

export default compose(
  voteT,
  withRouter,
  graphql(query)
)(DiscussionPage)
