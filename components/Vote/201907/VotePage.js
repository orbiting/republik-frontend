import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { Body, Heading, Section, Small, Title } from '../text'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Frame from '../../Frame'
import SignIn from '../../Auth/SignIn'
import Collapsible from '../Collapsible'
import Voting from '../Voting'
import {
  colors,
  A,
  Interaction,
  mediaQueries,
  RawHtml,
  IconButton
} from '@project-r/styleguide'
import { DiscussionIcon } from '@project-r/styleguide/icons'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'
import voteT from '../voteT'
import { CDN_FRONTEND_BASE_URL, PUBLIC_BASE_URL } from '../../../lib/constants'
import { budgetData, total } from './data'
import { getVotingStage, VOTING_STAGES } from '../votingStage'
import ActionBar from '../../ActionBar'
import BudgetChart from './BudgetChart'
import Loader from '../../Loader'
import VoteInfo from './VoteInfo'
import VoteResult from '../VoteResult'

import {
  VOTINGS_COOP_201907 as VOTINGS,
  VOTING_COOP_201907_BUDGET_SLUG
} from '../constants'
import Link from 'next/link'

const { P } = Interaction

const styles = {
  actions: css({
    display: 'flex',
    margin: '0 0 20px 0',
    [mediaQueries.lUp]: {
      margin: '30px 0'
    },
    '& a': { marginLeft: 16 }
  }),
  anchor: css({
    display: 'block',
    position: 'relative',
    visibility: 'hidden',
    top: -HEADER_HEIGHT_MOBILE,
    [mediaQueries.lUp]: {
      top: -HEADER_HEIGHT
    }
  }),
  image: css({
    margin: '25px 0'
  }),
  thankyou: css({
    margin: '25px auto',
    maxWidth: 550,
    padding: 25,
    background: colors.primaryBg,
    textAlign: 'center'
  }),
  chart: css({
    margin: '30px auto',
    [mediaQueries.mUp]: {
      margin: '50px auto'
    },
    maxWidth: '400px'
  })
}

class VotePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      president: []
    }

    this.onVoteChange = field => value => {
      this.setState({ [field]: value })
    }
  }

  render() {
    const { vt, data } = this.props

    const meta = {
      title: vt('vote/201907/page/title'),
      description: vt('vote/201907/page/description'),
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/vote-juli19.png`
    }

    return (
      <Frame meta={meta}>
        <Loader
          loading={data.loading}
          error={data.error}
          render={() => {
            const { beginDate, endDate, discussion, groupTurnout } =
              this.props.data[VOTING_COOP_201907_BUDGET_SLUG] || {}
            const votingStage = getVotingStage(beginDate, endDate)
            if (votingStage === VOTING_STAGES.INFO) {
              return <VoteInfo />
            }

            const votings = [...VOTINGS.map(({ slug }) => data[slug])]

            const { me } = data
            const numVotes = groupTurnout && groupTurnout.submitted

            const userIsDone = votings
              .map(d => d.userHasSubmitted)
              .every(Boolean)

            const now = new Date()
            const hasEnded = votings
              .map(d => now > new Date(d.endDate))
              .every(Boolean)

            const hasResults = votings.map(d => d.result).every(Boolean)

            const shareObject = {
              url: `${PUBLIC_BASE_URL}/vote/juli19`,
              title: vt('vote/201907/page/title'),
              tweet: vt('vote/201907/sm/tweet'),
              emailSubject: vt('vote/201907/sm/emailSubject'),
              emailBody: vt('vote/201907/sm/emailBody')
            }

            const actionBar = (
              <div {...styles.actions}>
                <ActionBar share={shareObject} />
                {discussion && (
                  <Link path={discussion.path} passHref>
                    <IconButton
                      Icon={DiscussionIcon}
                      label={
                        discussion.comments
                          ? discussion.comments.totalCount
                          : undefined
                      }
                      labelShort={
                        discussion.comments
                          ? discussion.comments.totalCount
                          : undefined
                      }
                      fill={colors.primary}
                    />
                  </Link>
                )}
              </div>
            )

            return (
              <Fragment>
                {hasResults && (
                  <Fragment>
                    <Title>{vt('vote/201907/result/title')}</Title>
                    <Body dangerousHTML={vt('vote/201907/result/lead')} />
                    <VoteResult
                      votings={VOTINGS.map(({ id, slug }) => ({
                        id,
                        data: data[slug]
                      }))}
                    />
                    <Body dangerousHTML={vt('vote/201907/result/after')} />
                    <div style={{ height: 80 }} />
                  </Fragment>
                )}
                {hasEnded && !hasResults && (
                  <div {...styles.thankyou}>
                    <RawHtml
                      type={P}
                      dangerouslySetInnerHTML={{
                        __html: vt('vote/201907/ended')
                      }}
                    />
                  </div>
                )}
                <Fragment>
                  <a {...styles.anchor} id='budget' />
                  <Title>
                    <RawHtml
                      dangerouslySetInnerHTML={{
                        __html: vt('vote/201907/title')
                      }}
                    />
                  </Title>
                  {actionBar}
                  <Body
                    dangerousHTML={vt('vote/201907/intro/body1', {
                      count: numVotes
                    })}
                  />
                  <Collapsible>
                    <Small dangerousHTML={vt('vote/201907/intro/more1')} />
                  </Collapsible>
                  <div {...styles.chart}>
                    <BudgetChart data={budgetData} total={total} />
                    <Small
                      dangerousHTML={vt('vote/201907/budget/chart/caption')}
                      indent={false}
                    />
                  </div>
                  <Body dangerousHTML={vt('vote/201907/intro/body2')} />
                  <Collapsible>
                    <Small dangerousHTML={vt('vote/201907/intro/more2')} />
                  </Collapsible>
                  {!me && !hasEnded && (
                    <div style={{ margin: '30px 0' }}>
                      <SignIn
                        beforeForm={
                          <Fragment>
                            <Heading>{vt('common/signInTitle')}</Heading>
                            <RawHtml
                              type={P}
                              dangerouslySetInnerHTML={{
                                __html: vt('vote/201907/signInBody')
                              }}
                            />
                          </Fragment>
                        }
                      />
                    </div>
                  )}
                </Fragment>

                {VOTINGS.map(({ id, slug }) => (
                  <Section key={id}>
                    <a {...styles.anchor} id={id} />
                    <Heading>{vt(`vote/${id}/title`)}</Heading>
                    <Body dangerousHTML={vt(`vote/${id}/body`)} />
                    <Collapsible>
                      <Small dangerousHTML={vt(`vote/${id}/more`)} />
                    </Collapsible>
                    <Voting slug={slug} />
                  </Section>
                ))}

                {!hasEnded && (
                  <Body dangerousHTML={vt('vote/201907/nextsteps')} />
                )}

                {userIsDone && (
                  <div {...styles.thankyou}>
                    <RawHtml
                      type={P}
                      dangerouslySetInnerHTML={{
                        __html: vt('vote/201907/thankyou')
                      }}
                    />
                  </div>
                )}
                {actionBar}
                <P>
                  <A href='/meta'>{vt('vote/201907/back')}</A>
                </P>
              </Fragment>
            )
          }}
        />
      </Frame>
    )
  }
}

const votingsQuery = VOTINGS.map(
  ({ slug }) => `
  ${slug}: voting(slug: "${slug}") {
    id
    userHasSubmitted
    userSubmitDate
    userIsEligible
    beginDate
    endDate
    description
    turnout {
      eligible
      submitted
    }
    groupTurnout {
      eligible
      submitted
    }
    result {
      options {
        count
        winner
        option {
          id
          label
        }
      }
    }
    discussion {
      id
      path
      comments {
        id
        totalCount
      }
    }
   }
`
).join('\n')

const query = gql`
  query votePage {
    me {
      id
      address {
        name
        line1
        postalCode
        city
        country
      }
    }
    ${votingsQuery}
  }
`

export default compose(voteT, graphql(query))(VotePage)
