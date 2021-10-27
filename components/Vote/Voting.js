import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import {
  A,
  Button,
  InlineSpinner,
  Interaction,
  Radio,
  RawHtml,
  Loader
} from '@project-r/styleguide'
import { timeFormat } from '../../lib/utils/format'
import withMe from '../../lib/apollo/withMe'
import voteT from './voteT'
import { gql } from '@apollo/client'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import ErrorMessage from '../ErrorMessage'
import AddressEditor, { withAddressData } from './AddressEditor'
import SignIn from '../Auth/SignIn'
import { Card, sharedStyles } from './text'

const { P } = Interaction

const POLL_STATES = {
  START: 'START',
  DIRTY: 'DIRTY',
  READY: 'READY'
}

const styles = {
  thankyou: css({
    padding: '30px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }),
  confirm: css({
    textAlign: 'center',
    marginBottom: 10
  }),
  content: css({
    width: '80%',
    margin: '10px auto 0 auto'
  }),
  buttons: css({
    padding: '15px 0'
  })
}

const messageDateFormat = timeFormat('%e. %B %Y')

class Voting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pollState: POLL_STATES.START,
      selectedValue: null
    }

    this.reset = e => {
      e.preventDefault()
      this.setState({
        selectedValue: null,
        error: null,
        pollState: POLL_STATES.START
      })
    }

    this.renderConfirmation = () => {
      const { pollState, selectedValue } = this.state
      const {
        vt,
        data: { voting }
      } = this.props
      if (pollState === POLL_STATES.READY) {
        return (
          <div {...styles.confirm}>
            <P>
              {selectedValue
                ? `Mit ${vt(
                    `vote/voting/option${
                      voting.options.find(o => o.id === selectedValue).label
                    }`
                  )} stimmen? `
                : `Leer einlegen? `}
            </P>
          </div>
        )
      } else {
        return null
      }
    }

    this.submitVotingBallot = () => {
      const { submitVotingBallot } = this.props
      const {
        data: { voting }
      } = this.props
      const { selectedValue } = this.state

      this.setState({ updating: true })

      submitVotingBallot(voting.id, selectedValue)
        .then(() => {
          this.setState({
            updating: false,
            error: null
          })
        })
        .catch(error => {
          this.setState({
            pollState: POLL_STATES.DIRTY,
            updating: false,
            error
          })
        })
    }

    this.renderActions = () => {
      const { vt } = this.props
      const { pollState, updating } = this.state

      const resetLink = (
        <Interaction.P style={{ marginLeft: 30 }}>
          <A href='#' onClick={this.reset}>
            {vt('vote/voting/labelReset')}
          </A>
        </Interaction.P>
      )

      switch (pollState) {
        case POLL_STATES.START:
          return (
            <div {...sharedStyles.buttons}>
              <Button
                key={'vote/voting/labelVote'}
                primary
                onClick={e => {
                  e.preventDefault()
                  this.setState({
                    pollState: POLL_STATES.READY
                  })
                }}
              >
                {vt('vote/voting/labelVote')}
              </Button>
            </div>
          )
        case POLL_STATES.DIRTY:
          return (
            <div {...sharedStyles.buttons}>
              <Button
                key={'vote/voting/labelVote'}
                primary
                onClick={e => {
                  e.preventDefault()
                  this.setState({
                    pollState: POLL_STATES.READY
                  })
                }}
              >
                {vt('vote/voting/labelVote')}
              </Button>
              {resetLink}
            </div>
          )
        case POLL_STATES.READY:
          return (
            <div {...sharedStyles.buttons}>
              <Button
                key={'vote/voting/labelVote'}
                primary
                onClick={e => {
                  e.preventDefault()
                  this.submitVotingBallot()
                }}
              >
                {updating ? (
                  <InlineSpinner size={40} />
                ) : (
                  vt('vote/voting/labelConfirm')
                )}
              </Button>
              {updating ? <A>&nbsp;</A> : resetLink}
            </div>
          )
        default:
          return null
      }
    }

    this.renderVotingBody = () => {
      const {
        vt,
        data: { voting },
        addressData,
        me
      } = this.props
      const { selectedValue, updating } = this.state
      const { P } = Interaction

      let dangerousDisabledHTML
      let showSignIn
      if (voting.userHasSubmitted) {
        dangerousDisabledHTML = vt('vote/voting/thankyou', {
          submissionDate: messageDateFormat(new Date(voting.userSubmitDate))
        })
      } else if (Date.now() > new Date(voting.endDate)) {
        dangerousDisabledHTML = vt('vote/voting/ended')
      } else if (!me) {
        dangerousDisabledHTML = vt('vote/voting/notSignedIn', {
          beginDate: timeFormat('%d.%m.%Y')(new Date(voting.beginDate))
        })
        showSignIn = true
      } else if (!voting.userIsEligible) {
        dangerousDisabledHTML = vt('vote/voting/notEligible')
      }

      if (voting.userIsEligible && !addressData.voteMe?.address) {
        return <AddressEditor />
      }

      if (dangerousDisabledHTML) {
        return (
          <>
            <div {...styles.thankyou}>
              <RawHtml
                type={P}
                dangerouslySetInnerHTML={{
                  __html: dangerousDisabledHTML
                }}
              />
            </div>
            {showSignIn && <SignIn />}
          </>
        )
      } else {
        return (
          <>
            <div {...styles.buttons}>
              {voting.options.map(({ id, label }) => (
                <Fragment key={id}>
                  <Radio
                    black
                    value={id}
                    checked={id === selectedValue}
                    disabled={!!updating}
                    onChange={() =>
                      this.setState({
                        selectedValue: id,
                        pollState: POLL_STATES.DIRTY
                      })
                    }
                  >
                    <span style={{ marginRight: 30 }}>
                      {vt(`vote/voting/option${label}`)}
                    </span>
                  </Radio>
                </Fragment>
              ))}
            </div>
            {this.renderConfirmation()}
            {this.renderActions()}
          </>
        )
      }
    }
  }

  render() {
    const { data, description } = this.props
    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          const { voting } = data
          if (!voting) {
            return null
          }

          const { error } = this.state

          return (
            <Card>
              <div>
                <div {...styles.content}>
                  <P>
                    <strong>{description || voting.description}</strong>
                  </P>
                  {error && <ErrorMessage error={error} />}
                  {this.renderVotingBody()}
                </div>
              </div>
            </Card>
          )
        }}
      />
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
      userIsEligible
      options {
        id
        label
      }
    }
  }
`

export default compose(
  voteT,
  withMe,
  graphql(submitVotingBallotMutation, {
    props: ({ mutate }) => ({
      submitVotingBallot: (votingId, optionId) => {
        return mutate({
          variables: {
            votingId,
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
  }),
  withAddressData
)(Voting)
