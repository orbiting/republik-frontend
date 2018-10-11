import React, { Component, Fragment } from 'react'
import { A, Button, colors, fontFamilies, fontStyles, Interaction, mediaQueries } from '@project-r/styleguide'
import { compose, graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { css } from 'glamor'
import FavoriteIcon from 'react-icons/lib/md/favorite'
import StarsIcon from 'react-icons/lib/md/stars'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import ElectionBallot from './ElectionBallot'
import voteT from './voteT'
import { timeFormat } from '../../lib/utils/format'

const { P } = Interaction

const messageDateFormat = timeFormat('%e. %B %Y')

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
    minHeight: 200
  }),
  header: css({
    position: 'sticky',
    padding: '20px 0',
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
  info: css({
    '& strong': {
      fontFamily: fontFamilies.sansSerifMedium,
      fontWeight: 'normal'
    },
    [mediaQueries.onlyS]: {
      marginTop: 5
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
    marginTop: 10
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

class Election extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      vote: [],
      display: [],
      electionState: ELECTION_STATES.START
    }

    this.transition = (nextState, callback) => {
      this.setState({ electionState: nextState }, callback && callback())
    }

    this.toggleSelection = (candidate) => {
      const { data: { election: { numSeats } }, onChange } = this.props
      const allowMultiple = numSeats > 1
      const collection = this.state.vote
      const existingItem =
        collection.find(item => item.id === candidate.id)
      const nextCollection = [
        ...(allowMultiple ? collection.filter(item => item.id !== candidate.id) : []),
        ...(existingItem ? [] : [candidate])
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
      this.setState({ vote: [], electionState: ELECTION_STATES.START }, () => this.props.onChange([]))
    }

    this.renderActions = () => {
      const { onFinish, vt } = this.props
      const { electionState } = this.state

      const resetLink = <A href='#' {...styles.link} onClick={this.reset}>{vt('vote/election/labelReset')}</A>

      switch (electionState) {
        case ELECTION_STATES.START:
          return (
            <Fragment>
              <Button
                primary
                onClick={() => this.transition(ELECTION_STATES.READY)}
              >
                {vt('vote/election/labelVote')}
              </Button>
              <div {...styles.link}>{vt('vote/election/help')}</div>
            </Fragment>
          )
        case ELECTION_STATES.DIRTY:
          return (
            <Fragment>
              <Button
                primary
                onClick={() => this.transition(ELECTION_STATES.READY)}
              >
                {vt('vote/election/labelVote')}
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
                {vt('vote/election/labelConfirm')}
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
      const { electionState, vote } = this.state
      const { data: { election: { numSeats } }, vt } = this.props
      if (electionState === ELECTION_STATES.READY && vote.length < numSeats) {
        return (
          <P {...styles.error}>
            { vote.length < 1
              ? vt('vote/election/labelConfirmEmpty')
              : vt('vote/election/labelConfirmCount', { numVotes: vote.length, numSeats })
            }
          </P>
        )
      } else {
        return null
      }
    }
  }

  render () {
    const { data: { election }, isSticky, mandatoryCandidates, vt } = this.props
    const { vote, electionState } = this.state
    const inProgress = electionState !== ELECTION_STATES.DONE

    if (!inProgress) {
      return (
        <div {...styles.wrapper}>
          <div {...styles.thankyou}>
            <P>
              {vt('vote/election/thankyou', { submissionDate: messageDateFormat(Date.now()) })}
            </P>
          </div>
        </div>
      )
    }

    const listOfCandidates = electionState === ELECTION_STATES.READY
      ? election.candidacies.filter(c => vote.some(v => v.id === c.id))
      : election.candidacies

    const [recommended, others] = listOfCandidates.reduce((acc, cur) => {
      acc[cur.recommendation ? 0 : 1].push(cur)
      return acc
    }, [[], []])

    const showHeader = recommended.length > 0 || election.numSeats > 1

    return (
      <div {...styles.wrapper}>
        <div {...(showHeader && styles.header)}>
          {election.numSeats > 1 &&
          <div {...styles.info}>
            {inProgress &&
            <P>
              <strong>{vt('vote/election/votesRemaining', {
                count: election.numSeats - vote.length,
                max: election.numSeats
              })}</strong>
            </P>
            }
            {recommended.length > 0 &&
            <span><StarsIcon size={18} color={colors.lightText} />{' '}{vt('vote/election/legendStar')}<br /></span>
            }
            {mandatoryCandidates.length > 0 &&
            <span><FavoriteIcon color={colors.lightText} />{' '}{vt('vote/election/legendHeart')}</span>
            }
          </div>
          }
          {recommended.length > 0 && inProgress &&
          <Button
            primary
            style={{ ...fontStyles.sansSerifRegular18 }}
            onClick={() => this.setState({
              vote: recommended,
              electionState: ELECTION_STATES.DIRTY
            })}
          >
            {vt('vote/members/recommendation')}
          </Button>
          }
        </div>
        <div />
        <div {...styles.wrapper}>
          <ElectionBallot
            maxVotes={election.numSeats}
            candidacies={recommended.concat(others)}
            selected={vote}
            mandatory={mandatoryCandidates}
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
  mandatoryCandidates: PropTypes.array
}

Election.defaultProps = {
  data: { election: { candidacies: [] } },
  isSticky: false,
  onChange: () => {},
  mandatoryCandidates: []
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
    candidacies {
      id
      yearOfBirth
      city
      recommendation
#      comment {
#        id
#      }
      user {
        id
        name
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
  voteT,
  graphql(query, {
    options: ({ slug }) => ({
      variables: {
        slug
      }
    })
  })
)(Election)
