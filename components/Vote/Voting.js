import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { A, Button, colors, fontFamilies, fontStyles, Interaction, Radio } from '@project-r/styleguide'
import { timeFormat } from '../../lib/utils/format'
import voteT from './voteT'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'

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
    padding: '0 20px 15px 0px'
  }),
  cardActions: css({
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
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    padding: 10,
    textAlign: 'center'
  })
}

const messageDateFormat = timeFormat('%e. %B %Y')

class Voting extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pollState: POLL_STATES.START,
      selectedValue: null
    }

    this.reset = (e) => {
      e.preventDefault()
      this.setState(
        { selectedValue: null },
        this.transition(POLL_STATES.START)
      )
    }

    this.transition = (nextState, callback) => {
      this.setState({ pollState: nextState }, callback && callback())
    }

    this.renderWarning = () => {
      const { pollState, selectedValue } = this.state
      if (pollState === POLL_STATES.READY && !selectedValue) {
        return (
          <P {...styles.error}>
            Leer einlegen?
          </P>
        )
      } else {
        return null
      }
    }

    this.submitVotingBallot = async () => {
      const { submitVotingBallot } = this.props
      const { selectedValue } = this.state
      await submitVotingBallot(selectedValue)

      this.transition(POLL_STATES.DONE)
    }

    this.renderActions = () => {
      const { onFinish, vt } = this.props
      const { pollState } = this.state

      const resetLink = <A href='#' {...styles.link} onClick={this.reset}>{vt('vote/voting/labelReset')}</A>

      switch (pollState) {
        case POLL_STATES.START:
          return (
            <Fragment>
              <Button
                primary
                onClick={() => this.transition(POLL_STATES.READY)}
              >
                {vt('vote/voting/labelVote')}
              </Button>
              <div {...styles.link}>{vt('vote/voting/help')}</div>
            </Fragment>
          )
        case POLL_STATES.DIRTY:
          return (
            <Fragment>
              <Button
                primary
                onClick={() => this.transition(POLL_STATES.READY)}
              >
                {vt('vote/voting/labelVote')}
              </Button>
              {resetLink}
            </Fragment>
          )
        case POLL_STATES.READY:
          return (
            <Fragment>
              <Button
                primary
                onClick={() => this.submitVotingBallot()}
              >
                {vt('vote/voting/labelConfirm')}
              </Button>
              {resetLink}
            </Fragment>
          )
        case POLL_STATES.DONE:
          return (
            null
          )
      }
    }
  }

  render () {
    const { vt, data: { voting } } = this.props
    const { pollState, selectedValue } = this.state
    const { P } = Interaction
    return (
      <div {...styles.card}>
        <H3>{voting.description}</H3>
        <div style={{ position: 'relative' }}>
          {pollState === POLL_STATES.DONE &&
          <div {...styles.thankyou}>
            <P>
              {vt('vote/voting/thankyou', { submissionDate: messageDateFormat(Date.now()) })}
            </P>
          </div>
          }
          <div {...styles.cardBody}>
            {voting.options.map(({ id, label }) => (
              <Fragment key={id}>
                <Radio
                  value={id}
                  disabled={
                    pollState === POLL_STATES.DONE
                  }
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
          </div>
          {
            this.renderWarning()
          }
          <div {...styles.cardActions}>
            {this.renderActions()}
          </div>
        </div>
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
  mutation submitVotingBallot($optionId: ID!) {
    submitVotingBallot(optionId: $optionId) {
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
      submitVotingBallot: optionId => {
        return mutate({
          variables: {
            optionId
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
