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
  FigureCaption,
  FigureImage,
  Interaction,
  mediaQueries,
  RawHtml
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'
import voteT from '../voteT'
import {
  CDN_FRONTEND_BASE_URL
} from '../../../lib/constants'
import { getVotingStage, VOTING_STAGES } from '../votingStage'
import Loader from '../../Loader'
import VoteInfo from './VoteInfo'
import AddressEditor from '../AddressEditor'
import VoteResult from '../VoteResult'

import {
  VOTINGS_COOP_201907 as VOTINGS,
  VOTING_COOP_201907_BUDGET_SLUG
} from '../constants'

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
      title: vt('vote/sm/title'),
      description: vt('vote/sm/description'),
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/vote.jpg`
    }

    return (
      <Frame meta={meta}>
        <Loader loading={data.loading} error={data.error} render={() => {
          const { beginDate, endDate, userIsEligible } = this.props.data[VOTING_COOP_201907_BUDGET_SLUG] || {}
          const votingStage = getVotingStage(beginDate, endDate)
          if (votingStage === VOTING_STAGES.INFO) {
            return (
              <VoteInfo />
            )
          }

          const { me } = data

          const userIsDone = VOTINGS
            .map(d => d.userHasSubmitted)
            .every(Boolean)

          const now = new Date()
          const hasEnded = VOTINGS
            .map(d => now > new Date(d.endDate))
            .every(Boolean)

          const hasResults = VOTINGS
            .map(d => d.result)
            .every(Boolean)

          const missingAdress = userIsEligible && !me.address

          const dangerousDisabledHTML = missingAdress
            ? vt('common/missingAddressDisabledMessage')
            : undefined

          return (
            <Fragment>
              {hasResults && <Section>
                <Title>{ vt('vote/result/title') }</Title>
                <Body dangerousHTML={vt('vote/result/lead')} />
                <VoteResult
                  votings={VOTINGS.map(({ id, slug }) => ({
                    id,
                    data: data[slug]
                  }))}
                />
                <Body dangerousHTML={vt('vote/result/after')} />
                <div style={{ height: 80 }} />
              </Section>}
              {hasEnded && !hasResults &&
              <div {...styles.thankyou}>
                <RawHtml
                  type={P}
                  dangerouslySetInnerHTML={{
                    __html: vt('vote/ended')
                  }} />
              </div>}
              <Section>
                <Title>{ vt('vote/201907/title') }</Title>
                <div {...styles.image}>
                  <FigureImage src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/info1.jpg?resize=780x`} />
                  <FigureCaption>{ vt('vote/intro/caption') }</FigureCaption>
                </div>
                <Body dangerousHTML={vt('vote/201907/intro/body1')} />
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
                <Body dangerousHTML={vt('vote/201907/intro/body2')} />
                <Collapsible>
                  <Small dangerousHTML={vt('vote/201907/intro/more')} />
                </Collapsible>
              </Section>

              {VOTINGS.map(({ id, slug }) => (
                <Section key={id}>
                  <a {...styles.anchor} id={id} />
                  <Heading>{ vt(`vote/${id}/title`) }</Heading>
                  <Body dangerousHTML={vt(`vote/${id}/body`)} />
                  <Collapsible>
                    <Small dangerousHTML={vt(`vote/${id}/more`)} />
                  </Collapsible>
                  <Voting
                    slug={slug}
                    dangerousDisabledHTML={dangerousDisabledHTML}
                  />
                </Section>
              ))}

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

const votingsQuery = VOTINGS.map(({ slug }) => `
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
    ${votingsQuery}
  }
`

export default compose(
  voteT,
  graphql(query)
)(VotePage)
