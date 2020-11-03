import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import {
  A,
  Button,
  colors,
  fontStyles,
  InlineSpinner,
  Interaction,
  Radio,
  RawHtml,
  Loader,
  useColorContext
} from '@project-r/styleguide'
import { timeFormat } from '../../lib/utils/format'
import withMe from '../../lib/apollo/withMe'
import voteT from './voteT'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import ErrorMessage from '../ErrorMessage'

const { H3, P } = Interaction

const POLL_STATES = {
  START: 'START',
  DIRTY: 'DIRTY',
  READY: 'READY'
}

const styles = {
  card: css({
    margin: '40px auto',
    padding: 25,
    maxWidth: 550,
    width: '100%'
  }),
  cardTitle: css({
    fontSize: 22,
    ...fontStyles.sansSerifMedium
  }),
  cardBody: css({
    marginTop: 15,
    position: 'relative'
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
    textAlign: 'center',
    ...fontStyles.sansSerifRegular14
  }),
  thankyou: css({
    padding: '30px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }),
  confirm: css({
    textAlign: 'center'
  })
}

const messageDateFormat = timeFormat('%e. %B %Y')

const Card = ({ children }) => {
  const [colorScheme] = useColorContext()
  return (
    <div {...styles.card} {...colorScheme.set('backgroundColor', 'alert')}>
      {children}
    </div>
  )
}

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
                  )} stimmen?`
                : 'Leer einlegen?'}
            </P>
          </div>
        )
      } else {
        return null
      }
    }

    this.submitVotingBallot = async () => {
      const { submitVotingBallot } = this.props
      const {
        data: { voting }
      } = this.props
      const { selectedValue } = this.state

      this.setState({ updating: true })

      await submitVotingBallot(voting.id, selectedValue)
        .then(() => {
          this.setState(() => ({
            updating: false,
            error: null
          }))
        })
        .catch(error => {
          this.setState(() => ({
            pollState: POLL_STATES.DIRTY,
            updating: false,
            error
          }))
        })
    }

    this.renderActions = () => {
      const { vt } = this.props
      const { pollState, updating } = this.state

      const resetLink = (
        <A href='#' {...styles.link} onClick={this.reset}>
          {vt('vote/voting/labelReset')}
        </A>
      )

      switch (pollState) {
        case POLL_STATES.START:
          return (
            <Fragment>
              <Button
                key={'vote/voting/labelVote'}
                primary
                onClick={e => {
                  e.preventDefault()
                  this.setState(() => ({
                    pollState: POLL_STATES.READY
                  }))
                }}
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
                key={'vote/voting/labelVote'}
                primary
                onClick={e => {
                  e.preventDefault()
                  this.setState(() => ({
                    pollState: POLL_STATES.READY
                  }))
                }}
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
            </Fragment>
          )
        default:
          return null
      }
    }

    this.renderVotingBody = () => {
      const {
        vt,
        data: { voting },
        me
      } = this.props
      const { selectedValue } = this.state
      const { P } = Interaction

      let dangerousDisabledHTML = this.props.dangerousDisabledHTML
      if (voting.userHasSubmitted) {
        dangerousDisabledHTML = vt('vote/voting/thankyou', {
          submissionDate: messageDateFormat(new Date(voting.userSubmitDate))
        })
      } else if (Date.now() > new Date(voting.endDate)) {
        dangerousDisabledHTML = vt('vote/voting/ended')
      } else if (!me) {
        dangerousDisabledHTML = vt('vote/voting/notSignedIn')
      } else if (!voting.userIsEligible) {
        dangerousDisabledHTML = vt('vote/voting/notEligible')
      }

      if (dangerousDisabledHTML) {
        return (
          <div {...styles.cardBody}>
            <div {...styles.thankyou}>
              <RawHtml
                type={P}
                dangerouslySetInnerHTML={{
                  __html: dangerousDisabledHTML
                }}
              />
            </div>
          </div>
        )
      } else {
        return (
          <div {...styles.cardBody}>
            {voting.options.map(({ id, label }) => (
              <Fragment key={id}>
                <Radio
                  black
                  value={id}
                  checked={id === selectedValue}
                  onChange={() =>
                    this.setState({
                      selectedValue: id,
                      pollState: POLL_STATES.DIRTY
                    })
                  }
                >
                  <span {...styles.optionText}>
                    {vt(`vote/voting/option${label}`)}
                  </span>
                </Radio>
                <br />
              </Fragment>
            ))}
            {this.renderConfirmation()}
            <div {...styles.cardActions}>{this.renderActions()}</div>
          </div>
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
              <H3>{description || voting.description}</H3>
              {error && <ErrorMessage error={error} />}
              {this.renderVotingBody()}
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
  })
)(Voting)
