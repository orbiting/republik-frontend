import React, { Component, Fragment, useMemo } from 'react'
import {
  A,
  Button,
  colors,
  fontFamilies,
  fontStyles,
  Interaction,
  mediaQueries,
  InlineSpinner,
  RawHtml,
  useColorContext
} from '@project-r/styleguide'
import { flowRight as compose } from 'lodash'
import { graphql } from '@apollo/client/react/hoc'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { css } from 'glamor'
import { FavoriteIcon, StarsIcon } from '@project-r/styleguide/icons'
import ElectionBallot from './ElectionBallot'
import voteT from './voteT'
import withMe from '../../lib/apollo/withMe'
import { timeFormat } from '../../lib/utils/format'
import ErrorMessage from '../ErrorMessage'
import Loader from '../Loader'

const { P } = Interaction

const messageDateFormat = timeFormat('%e. %B %Y')

const ELECTION_STATES = {
  START: 'START',
  DIRTY: 'DIRTY',
  READY: 'READY'
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
    top: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    zIndex: 10,
    [mediaQueries.onlyS]: {
      flexDirection: 'column-reverse',
      textAlign: 'center',
      margin: '0 0px'
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
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryBg
  }),
  sticky: css({
    position: 'sticky',
    bottom: 0
  }),
  confirm: css({
    textAlign: 'center',
    width: '80%',
    margin: '10px 0 15px 0'
  }),
  link: css({
    marginTop: 10
  }),
  thankyou: css({
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

const ElectionWrapper = props => {
  const [colorScheme] = useColorContext()
  const colorRule = useMemo(
    () => ({
      header: css({
        background: colorScheme.getCSSColor('default')
      }),
      actions: css({
        backgroundColor: colorScheme.getCSSColor('alert')
      }),
      thankyou: css({
        background: colorScheme.getCSSColor('alert')
      })
    }),
    [colorScheme]
  )
  return <Election {...props} colorRule={colorRule} />
}

class Election extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      vote: [],
      display: [],
      electionState: ELECTION_STATES.START
    }

    this.transition = nextState => {
      this.setState({ electionState: nextState })
    }

    this.toggleSelection = candidate => {
      const {
        data: {
          election: { numSeats }
        },
        onChange
      } = this.props
      const allowMultiple = numSeats > 1
      const collection = this.state.vote
      const existingItem = collection.find(item => item.id === candidate.id)
      const nextCollection = [
        ...(allowMultiple
          ? collection.filter(item => item.id !== candidate.id)
          : []),
        ...(existingItem ? [] : [candidate])
      ]
      this.setState(
        {
          vote: nextCollection,
          electionState:
            nextCollection.length > 0
              ? ELECTION_STATES.DIRTY
              : ELECTION_STATES.START
        },
        () => onChange(this.state.vote)
      )
    }

    this.submitBallot = async () => {
      const {
        onFinish,
        submitElectionBallot,
        data: {
          election: { id }
        }
      } = this.props
      const { vote } = this.state

      this.setState({ updating: true })

      await submitElectionBallot(
        id,
        vote.map(c => c.id)
      )
        .then(() => {
          this.setState(
            () => ({
              updating: false,
              error: null
            }),
            onFinish
          )
        })
        .catch(error => {
          this.setState(() => ({
            updating: false,
            error
          }))
        })
    }

    this.reset = e => {
      e.preventDefault()
      this.setState(
        {
          vote: [],
          electionState: ELECTION_STATES.START,
          error: null
        },
        () => this.props.onChange([])
      )
    }

    this.renderActions = () => {
      const { vt } = this.props
      const { electionState } = this.state

      const resetLink = (
        <A href='#' {...styles.link} onClick={this.reset}>
          {vt('vote/election/labelReset')}
        </A>
      )

      const { updating } = this.state
      switch (electionState) {
        case ELECTION_STATES.START:
          return (
            <Fragment>
              <Button
                key={'vote/election/labelVote'}
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
                key={'vote/election/labelVote'}
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
                key={'vote/election/labelConfirm'}
                primary
                onClick={() => this.submitBallot()}
              >
                {updating ? (
                  <InlineSpinner size={40} />
                ) : (
                  vt('vote/election/labelConfirm')
                )}
              </Button>
              {resetLink}
            </Fragment>
          )
      }
    }

    this.renderConfirmation = () => {
      const { electionState, vote } = this.state
      const {
        data: {
          election: { numSeats }
        },
        vt
      } = this.props
      if (electionState === ELECTION_STATES.READY) {
        return (
          <P {...styles.confirm}>
            {vote.length < numSeats
              ? vt.pluralize('vote/election/labelConfirmCount', {
                  count: vote.length,
                  numSeats,
                  remaining: numSeats - vote.length
                })
              : vt.pluralize('vote/election/labelConfirmAll', {
                  numSeats,
                  count: numSeats
                })}
          </P>
        )
      } else {
        return null
      }
    }

    this.selectRecommendation = () => {
      const { vote } = this.state
      const {
        data: { election },
        vt
      } = this.props

      const recommended = election.candidacies.filter(c => c.recommendation)
      const voteEqRecommendation =
        recommended
          .filter(e => !vote.find(u => u.id === e.id))
          .concat(vote.filter(e => !recommended.find(u => u.id === e.id)))
          .length < 1

      let replace = true
      if (vote.length > 0 && !voteEqRecommendation) {
        replace = window.confirm(vt('vote/election/confirmRecommendation'))
      }
      if (replace) {
        this.setState({
          vote: recommended,
          electionState: ELECTION_STATES.DIRTY
        })
      }
    }
  }

  render() {
    const {
      data,
      mandatoryCandidates,
      vt,
      showMeta,
      me,
      colorRule
    } = this.props
    const { election } = data

    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          if (!election) {
            return null
          }

          const { vote, error } = this.state
          const hasEnded = Date.now() > new Date(election.endDate)

          let dangerousDisabledHTML = this.props.dangerousDisabledHTML
          if (election.userHasSubmitted) {
            dangerousDisabledHTML = vt('vote/election/thankyou', {
              submissionDate: messageDateFormat(
                new Date(election.userSubmitDate)
              )
            })
          } else if (hasEnded) {
            dangerousDisabledHTML = vt('vote/election/ended')
          } else if (!me) {
            dangerousDisabledHTML = vt('vote/election/notSignedIn')
          } else if (!election.userIsEligible) {
            dangerousDisabledHTML = vt('vote/election/notEligible')
          }

          const inProgress = !dangerousDisabledHTML

          const [recommended, others] = election.candidacies.reduce(
            (acc, cur) => {
              acc[cur.recommendation ? 0 : 1].push(cur)
              return acc
            },
            [[], []]
          )

          const showHeader = recommended.length > 0 && election.numSeats > 1

          return (
            <div {...styles.wrapper}>
              {showHeader && (
                <div {...styles.header} {...colorRule.header}>
                  {election.numSeats > 1 && (
                    <div {...styles.info}>
                      {inProgress && (
                        <P>
                          <strong>
                            {vt('vote/election/votesRemaining', {
                              count: election.numSeats - vote.length,
                              max: election.numSeats
                            })}
                          </strong>
                        </P>
                      )}
                      {recommended.length > 0 && (
                        <span>
                          <StarsIcon size={18} />
                          {vt('vote/election/legendStar')}
                          <br />
                        </span>
                      )}
                      {mandatoryCandidates.length > 0 && (
                        <span>
                          <FavoriteIcon /> {vt('vote/election/legendHeart')}
                        </span>
                      )}
                    </div>
                  )}
                  {election.numSeats > 1 &&
                    recommended.length > 0 &&
                    inProgress && (
                      <Button
                        primary
                        style={{ ...fontStyles.sansSerifRegular16 }}
                        onClick={() => this.selectRecommendation()}
                      >
                        {vt('vote/members/recommendation')}
                      </Button>
                    )}
                </div>
              )}
              {dangerousDisabledHTML && (
                <div {...styles.wrapper} style={{ marginBottom: 30 }}>
                  <div {...styles.thankyou} {...colorRule.thankyou}>
                    <RawHtml
                      type={P}
                      dangerouslySetInnerHTML={{
                        __html: dangerousDisabledHTML
                      }}
                    />
                  </div>
                </div>
              )}
              <div {...styles.wrapper}>
                <ElectionBallot
                  maxVotes={election.numSeats}
                  candidacies={recommended.concat(others)}
                  selected={vote}
                  mandatory={mandatoryCandidates}
                  onChange={inProgress ? this.toggleSelection : undefined}
                  showMeta={showMeta}
                />
                {inProgress && (
                  <div {...styles.actions} {...colorRule.actions}>
                    {error && <ErrorMessage error={error} />}
                    {this.renderConfirmation()}
                    {this.renderActions()}
                  </div>
                )}
              </div>
            </div>
          )
        }}
      />
    )
  }
}

