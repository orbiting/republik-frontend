import React from 'react'
import Frame from '../../../components/Frame'
import Discussion from '../../../components/Discussion/Discussion'
import { withRouter } from 'next/router'
import { A, colors, Interaction, Center, mediaQueries, fontStyles } from '@project-r/styleguide'
import { css } from 'glamor'
import { Link } from '../../../lib/routes'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'

import { VOTING_COOP_201907_REVISION_SLUG, VOTING_COOP_201907_BUDGET_SLUG } from '../../../lib/constants'
import voteT from '../voteT'
import { Body, Section, Strong, Title } from '../text'
import Loader from '../../Loader'
import Icon from '../../Icons/Discussion'

const { P } = Interaction

const DISCUSSION_TITLES = {
  [VOTING_COOP_201907_REVISION_SLUG]: 'vote/revision19/discussion',
  [VOTING_COOP_201907_BUDGET_SLUG]: 'vote/budget19/discussion'
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
  }),
  count: css({
    marginLeft: 10,
    color: colors.primary,
    ...fontStyles.sansSerifMedium16
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
        const selectedDiscussion = isValid ? router.query.discussion : VOTING_COOP_201907_REVISION_SLUG
        const discussionId = (data[selectedDiscussion] && data[selectedDiscussion].discussion.id)
        const translationKey = DISCUSSION_TITLES[selectedDiscussion]

        return (
          <Center>
            <Title>{ vt('vote/201907/discussion/title') }</Title>
            <Section>
              <Body dangerousHTML={vt('vote/201907/discussion/intro')} />
            </Section>
            <div>
              <div {...styles.tabBarWRapper}>
                <div {...styles.tabBar}>
                  {
                    [
                      VOTING_COOP_201907_REVISION_SLUG,
                      VOTING_COOP_201907_BUDGET_SLUG
                    ].map(id =>
                      <div key={id} {...styles.tab}>
                        <P>
                          <Link route='vote201907Discuss' params={{
                            discussion: (data[id] && data[id].discussion.slug) || id
                          }} passHref scroll={false}>
                            { selectedDiscussion === id ? (
                              <Strong>
                                { vt(`${DISCUSSION_TITLES[id]}/title`) }
                                <span {...styles.count}><Icon size={17} fill={colors.primary} /> {data[id] && data[id].discussion.comments.totalCount}</span>
                              </Strong>
                            ) : (
                              <A>
                                { vt(`${DISCUSSION_TITLES[id]}/title`) }
                                <span {...styles.count}><Icon size={17} fill={colors.primary} /> {data[id] && data[id].discussion.comments.totalCount}</span>
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
              <Body dangerousHTML={vt(`${translationKey}/intro`)} />
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
  ${VOTING_COOP_201907_REVISION_SLUG}: voting(slug: "${VOTING_COOP_201907_REVISION_SLUG}") {
    id
    discussion {
      id
      comments {
        id
        totalCount
      }
    }
  }
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
