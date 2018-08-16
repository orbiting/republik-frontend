import React, { Component, Fragment } from 'react'
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'
import ChevronDownIcon from 'react-icons/lib/md/expand-more'
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
import postcodes from './postcodes.json'
import VoteActions from './VoteActions';
import { timeFormat } from '../../lib/utils/format';

const styles = {
  wrapper: css({
    width: '100%',
    position: 'relative',
    minHeight: 200,
    marginTop: 20,
  }),
  header: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [mediaQueries.onlyS]: {
      flexDirection: 'column'
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
  table: css({
    width: '100%',
    marginTop: 20,
    cursor: 'pointer',
    [`& tr td:nth-child(3), tr td:nth-child(4), tr td:nth-child(5)`]: {
      display: 'table-cell',
      [mediaQueries.onlyS]: {
        display: 'none'
      }
    },
    '& tr td:first-child, tr td:last-child': {
      width: 1,
    }
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

const POSTCODE_REGIONS = {
  1000: 'Westschweiz',
  2000: 'Westschweiz',
  3000: 'Bern/Oberwallis',
  4000: 'Basel',
  5000: 'Aargau',
  6000: 'Zentralschweiz',
  6500: 'Tessin',
  7000: 'Graubünden',
  8000: 'Zürich/Thurgau',
  9000: 'Ostschweiz',
}

function getRegion(user) {
  const code = postcodes[user.postcode] || 8000
  return POSTCODE_REGIONS[Math.floor(code/1000)*1000]
}

const messageDateFormat = timeFormat(' am %e. %B %Y um %H:%M ')

class Election extends Component {

  state = {
    vote: [],
    display: [],
    electionState: ELECTION_STATES.START
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
          [d.firstName, d.lastName, d.birthday].every(
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
          <table {...styles.table}>
            <tbody>
            { candidates
              .map((d, i) => {
                const showDetails = display.some(id => id===d.id)
                return (
                  <React.Fragment>
                    <tr>
                      <td>
                        {
                          showDetails
                            ? <ChevronDownIcon/>
                            : <ChevronRightIcon />
                        }
                      </td>
                      <td>
                        {d.firstName} {d.lastName}
                      </td>
                      <td>
                        {new Date(
                          d.birthday.split('.')[2],
                        ).getFullYear() || ''}
                      </td>
                      <td>
                        {d.credentials.length > 0 &&
                        d.credentials.length[0] &&
                        d.credentials.length[0].description}
                      </td>
                      <td>Kindergärtner</td>
                      <td>{getRegion(d)}</td>
                      <td>
                        <SelectionComponent
                          disabled={!active}
                          checked={vote.findIndex(id => id===d.id)>-1} 
                          onChange={() => this.toggleSelection(d.id)} 
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
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