Election.propTypes = {
  onFinish: PropTypes.func,
  slug: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  mandatoryCandidates: PropTypes.array,
  showMeta: PropTypes.bool
}

Election.defaultProps = {
  data: { election: { candidacies: [] } },
  onChange: () => {},
  mandatoryCandidates: [],
  showMeta: true
}

const submitElectionBallotMutation = gql`
  mutation submitElectionBallot($electionId: ID!, $candidacyIds: [ID!]!) {
    submitElectionBallot(electionId: $electionId, candidacyIds: $candidacyIds) {
      id
      userHasSubmitted
      userSubmitDate
    }
  }
`

const query = gql`
  query getElection($slug: String!) {
    election(slug: $slug) {
      id
      userIsEligible
      userHasSubmitted
      userSubmitDate
      description
      beginDate
      endDate
      numSeats
      discussion {
        id
        comments {
          id
          totalCount
        }
      }
      candidacies {
        id
        yearOfBirth
        city
        recommendation
        comment {
          id
        }
        election {
          slug
          discussion {
            id
          }
        }
        user {
          id
          name
          username
          email
          statement
          portrait
          disclosures
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
  withMe,
  graphql(submitElectionBallotMutation, {
    props: ({ mutate }) => ({
      submitElectionBallot: (electionId, candidacyIds) => {
        return mutate({
          variables: {
            electionId,
            candidacyIds
          }
        })
      }
    })
  }),
  graphql(query, {
    options: ({ slug }) => ({
      variables: {
        slug
      }
    })
  })
)(ElectionWrapper)
