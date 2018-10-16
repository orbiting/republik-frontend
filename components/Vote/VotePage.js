import React, { Component } from 'react'
import { css } from 'glamor'
import { Body, Heading, Section, Small, Title } from './text'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Frame from '../../components/Frame'
import Collapsible from './Collapsible'
import Voting from './Voting'
import Election from './Election'
import {
  colors,
  Container,
  NarrowContainer,
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
    background: colors.secondaryBg
  })
}

class VoteForm extends Component {
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
      description: vt('info/description')
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

          const { me: { address } } = data
          if (userIsEligible && (!address || !Object.keys(address).map(k => address[k]).every(Boolean))) {
            return (
              <div>
                <NarrowContainer>
                  <Heading>{vt('common/missingAddressTitle')}</Heading>
                  <P>{vt('common/missingAddressBody')}</P>
                  <Section>
                    <AddressEditor />
                  </Section>
                </NarrowContainer>
              </div>
            )
          }

          const isDone = [
            ELECTION_COOP_MEMBERS_SLUG,
            ELECTION_COOP_PRESIDENT_SLUG,
            VOTING_COOP_ACCOUNTS_SLUG,
            VOTING_COOP_DISCHARGE_SLUG,
            VOTING_COOP_BUDGET_SLUG,
            VOTING_COOP_BOARD_SLUG
          ].map(slug => this.props.data[slug] && this.props.data[slug].userHasSubmitted).every(Boolean)

          return (
            <Container>
              <Section>
                <Title>{ vt('vote/title') }</Title>
                <div {...styles.image}>
                  <FigureImage src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/info1.jpg?resize=650x`} />
                  <FigureCaption>{ vt('vote/intro/caption') }</FigureCaption>
                </div>
                <VoteCounter slug={ELECTION_COOP_MEMBERS_SLUG} />
                <Body dangerousHTML={vt('vote/intro/body')} />
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
                  slug={ELECTION_COOP_PRESIDENT_SLUG}
                  onChange={this.onVoteChange('president')}
                />
              </Section>

              <Section>
                <a {...styles.anchor} id='genossenschaftsrat' />
                <Heading>{ vt('vote/members/title') }</Heading>
                <Body dangerousHTML={vt('vote/members/body1')} />
                <div {...styles.image}>
                  <FigureImage
                    src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/grid.genossenschaftsrat3.jpg?resize=650x`} />
                  <FigureCaption>{ vt('vote/members/caption') }</FigureCaption>
                </div>
                <Body dangerousHTML={vt('vote/members/body2')} />
                <Collapsible>
                  <Small dangerousHTML={vt('vote/members/more')} />
                </Collapsible>
                <Election
                  slug={ELECTION_COOP_MEMBERS_SLUG}
                  isSticky
                  mandatoryCandidates={this.state.president}
                />
              </Section>
              { isDone &&
              <div {...styles.thankyou}>
                <RawHtml
                  type={P}
                  dangerouslySetInnerHTML={{
                    __html: vt('vote/common/thankyou')
                  }} />
              </div>
              }
            </Container>
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
   }
`).join('\n')

const query = gql`
  query {
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
)(VoteForm)
