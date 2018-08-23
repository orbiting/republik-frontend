import React from 'react'
import Frame from '../Frame'
import withMe from '../../lib/apollo/withMe'
import Poll from './Poll'
import { compose, graphql } from 'react-apollo'
import { enforceMembership } from '../Auth/withMembership'
import {
  Container,
  NarrowContainer,
  Interaction,
  Checkbox,
  mediaQueries,
  A
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

import { Agenda, AgendaItem, AgendaSection } from './Agenda'
import Election from './Election'
import { Router } from '../../lib/routes'
import { css } from 'glamor';

const { H1, H2, H3, P } = Interaction

const LOREM = 
  <P>
    Ihr naht euch wieder, schwankende Gestalten! Die früh sich einst dem trüben
    Blick gezeigt. Versuch’ ich wohl euch diesmal fest zu halten? Fühl’ ich
    mein Herz noch jenem Wahn geneigt? Ihr drängt euch zu! nun gut, so mögt ihr
    walten. Wie ihr aus Dunst und Nebel um mich steigt. Mein Busen fühlt sich
    jugendlich erschüttert. Vom Zauberhauch der euren Zug umwittert. Ihr bringt mit
    euch die Bilder froher Tage. Und manche liebe Schatten steigen auf Gleich einer
    alten, halbverklungnen Sage. Kommt erste Lieb’ und Freundschaft mit herauf Der
    Schmerz wird neu, es wiederholt die Klage. Des Lebens labyrinthisch irren Lauf,
    Und nennt die Guten, die, um schöne Stunden Vom Glück getäuscht, vor mir
    hinweggeschwunden.  
  </P>

const styles = {
  section: css({
    margin: '30px 0',
  }),
  anchor: css({
    display: 'block',
    position: 'relative',
    visibility: 'hidden',
    top: -HEADER_HEIGHT_MOBILE,
    [mediaQueries.lUp]: {
      top: -HEADER_HEIGHT
    }
  })
}

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pollStatus: {
        statement: false,
        report: false,
        budget: false,
        president: false,
        council: false
      }
    }
  }

  setDone = (key) => {
    this.setState((prevState) => ({
      pollStatus: { ...prevState.pollStatus, [key]: true }
    }))
  }

  render () {

    const meta = {
      title: 'Wahl des Genossenschaftsrats',
      description: 'Bestimme über die Zukunft der Republik!'
    }

    const { url, me } = this.props

    const options = [
      { value: 'yes', label: 'Ja' },
      { value: 'no', label: 'Nein' }
    ]


    return (
      <Frame meta={meta} url={url} disableNavBar={true}>
          {/* <Agenda>
            <AgendaSection title='Abstimmungen'>
              <AgendaItem
                done={this.state.pollStatus.statement}
                label='Jahresrechung'
                anchor='jahresrechung'
              />
              <AgendaItem
                done={this.state.pollStatus.report}
                label='Revisionsbericht'
                anchor='revisionsbericht'
              />
              <AgendaItem
                done={this.state.pollStatus.budget}
                label='Budget'
                anchor='budget'
              />
            </AgendaSection>
            <AgendaSection title='Abstimmungen'>
              <AgendaItem
                done={this.state.pollStatus.council}
                label='Ratsmitglieder'
                anchor='ratsmitglieder'
              />
              <AgendaItem
                done={this.state.pollStatus.president}
                label='Präsident'
                anchor='präsident'
              />
            </AgendaSection>
          </Agenda> */}

          <div style={{ marginTop: 0 }}>
            <Interaction.Headline>Wahlen und Abstimmungen</Interaction.Headline>
            {LOREM}
            <P>
              <A href={`${url.query.slug}/kandidieren`}>Kandidieren Sie jetzt!</A>
            </P>
            <section {...styles.section}>
             <a {...styles.anchor} id='jahresrechnung'></a>
              <H2>Jahresrechnung</H2>
              {LOREM}
              <Poll
                proposition='Wollen Sie die Jahresrechnung 2017 annehmen?'
                options={options}
                active={!this.state.pollStatus.statement}
                onFinish={() =>
                  this.setState(({ pollStatus }) => ({
                    pollStatus: { ...pollStatus, statement: true }
                  }))
                }
              />
            </section>

            <section {...styles.section}>
              <a {...styles.anchor} id='revisionsbericht'></a>
              <H2>Revisionsbericht</H2>
              {LOREM}
              <Poll
                proposition='Wollen Sie den Revisionsbericht 2017 annehmen?'
                options={options}
                active={!this.state.pollStatus.report}
                onFinish={() =>
                  this.setState(({ pollStatus }) => ({
                    pollStatus: { ...pollStatus, report: true }
                  }))
                }
              />
            </section>

            <section {...styles.section}>
              <a {...styles.anchor} id='budget'></a>
              <H2>Budget</H2>
              {LOREM}
              <Poll
                proposition='Wollen Sie das Budget 2018 annehmen?'
                options={options}
                active={!this.state.pollStatus.budget}
                onFinish={() =>
                  this.setState(({ pollStatus }) => ({
                    pollStatus: { ...pollStatus, budget: true }
                  }))
                }
              />
            </section>

            <section {...styles.section}>
              <a {...styles.anchor} id='präsidium'></a>
              <H2>Präsidium</H2>
              {LOREM}
              <Election
                ballotSize={5}
                active={!this.state.pollStatus.president}
                onFinish={() =>
                  this.setState(({ pollStatus }) => ({
                    pollStatus: { ...pollStatus, president: true }
                  }))
                }
              />
            </section>

            <section {...styles.section}>
              <a {...styles.anchor} id='genossenschaftsrat'></a>
              <H2>Genossenschaftsrat</H2>
              {LOREM}
              <Election
                maxVotes={10}
                isSticky={true}
                recommendation={["eeac9763-fc89-4980-8e67-4312c8ab4437", "eebbdfc9-ca9d-4b13-8eac-9bd5f6b5eade", "eebcd0bf-c3cf-4488-9340-1d4ffe32b063", "eec677ee-38b2-4163-b52f-2c08732c5c12", "eed9683f-83e9-42e7-bb45-8beda7f27d34", "eee4da68-7848-424c-9fdf-2ab58db256ec", "eeeb9ed0-5555-46c5-8376-ae8ded95c9b5", "eefcc77d-06b4-426a-9ec0-ef3d8454bed0", "685359da-c4d5-4269-b36e-eaa9c4455b5f", "8b7daeb4-e227-4451-9ca7-72905970f6b3"
                ]}
                active={!this.state.pollStatus.council}
                onFinish={() =>
                  this.setState(({ pollStatus }) => ({
                    pollStatus: { ...pollStatus, council: true }
                  }))
                }
              />
            </section>

          </div>
      </Frame>
    )
  }
}

export default compose(
  withMe,
)(Page)

const votingQuery = `
  query getVoting($name: String!) {
    id
    label
    description
    submitDate
    isEligible
    votingOptions {
      id
      name
    }
  }
`
const submitVotingBallotMutation = `
  mutation submitVotingBallot($votingId: String!, $votingOptionId: String!) {
    submitVotingBallot(votingId: $votingId, votingOptionId: $votingOptionId) {
      id
    }
  }
`


const candidateQuery = `
  query getCandidate($slug: String!) {
    user {
      name
      portrait
      yearOfBirth
      address {
        postalCode
      }
      credentials {
        description
      }
    }
    disclosure
    recommendation
    election {
      id
      name
    }
  }
`

const electionBallotMutation = `
  mutation submitElectionBallot($electionId: ID!, $candidateIds: [ID!]!) {
    id
  }
`

const councilElectionQuery = `
  query getElection($name: String!) {
    election(name: $name) {
      id
      name
      beginDate
      endDate
      candidates {
        id
        name
        statement
        portrait
      }  
    }
  }
`