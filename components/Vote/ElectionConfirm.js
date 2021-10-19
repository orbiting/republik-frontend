import React, { useState } from 'react'
import { A, Button, Interaction, InlineSpinner } from '@project-r/styleguide'
import {
  ChartTitle,
  Chart,
  ChartLead,
  ChartLegend
} from '@project-r/styleguide/chart'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { css } from 'glamor'
import voteT from './voteT'
import ErrorMessage from '../ErrorMessage'
import { ElectionActions, ElectionHeader } from './Election'
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

const styles = {
  wrapper: css({
    width: '100%',
    position: 'relative',
    minHeight: 200
  }),
  confirm: css({
    textAlign: 'center',
    width: '80%',
    margin: '10px 0 15px 0'
  }),
  link: css({
    marginTop: 10
  }),
  chart: css({
    marginBottom: 30
  })
}

const CandidatesLocation = ({ candidates }) => {
  return (
    <div {...styles.chart}>
      <ChartTitle>Geo</ChartTitle>
      <Chart
        config={{
          type: 'Bar',
          numberFormat: '%',
          color: 'key',
          colorRange: ['#9467bd', 'neutral', '#2ca02c'],
          colorLegend: true,
          domain: [0, 1],
          sort: 'none',
          colorSort: 'none'
        }}
        values={[]}
      />
    </div>
  )
}

const getValueString = candidates => item => ({
  ...item,
  value: String(item.value / candidates.length)
})

const CandidatesGender = ({ candidates }) => {
  const values = candidates
    .reduce(
      (acc, candidate) =>
        acc.map(item =>
          item.key === candidate.user.gender
            ? { ...item, value: item.value + 1 }
            : item
        ),
      [
        { key: 'weiblich', value: 0 },
        { key: 'divers', value: 0 },
        { key: 'männlich', value: 0 }
      ]
    )
    .map(getValueString(candidates))

  return (
    <div {...styles.chart}>
      <ChartTitle>Geschlecht</ChartTitle>
      <Chart
        config={{
          type: 'Bar',
          numberFormat: '%',
          color: 'key',
          colorRange: ['#9467bd', 'neutral', '#2ca02c'],
          colorLegend: true,
          domain: [0, 1],
          sort: 'none',
          colorSort: 'none'
        }}
        values={values}
      />
    </div>
  )
}

const CandidatesAge = ({ candidates }) => {
  const getAgeBucket = birthday => {
    const birthYear = Number(birthday.split('.')[2])
    if (birthYear <= 1964) return 'Boomers'
    else if (birthYear <= 1980) return 'Gen X'
    else if (birthYear <= 1996) return 'Millenials'
    return 'Gen Z'
  }

  const values = candidates
    .reduce(
      (acc, candidate) =>
        acc.map(item =>
          item.key === getAgeBucket(candidate.user.birthday)
            ? { ...item, value: item.value + 1 }
            : item
        ),
      [
        { key: 'Gen Z', value: 0.001 },
        { key: 'Millenials', value: 0.001 },
        { key: 'Gen X', value: 0.001 },
        { key: 'Boomers', value: 0.001 }
      ]
    )
    .map(getValueString(candidates))

  return (
    <div {...styles.chart}>
      <ChartTitle>Alter</ChartTitle>
      <Chart
        config={{
          type: 'Bar',
          numberFormat: '.0%',
          y: 'key',
          showBarValues: true,
          sort: 'none'
        }}
        values={values}
      />
    </div>
  )
}

const ElectionConfirm = compose(
  voteT,
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
  })
)(({ election, vote, submitElectionBallot, goBack, vt }) => {
  const [isUpdating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const selectedCandidates = vote
    .filter(item => item.selected)
    .map(item => item.candidate)

  const submitBallot = async () => {
    setUpdating(true)
    await submitElectionBallot(
      election.id,
      selectedCandidates.map(candidate => candidate.id)
    )
      .then(() => {
        setUpdating(false)
        setError(null)
        goBack()
      })
      .catch(error => {
        setUpdating(false)
        setError(error)
      })
  }

  const { numSeats } = election
  const givenVotes = vote.filter(item => item.selected).length
  const remainingVotes = numSeats - givenVotes

  const confirmation = (
    <P {...styles.confirm}>
      {givenVotes < numSeats
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

  const actions = (
    <>
      <Button primary onClick={submitBallot}>
        {isUpdating ? (
          <InlineSpinner size={40} />
        ) : (
          vt('vote/election/labelConfirm')
        )}
      </Button>
      <A href='#' {...styles.link} onClick={goBack}>
        Zurück
      </A>
    </>
  )

  return (
    <>
      {givenVotes && (
        <ElectionHeader>
          <P>
            <strong>
              So sieht das von Ihnen gewählten Genossenschaftsrat aus:
            </strong>
          </P>
        </ElectionHeader>
      )}
      <div {...styles.wrapper}>
        <CandidatesLocation candidates={selectedCandidates} />
        <CandidatesGender candidates={selectedCandidates} />
        <CandidatesAge candidates={selectedCandidates} />
        <ElectionActions>
          {error && <ErrorMessage error={error} />}
          {confirmation}
          {actions}
        </ElectionActions>
      </div>
    </>
  )
})

export default ElectionConfirm
