import React, { Component, Fragment } from 'react'
import { Button, Checkbox, Radio, Interaction, colors, fontStyles, A, mediaQueries } from '@project-r/styleguide'
import { compose, graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { css } from 'glamor';

const { H1, H2, H3, P } = Interaction

const ELECTION_STATES = {
  START: 'START',
  DIRTY: 'DIRTY',
  READY: 'READY',
  DONE: 'DONE',
}

// TODO create API?
import VoteActions from './VoteActions';
import { timeFormat } from '../../lib/utils/format';
import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../constants';
import ElectionBallot from './ElectionBallot';

const styles = {
  wrapper: css({
    width: '100%',
    position: 'relative',
    minHeight: 200,
    marginTop: 20,
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
      flexDirection: 'column',
      top: HEADER_HEIGHT_MOBILE,
    }
  }),
  actions: css({
    minHeight: 148,
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  }),
  sticky: css({
    position: 'sticky',
    bottom: 0,
  }),
  error: css({
    textAlign: 'center',
    width: '80%',
    margin: '10px auto',
    color: colors.error,
  }),
  link: css({
    marginTop: 10,
    color: colors.disabled,
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
    textAlign: 'center',
  }),
}

const messageDateFormat = timeFormat(' am %e. %B %Y um %H:%M ')

class Election extends Component {

  state = {
    vote: [],
    display: [],
    electionState: ELECTION_STATES.DIRTY
  }

  transition = (nextState, callback) => {
    this.setState({ electionState: nextState }, callback && callback())
  }

  toggleSelection = (candidateId) => {
    const allowMultiple = this.props.maxVotes > 1
    const collection = this.state.vote
    const existingItem =
      collection.find(item => item===candidateId)
    const nextCollection = [
      ...(allowMultiple ? collection.filter(item => item!==candidateId) : []),
      ...(existingItem ? [] : [candidateId])
    ]
    this.setState({
      vote: nextCollection, 
      electionState: nextCollection.length > 0 
        ? ELECTION_STATES.DIRTY 
        : ELECTION_STATES.START})
  }

  reset = e => {
    e.preventDefault()
    this.setState({vote: [], electionState: ELECTION_STATES.START})
  }

  renderActions = () => {
    const { onFinish, maxVotes } = this.props
    const { electionState, vote } = this.state

    const { P } = Interaction

    const resetLink = <A href='#' {...styles.link} onClick={this.reset}>Forumlar zurücksetzen</A>

    switch (electionState) {
      case ELECTION_STATES.START:
        return (
          <Fragment>
            <Button disabled>
              Wählen
            </Button>
            <div {...styles.link}>Bitte wählen Sie { maxVotes > 1 ? 'mindestens' : '' } eine Kandidatin</div>
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

  renderWarning = () => {
    const { electionState, vote } = this.state
    const { maxVotes } = this.props
    if (electionState===ELECTION_STATES.READY && vote.length < maxVotes) {
      return (
        <P {...styles.error}>
          { 
            `Sie haben erst ${vote.length} von ${maxVotes} Stimmen verteilt. Wollen Sie Ihre Wahl trotzdem bestätigen?`
          }
        </P>
      )  
    } else {
      return null
    }
  }

  render () {


    const { active, data, onFinish, recommendation, maxVotes, isSticky, ballotSize } = this.props
    const { vote, display, electionState } = this.state

    const SelectionComponent = maxVotes > 1 ? Checkbox : Radio

    const inProgress = electionState!==ELECTION_STATES.DONE

    // TODO remove this
    const candidates = data.users
      .filter(
        (d, i) =>
          [d.firstName, d.lastName].every(
            Boolean,
          ),
      )
      .filter((u,i) => i < (ballotSize || Number.MAX_VALUE))


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
          { recommendation.length > 0 && inProgress &&
            <Button 
              style={{height: 50}} 
              onClick={() => this.setState({
                vote: recommendation,
                electionState: ELECTION_STATES.DIRTY,
              })}
            >
              Wahlempfehlung übernehmen
            </Button>
          }
          { maxVotes > 1 && inProgress &&
            <P>Sie haben noch {maxVotes - vote.length} Stimmen übrig!</P>
          }
        </div>
        <div {...styles.wrapper}>
          <ElectionBallot
            allowMultiple={maxVotes > 1}
            candidates={candidates}
            selected={vote}
            onChange={this.toggleSelection}
          />
          { inProgress &&
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
  active: PropTypes.bool,
  maxVotes: PropTypes.number,
  data: PropTypes.object,
  onFinish: PropTypes.func,
  recommendation: PropTypes.array,
  isSticky: PropTypes.bool,
  ballotSize: PropTypes.number,
};

Election.defaultProps = {
  active: true,
  maxVotes: 1,
  data: { users: [] },
  recommendation: [],
  onFinish: () => {},
  isSticky: false,
}

const query = gql`
  query {
    users(search: "") {
      username
      id
      firstName
      lastName
      name
      email
      roles
      age
      statement
      hasPublicProfile
      birthday
      portrait
      biography
      badges
      credentials {
        description
      }
    }
  }
`


export default compose(
  graphql(query),
)(Election)
