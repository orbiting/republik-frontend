import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { A, Button, colors, fontFamilies, fontStyles, InlineSpinner, Interaction, Radio } from '@project-r/styleguide'
import { timeFormat } from '../../lib/utils/format'
import voteT from './voteT'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import ErrorMessage from '../ErrorMessage'

const { H3, P } = Interaction

const POLL_STATES = {
  START: 'START',
  DIRTY: 'DIRTY',
  READY: 'READY',
  DONE: 'DONE'
}

const styles = {
  card: css({
    margin: '40px auto',
    border: `1px solid ${colors.neutral}`,
    padding: 25,
    maxWidth: 550,
    width: '100%'
  }),
  cardTitle: css({
    fontSize: 22,
    fontFamily: fontFamilies.sansSerifMedium
  }),
  cardBody: css({
    marginTop: 15,
    position: 'relative',
  }),
  cardActions: css({
    marginTop: 15,
    height: 90,
    position: 'sticky',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  optionText: css({
    fontSize: 19
  }),
  link: css({
    marginTop: 10,
    ...fontStyles.sansSerifRegular14
  }),
  error: css({
    textAlign: 'center',
    width: '80%',
    margin: '10px auto',
    color: colors.error
  }),
  thankyou: css({
    background: colors.primaryBg,
    padding: '30px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  })
}

const messageDateFormat = timeFormat('%e. %B %Y')

class Voting extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      pollState: POLL_STATES.START,
      selectedValue: null,
    }

    this.reset = (e) => {
      e.preventDefault()
      this.setState(
        {selectedValue: null, error: null},
        this.transition(POLL_STATES.START)
      )
    }

    this.transition = (nextState, callback) => {
      this.setState({pollState: nextState}, callback && callback())
    }

    this.renderWarning = () => {
      const {pollState, selectedValue} = this.state
      if (pollState === POLL_STATES.READY && !selectedValue) {
        return (
          <P { ...styles.error }>
            Leer einlegen?
          </P>
        )
      } else {
        return null
      }
    }

    this.submitVotingBallot = async () => {
      const {submitVotingBallot} = this.props
      const {data: {voting}} = this.props
      const {selectedValue} = this.state

      this.setState({updating: true})

      await submitVotingBallot(voting.id, selectedValue).then(() => {
        return new Promise(resolve => setTimeout(resolve, 10000)) // insert delay to slow down UI
      }).then(() => {
        this.setState(() => ({
          pollState: POLL_STATES.DONE,
          updating: false,
          error: null,
        }))
      }).then(() => window.scrollTo(0, 0))
        .catch((error) => {
          this.setState(() => ({
            pollState: POLL_STATES.DIRTY,
            updating: false,
            error
          }))
        })
    }

    this.renderActions = () => {
      const {vt} = this.props
      const {pollState, updating} = this.state

      const resetLink = <A href='#' { ...styles.link } onClick={ this.reset }>{ vt('vote/voting/labelReset') }</A>

      switch (pollState) {
        case POLL_STATES.START:
          return (
            <Fragment>
              <Button
                primary
                onClick={ e => {
                  e.preventDefault()
                  this.transition(POLL_STATES.READY)
                } }
              >
                { vt('vote/voting/labelVote') }
              </Button>
              <div { ...styles.link }>{ vt('vote/voting/help') }</div>
            </Fragment>
          )
        case POLL_STATES.DIRTY:
          return (
            <Fragment>
              <Button
                primary
                onClick={ e => {
                  e.preventDefault()
                  this.transition(POLL_STATES.READY)
                } }
              >
                { vt('vote/voting/labelVote') }
              </Button>
              { resetLink }
            </Fragment>
          )
        case POLL_STATES.READY:
          return (
            <Fragment>
              <Button
                primary
                onClick={ e => {
                  e.preventDefault()
                  this.submitVotingBallot()
                } }
              >
                { updating
                  ? <InlineSpinner size={ 40 }/>
                  : vt('vote/voting/labelConfirm') }
              </Button>
              { updating ? <A>&nbsp;</A> : resetLink }
            </Fragment>
          )
        case POLL_STATES.DONE:
          return (
            null
          )
      }
    }

    this.renderVotingBody = () => {
      const {vt, data: {voting}} = this.props
      const {pollState, selectedValue} = this.state
      const {P} = Interaction

      if (voting.userHasSubmitted) {
        return (
          <div { ...styles.cardBody }>
            <div { ...styles.thankyou }>
              <P>
                { vt('vote/voting/thankyou', {submissionDate: messageDateFormat(new Date(voting.userSubmitDate))}) }
              </P>
            </div>
          </div>
        )
      } else if (new Date(voting.endDate) < Date.now()) {
        return (
          <div { ...styles.cardBody }>
            <div { ...styles.thankyou }>
              <P>
                { vt('vote/voting/comingSoon') }
              </P>
            </div>
          </div>
        )
      } else {
        return (
          <div {...styles.cardBody}>
            {voting.options.map(({ id, label }) => (
              <Fragment key={id}>
                <Radio
                  value={id}
                  checked={id === selectedValue}
                  onChange={() =>
                    this.setState(
                      { selectedValue: id },
                      this.transition(POLL_STATES.DIRTY)
                    )
                  }
                >
                  <span {...styles.optionText}>{label}</span>
                </Radio>
                <br />
              </Fragment>
            ))}
            {
              this.renderWarning()
            }
            <div { ...styles.cardActions }>
              { this.renderActions() }
            </div>
          </div>
        )
      }
    }
  }

  render () {
    const {data: {voting}} = this.props
    const {error, updating} = this.state
    return (
      <div { ...styles.card }>
        <H3>{ voting.description }</H3>
        { error &&
        <ErrorMessage error={ error }/>
        }
        {
          this.renderVotingBody()
        }
      </div>
    )
  }
}

Voting.propTypes = {
  slug: PropTypes.string.isRequired,
  data: PropTypes.shape({
    voting: PropTypes.shape({
      description: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          label: PropTypes.string
        })
      )
    })
  })
}

Voting.defaultProps = {
  data: {
    voting: {
      options: []
    }
  }
}

const submitVotingBallotMutation = gql`
  mutation submitVotingBallot($votingId: ID!, $optionId: ID) {
    submitVotingBallot(votingId: $votingId, optionId: $optionId) {
      id
      userHasSubmitted
      userSubmitDate    
    }
  }
`

const query = gql`
  query getVoting($slug: String!) {
    voting(slug: $slug) {
      id
      description
      slug
      beginDate
      endDate
      userSubmitDate
      userHasSubmitted
      options {
        id
        label
      }
    }
  }
`

export default compose(
  voteT,
  graphql(submitVotingBallotMutation, {
    props: ({ mutate }) => ({
      submitVotingBallot: (votingId, optionId) => {
        return mutate({
          variables: {
            votingId,
            optionId,
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
)(Voting)
