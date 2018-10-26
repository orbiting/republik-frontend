import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { Body, Heading, Section, Small, Title } from './text'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Frame from '../Frame'
import SignIn from '../Auth/SignIn'
import Collapsible from './Collapsible'
import Voting from './Voting'
import Election from './Election'
import {
  colors,
  FigureCaption,
  FigureImage,
  Interaction,
  mediaQueries,
  RawHtml
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import voteT from './voteT'
import {
  CDN_FRONTEND_BASE_URL,
  ELECTION_COOP_MEMBERS_SLUG,
  ELECTION_COOP_PRESIDENT_SLUG,
  VOTING_COOP_ACCOUNTS_SLUG,
  VOTING_COOP_BOARD_SLUG,
  VOTING_COOP_BUDGET_SLUG,
  VOTING_COOP_DISCHARGE_SLUG
} from '../../lib/constants'
import { getVotingStage, VOTING_STAGES } from './votingStage'
import Loader from '../Loader'
import VoteInfo from './VoteInfo'
import AddressEditor from './AddressEditor'
import VoteCounter from './VoteCounter'

const { P } = Interaction

const styles = {
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
    marginTop: 25,
    padding: 25,
    background: colors.primaryBg
  })
}

class VotePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      president: []
    }

    this.onVoteChange = (field) => (value) => {
      this.setState({ [field]: value })
    }
  }

  render () {
    const { vt, data } = this.props

    const meta = {
      title: vt('info/title'),
      description: vt('vote/sm/description'),
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/vote.jpg`
    }

    return (
      <Frame meta={meta}>
        <Loader loading={data.loading} error={data.error} render={() => {
          const { beginDate, endDate, userIsEligible } = this.props.data[ELECTION_COOP_MEMBERS_SLUG] || {}
          const votingStage = getVotingStage(beginDate, endDate)
          if (votingStage === VOTING_STAGES.INFO) {
            return (
              <VoteInfo />
            )
          }

          const { me } = data

          const votingsAndElections = [
            ELECTION_COOP_MEMBERS_SLUG,
            ELECTION_COOP_PRESIDENT_SLUG,
            VOTING_COOP_ACCOUNTS_SLUG,
            VOTING_COOP_DISCHARGE_SLUG,
            VOTING_COOP_BUDGET_SLUG,
            VOTING_COOP_BOARD_SLUG
          ].map(slug => this.props.data[slug])

          const userIsDone = votingsAndElections
            .map(d => d.userHasSubmitted)
            .every(Boolean)

          const now = new Date()
          const hasEnded = votingsAndElections
            .map(d => now > new Date(d.endDate))
            .every(Boolean)

          const missingAdress = userIsEligible && !me.address

          const dangerousDisabledHTML = missingAdress
            ? vt('common/missingAddressDisabledMessage')
            : undefined

          return (
            <Fragment>
              {hasEnded &&
              <div {...styles.thankyou}>
                <RawHtml
                  type={P}
                  dangerouslySetInnerHTML={{
                    __html: vt('vote/ended')
                  }} />
              </div>}
              <Section>
                <Title>{ vt('vote/title') }</Title>
                <div {...styles.image}>
                  <FigureImage src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/info1.jpg?resize=780x`} />
                  <FigureCaption>{ vt('vote/intro/caption') }</FigureCaption>
                </div>
                <VoteCounter hasEnded={hasEnded} />
                <Body dangerousHTML={vt('vote/intro/body1')} />
                {missingAdress && <Fragment>
                  <a {...styles.anchor} id='adresse' />
                  <Heading>{vt('common/missingAddressTitle')}</Heading>
                  <P>{vt('common/missingAddressBody')}</P>
                  <div style={{ margin: '30px 0' }}>
                    <AddressEditor />
                  </div>
                </Fragment>}
                {!me && !hasEnded && <div style={{ margin: '30px 0' }}>
                  <SignIn beforeForm={(
                    <Fragment>
                      <Heading>{vt('common/signInTitle')}</Heading>
                      <RawHtml
                        type={P}
                        dangerouslySetInnerHTML={{
                          __html: vt('common/signInBody')
                        }}
                      />
                    </Fragment>
                  )} />
                </div>}
                <Body dangerousHTML={vt('vote/intro/body2')} />
                <Collapsible>
                  <Small dangerousHTML={vt('vote/intro/more')} />
                </Collapsible>
              </Section>

              <Section>
                <a {...styles.anchor} id='accounts' />
                <Heading>{ vt('vote/jahresrechnung/title') }</Heading>
                <Body dangerousHTML={vt('vote/jahresrechnung/body')} />
                <Collapsible>
                  <Small dangerousHTML={vt('vote/jahresrechnung/more')} />
                </Collapsible>
                <Voting
                  slug={VOTING_COOP_ACCOUNTS_SLUG}
                  dangerousDisabledHTML={dangerousDisabledHTML}
                />
              </Section>

              <Section>
                <a {...styles.anchor} id='discharge' />
                <Heading>{ vt('vote/discharge/title') }</Heading>
                <Body dangerousHTML={vt('vote/discharge/body')} />
                <Collapsible>
                  <Small dangerousHTML={vt('vote/discharge/more')} />
                </Collapsible>
                <Voting
                  slug={VOTING_COOP_DISCHARGE_SLUG}
                  dangerousDisabledHTML={dangerousDisabledHTML}
                />
              </Section>

              <Section>
                <a {...styles.anchor} id='budget' />
                <Heading>{ vt('vote/budget/title') }</Heading>
                <Body dangerousHTML={vt('vote/budget/body')} />
                <Collapsible>
                  <Small dangerousHTML={vt('vote/budget/more')} />
                </Collapsible>
                <Voting
                  slug={VOTING_COOP_BUDGET_SLUG}
                  dangerousDisabledHTML={dangerousDisabledHTML}
                />
              </Section>

              <Section>
                <a {...styles.anchor} id='board' />
                <Heading>{ vt('vote/board/title') }</Heading>
                <Body dangerousHTML={vt('vote/board/body')} />
                <Collapsible>
                  <Small dangerousHTML={vt('vote/board/more')} />
                </Collapsible>
                <Voting
                  slug={VOTING_COOP_BOARD_SLUG}
                  dangerousDisabledHTML={dangerousDisabledHTML}
                />
              </Section>

              <Section>
                <a {...styles.anchor} id='president' />
                <Heading>{ vt('vote/president/title') }</Heading>
                <Body dangerousHTML={vt('vote/president/body')} />
                <Collapsible>
                  <Small dangerousHTML={vt('vote/president/more')} />
                </Collapsible>
                <Election
                  showMeta={false}
                  slug={ELECTION_COOP_PRESIDENT_SLUG}
                  onChange={this.onVoteChange('president')}
                  dangerousDisabledHTML={dangerousDisabledHTML}
                />
              </Section>

              <Section>
                <a {...styles.anchor} id='genossenschaftsrat' />
                <Heading>{ vt('vote/members/title') }</Heading>
                <Body dangerousHTML={vt('vote/members/body1')} />
                <div {...styles.image}>
                  <FigureImage
                    src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/grid.genossenschaftsrat3.jpg?resize=780x`} />
                  <FigureCaption>{ vt('vote/members/caption') }</FigureCaption>
                </div>
                <Body dangerousHTML={vt('vote/members/body2')} />
                <Collapsible>
                  <Small dangerousHTML={vt('vote/members/more')} />
                </Collapsible>
                <Election
                  slug={ELECTION_COOP_MEMBERS_SLUG}
                  mandatoryCandidates={this.state.president}
                  dangerousDisabledHTML={dangerousDisabledHTML}
                />
              </Section>
              { userIsDone &&
              <div {...styles.thankyou}>
                <RawHtml
                  type={P}
                  dangerouslySetInnerHTML={{
                    __html: vt('vote/common/thankyou')
                  }} />
              </div>
              }
            </Fragment>
          )
        }} />
      </Frame>
    )
  }
}

const electionsQuery = [ELECTION_COOP_MEMBERS_SLUG, ELECTION_COOP_PRESIDENT_SLUG].map(slug => `
  ${slug}: election(slug: "${slug}") {
    id
    userHasSubmitted
    userSubmitDate
    userIsEligible    
    beginDate
    endDate
    turnout {
      submitted
    }
   }
`).join('\n')

const votingsQuery = [
  VOTING_COOP_ACCOUNTS_SLUG,
  VOTING_COOP_DISCHARGE_SLUG,
  VOTING_COOP_BUDGET_SLUG,
  VOTING_COOP_BOARD_SLUG
].map(slug => `
  ${slug}: voting(slug: "${slug}") {
    id
    userHasSubmitted
    userSubmitDate
    userIsEligible
    beginDate
    endDate
    turnout {
      submitted
    }
   }
`).join('\n')

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
    ${electionsQuery}
    ${votingsQuery}
  }
`

export default compose(
  voteT,
  graphql(query)
)(VotePage)
