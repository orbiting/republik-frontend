import React, { useEffect, useMemo, useState } from 'react'
import {
  A,
  Button,
  colors,
  fontFamilies,
  Interaction,
  mediaQueries,
  InlineSpinner,
  RawHtml,
  useColorContext
} from '@project-r/styleguide'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { css } from 'glamor'
import ElectionBallot from './ElectionBallot'
import voteT from './voteT'
import withMe from '../../lib/apollo/withMe'
import { timeFormat } from '../../lib/utils/format'
import ErrorMessage from '../ErrorMessage'
import Loader from '../Loader'
import AddressEditor, { withAddressData } from './AddressEditor'

const { P } = Interaction

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
        isIncumbent
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
          publicUrl
          twitterHandle
          facebookId
          statement
          portrait
          disclosures
          gender
          biographyContent
          credentials {
            isListed
            description
          }
        }
      }
    }
  }
`

const messageDateFormat = timeFormat('%e. %B %Y')

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
      margin: '0 0px',
      marginTop: 5,
      '& strong': {
        fontFamily: fontFamilies.sansSerifMedium,
        fontWeight: 'normal'
      }
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

const Election = compose(
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
  withAddressData
)(
  ({
    election,
    submitElectionBallot,
    vt,
    addressData,
    me,
    mandatoryCandidates,
    showMeta,
    discussionPath
  }) => {
    // TODO: sort candidates [recommended > veterans > other] + ABC (first names)
    const [vote, setVote] = useState(
      election.candidacies.map(candidate => ({ candidate, selected: false }))
    )
    const [isDirty, setDirty] = useState(false)
    const [isUpdating, setUpdating] = useState(false)
    const [isConfirm, setConfirm] = useState(false)
    const [error, setError] = useState(null)
    const [colorScheme] = useColorContext()
    const colorRule = useMemo(
      () => ({
        header: css({
          background: colorScheme.getCSSColor('default')
        }),
        alert: css({
          backgroundColor: colorScheme.getCSSColor('alert')
        })
      }),
      [colorScheme]
    )

    useEffect(() => {
      setDirty(!!vote.some(item => item.selected))
    }, [vote])

    const toggleCandidate = candidate => {
      const allowMultiple = election.numSeats > 1
      setVote(
        vote.map(item =>
          item.candidate.id === candidate.id
            ? { ...item, selected: !item.selected }
            : allowMultiple
            ? item
            : { ...item, selected: false }
        )
      )
    }

    const submitBallot = async () => {
      setUpdating(true)
      await submitElectionBallot(
        election.id,
        vote.map(item => item.candidate.id)
      )
        .then(() => {
          setUpdating(false)
          setError(null)
        })
        .catch(error => {
          setUpdating(false)
          setError(error)
        })
    }

    const reset = event => {
      event.preventDefault()
      setVote(vote.map(item => ({ ...item, selected: false })))
      setConfirm(false)
      setError(null)
    }

    const resetLink = (
      <A href='#' {...styles.link} onClick={reset}>
        {vt('vote/election/labelReset')}
      </A>
    )

    const actions = (
      <>
        <Button
          primary
          onClick={() => (isConfirm ? submitBallot() : setConfirm(true))}
        >
          {isUpdating ? (
            <InlineSpinner size={40} />
          ) : (
            vt(`vote/election/label${isConfirm ? 'Confirm' : 'Vote'}`)
          )}
        </Button>
        {isDirty ? (
          resetLink
        ) : (
          <div {...styles.link}>{vt('vote/election/help')}</div>
        )}
      </>
    )

    const { numSeats } = election
    const givenVotes = vote.filter(item => item.selected).length
    const remainingVotes = numSeats - givenVotes

    const confirmation = (
      <P {...styles.confirm}>
        {vote.length < numSeats
          ? vt.pluralize('vote/election/labelConfirmCount', {
              count: givenVotes,
              numSeats,
              remaining: remainingVotes
            })
          : vt.pluralize('vote/election/labelConfirmAll', {
              numSeats,
              count: givenVotes
            })}
      </P>
    )

    const hasEnded = Date.now() > new Date(election.endDate)

    let message
    if (election.userHasSubmitted) {
      message = vt('vote/election/thankyou', {
        submissionDate: messageDateFormat(new Date(election.userSubmitDate))
      })
    } else if (hasEnded) {
      message = vt('vote/election/ended')
    } else if (!me) {
      message = vt('vote/election/notSignedIn')
    } else if (!election.userIsEligible) {
      message = vt('vote/election/notEligible')
    }

    if (election.userIsEligible && !addressData.voteMe?.address) {
      return <AddressEditor />
    }

    const electionOpen = !message
    const showHeader = electionOpen && election.numSeats > 1

    return (
      <div {...styles.wrapper}>
        {showHeader && (
          <div {...styles.header} {...colorRule.header}>
            <P>
              <strong>
                {vt('vote/election/votesRemaining', {
                  count: remainingVotes,
                  max: numSeats
                })}
              </strong>
            </P>
          </div>
        )}
        {message && (
          <div {...styles.wrapper} style={{ marginBottom: 30 }}>
            <div {...styles.thankyou} {...colorRule.alert}>
              <RawHtml
                type={P}
                dangerouslySetInnerHTML={{
                  __html: message
                }}
              />
            </div>
          </div>
        )}
        <div {...styles.wrapper}>
          <ElectionBallot
            vote={vote}
            onChange={electionOpen ? toggleCandidate : undefined}
            maxVotes={election.numSeats}
            mandatory={mandatoryCandidates}
            showMeta={showMeta}
            discussionPath={discussionPath}
            disabled={remainingVotes <= 0}
          />
          {electionOpen && (
            <div {...styles.actions} {...colorRule.alert}>
              {error && <ErrorMessage error={error} />}
              {isConfirm && confirmation}
              {actions}
            </div>
          )}
        </div>
      </div>
    )
  }
)

const ElectionLoader = compose(
  graphql(query, {
    options: ({ slug }) => ({
      variables: {
        slug
      }
    })
  })
)(({ data, discussionPath, mandatoryCandidates = [], showMeta = true }) => {
  return (
    <Loader
      loading={data.loading}
      error={data.error}
      render={() => {
        if (!data?.election?.candidacies?.length) return null
        return (
          <Election
            election={data.election}
            mandatoryCandidates={mandatoryCandidates}
            showMeta={showMeta}
            discussionPath={discussionPath}
          />
        )
      }}
    />
  )
})

export default ElectionLoader
