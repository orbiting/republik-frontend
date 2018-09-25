import React, { Component, Fragment } from 'react'
import { Button, Interaction, colors, A, mediaQueries } from '@project-r/styleguide'
import { compose, graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { css } from 'glamor'

import { timeFormat } from '../../lib/utils/format'
import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../constants'
import ElectionBallot from './ElectionBallot'

const {P} = Interaction

const ELECTION_STATES = {
  START: 'START',
  DIRTY: 'DIRTY',
  READY: 'READY',
  DONE: 'DONE'
}

const styles = {
  wrapper: css({
    width: '100%',
    position: 'relative',
    minHeight: 200,
    marginTop: 20
  }),
  header: css({
    position: 'sticky',
    padding: '10px 0',
    top: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    zIndex: 10,
    [mediaQueries.onlyS]: {
      flexDirection: 'column-reverse',
      top: HEADER_HEIGHT_MOBILE
    }
  }),
  actions: css({
    minHeight: 148,
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }),
  sticky: css({
    position: 'sticky',
    bottom: 0
  }),
  error: css({
    textAlign: 'center',
    width: '80%',
    margin: '10px auto',
    color: colors.error
  }),
  link: css({
    marginTop: 10,
    color: colors.disabled
  }),
  thankyou: css({
    background: colors.primaryBg,
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    padding: 30,
    textAlign: 'center'
  })
}

const messageDateFormat = timeFormat(' am %e. %B %Y um %H:%M ')

class Election extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      vote: props.mandatoryCandidates,
      display: [],
      electionState: ELECTION_STATES.DIRTY
    }

    this.transition = (nextState, callback) => {
      this.setState({electionState: nextState}, callback && callback())
    }

    this.toggleSelection = (candidateId) => {
      const {data: {election: {numSeats}}, onChange} = this.props
      const allowMultiple = numSeats > 1
      const collection = this.state.vote
      const existingItem =
        collection.find(item => item === candidateId)
      const nextCollection = [
        ...(allowMultiple ? collection.filter(item => item !== candidateId) : []),
        ...(existingItem ? [] : [candidateId])
      ]
      this.setState({
        vote: nextCollection,
        electionState: nextCollection.length > 0
          ? ELECTION_STATES.DIRTY
          : ELECTION_STATES.START
      }, () => onChange(this.state.vote))
    }

    this.reset = e => {
      e.preventDefault()
      this.setState({vote: [], electionState: ELECTION_STATES.START})
    }

    this.renderActions = () => {
      const {onFinish, data: {election: {numSeats}}} = this.props
      const {electionState} = this.state

      const resetLink = <A href='#' {...styles.link} onClick={this.reset}>Formular zurücksetzen</A>

      switch (electionState) {
        case ELECTION_STATES.START:
          return (
            <Fragment>
              <Button
                black
                onClick={() => this.transition(ELECTION_STATES.READY)}
              >
                Wählen
              </Button>
              {resetLink}
            </Fragment>
          )
        case ELECTION_STATES.DIRTY:
          return (
            <Fragment>
              <Button
                black
                onClick={() => this.transition(ELECTION_STATES.READY)}
              >
                Wählen
              </Button>
              {resetLink}
            </Fragment>
          )
        case ELECTION_STATES.READY:
          return (
            <Fragment>
              <Button
                primary
                onClick={() =>
                  this.transition(ELECTION_STATES.DONE, onFinish)
                }
              >
                Wahl bestätigen
              </Button>
              {resetLink}
            </Fragment>
          )
        case ELECTION_STATES.DONE:
          return (
            null
          )
      }
    }

    this.renderWarning = () => {
      const {electionState, vote} = this.state
      const {data: {election: {numSeats}}} = this.props
      if (electionState === ELECTION_STATES.READY && vote.length < numSeats) {
        return (
          <P {...styles.error}>
            { vote.length < 1
                ? `Möchten Sie wirklich eine leere Stimme abgeben?`
                : `Sie haben erst ${vote.length} von ${numSeats} Stimmen verteilt. Wollen Sie Ihre Wahl trotzdem bestätigen?`
            }
          </P>
        )
      } else {
        return null
      }
    }
  }

  render () {
    const {data: {election}, isSticky, mandatoryCandidates} = this.props
    const {vote, electionState} = this.state
    const inProgress = electionState !== ELECTION_STATES.DONE
    const recommendedCandidates = election.candidates.filter(c => !!c.recommendation)

    if (!inProgress) {
      return (
        <div {...styles.wrapper}>
          <div {...styles.thankyou}>
            <P>
              Ihre Wahl ist am {messageDateFormat(Date.now())} bei uns eingegangen.<br />
              Danke für Ihre Teilnahme!
            </P>
          </div>
        </div>
      )
    }

    return (
      <div {...styles.wrapper}>
        <div {...styles.header}>
          {election.numSeats > 1 && inProgress &&
          <P>Sie haben noch {election.numSeats - vote.length - mandatoryCandidates.length}/{election.numSeats} Stimmen übrig!</P>
          }
          {recommendedCandidates.length > 0 && inProgress &&
          <Button
            style={{height: 50}}
            onClick={() => this.setState({
              vote: (recommendedCandidates.map(c => c.id)),
              electionState: ELECTION_STATES.DIRTY
            })}
          >
            Wahlempfehlung übernehmen
          </Button>
          }
        </div>
        <div {...styles.wrapper}>
          <ElectionBallot
            maxVotes={election.numSeats}
            candidates={election.candidates}
            selected={vote}
            onChange={this.toggleSelection}
          />
          {inProgress &&
          <div {...styles.actions} {...(isSticky && vote.length > 0 && styles.sticky)}>
            {
              this.renderWarning()
            }
            {
              this.renderActions()
            }
          </div>
          }
        </div>
      </div>
    )
  }
}

Election.propTypes = {
  onFinish: PropTypes.func,
  isSticky: PropTypes.bool,
  slug: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  mandatoryCandidates: PropTypes.array,
}

Election.defaultProps = {
  data: {election: {candidates: []}},
  isSticky: false,
  onChange: () => {},
  mandatoryCandidates: [],
}

const query = gql`
  query getElection($slug: String!) {
    election(slug: $slug) {
    description
    beginDate
    numSeats
    discussion {
      documentPath
      comments {
        totalCount
        nodes {
          content
        }
      }
    }
    candidates {
      id
      yearOfBirth
      city
      recommendation
      user {
        id
        firstName
        lastName
        username
        email
        statement
        portrait
        credentials {
          isListed
          description
        }
      }
    }
   }
 }
`

export default compose(
  graphql(query, {
    options: ({slug}) => ({
      variables: {
        slug
      }
    })
  })
)(Election)
