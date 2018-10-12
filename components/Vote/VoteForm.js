import React, { Component } from 'react'
import { css } from 'glamor'
import { Body, Heading, Section, Small, Title } from './text'
import Collapsible from './Collapsible'
import Voting from './Voting'
import Election from './Election'
import {
  Container,
  FigureCaption,
  FigureImage,
  mediaQueries
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import voteT from './voteT'
import { CDN_FRONTEND_BASE_URL, ELECTION_COOP_MEMBERS_SLUG, ELECTION_COOP_PRESIDENT_SLUG } from '../../lib/constants'

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
    const { vt } = this.props

    return (
      <Container>
        <Section>
          <Title>{vt('vote/title')}</Title>
          <div {...styles.image}>
            <FigureImage src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/info1.jpg?resize=650x`} />
            <FigureCaption>{ vt('vote/intro/caption') }</FigureCaption>
          </div>
          <Body dangerousHTML={vt('vote/intro/body')} />
          <Collapsible>
            <Small dangerousHTML={vt('vote/intro/more')} />
          </Collapsible>
        </Section>

        <Section>
          <a {...styles.anchor} id='jahresrechnung' />
          <Heading>{ vt('vote/jahresrechnung/title') }</Heading>
          <Body dangerousHTML={vt('vote/jahresrechnung/body')} />
          <Collapsible>
            <Small dangerousHTML={vt('vote/jahresrechnung/more')} />
          </Collapsible>
          <Voting
            slug='gen18accounts'
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
            slug='gen18discharge'
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
            slug='gen18budget'
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
            slug='gen18board'
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
            <FigureImage src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/council_candidates.png?resize=650x`} />
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
      </Container>
    )
  }
}

export default voteT(VoteForm)
