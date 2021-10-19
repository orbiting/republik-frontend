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
  const values = [
    {
      feature: 1,
      value: 0.0586
    },
    {
      feature: 2,
      value: 0.0818
    },
    {
      feature: 3,
      value: 0.106
    },
    {
      feature: 4,
      value: 0.0989
    },
    {
      feature: 5,
      value: 0.0959
    },
    {
      feature: 6,
      value: 0.0909
    },
    {
      feature: 7,
      value: 0.0758
    },
    {
      feature: 8,
      value: 0.0919
    },
    {
      feature: 9,
      value: 0.106
    },
    {
      feature: 10,
      value: 0.0989
    },
    {
      feature: 11,
      value: 0.0374
    },
    {
      feature: 12,
      value: 0.0374
    },
    {
      feature: 13,
      value: 0.0435
    },
    {
      feature: 14,
      value: 0.0455
    },
    {
      feature: 15,
      value: 0.0576
    },
    {
      feature: 16,
      value: 0.0475
    },
    {
      feature: 17,
      value: 0.0899
    },
    {
      feature: 18,
      value: 0.0616
    },
    {
      feature: 19,
      value: 0.0768
    },
    {
      feature: 20,
      value: 0.0485
    },
    {
      feature: 21,
      value: 0.0203
    },
    {
      feature: 22,
      value: 0.0445
    },
    {
      feature: 23,
      value: 0.0485
    },
    {
      feature: 24,
      value: 0.0536
    },
    {
      feature: 25,
      value: 0.0264
    },
    {
      feature: 26,
      value: 0.0687
    },
    {
      feature: 27,
      value: 0.0768
    },
    {
      feature: 28,
      value: 0.0737
    },
    {
      feature: 29,
      value: 0.0838
    },
    {
      feature: 30,
      value: 0.0606
    },
    {
      feature: 31,
      value: 0.0788
    },
    {
      feature: 32,
      value: 0.0707
    },
    {
      feature: 33,
      value: 0.0717
    },
    {
      feature: 34,
      value: 0.0526
    },
    {
      feature: 35,
      value: 0.0727
    },
    {
      feature: 36,
      value: 0.0899
    },
    {
      feature: 37,
      value: 0.105
    },
    {
      feature: 38,
      value: 0.0788
    },
    {
      feature: 39,
      value: 0.0788
    },
    {
      feature: 40,
      value: 0.0445
    },
    {
      feature: 41,
      value: 0.0616
    },
    {
      feature: 42,
      value: 0.0536
    },
    {
      feature: 43,
      value: 0.0566
    },
    {
      feature: 44,
      value: 0.0606
    },
    {
      feature: 45,
      value: 0.0314
    },
    {
      feature: 46,
      value: 0.0395
    },
    {
      feature: 47,
      value: 0.0475
    },
    {
      feature: 48,
      value: 0.0193
    },
    {
      feature: 49,
      value: 0.0052
    },
    {
      feature: 50,
      value: 0.0637
    },
    {
      feature: 51,
      value: 0.0526
    },
    {
      feature: 52,
      value: 0.0465
    },
    {
      feature: 53,
      value: 0.0929
    },
    {
      feature: 54,
      value: 0.0889
    },
    {
      feature: 55,
      value: 0.0788
    },
    {
      feature: 56,
      value: 0.0828
    },
    {
      feature: 57,
      value: 0.0788
    },
    {
      feature: 58,
      value: 0.0979
    },
    {
      feature: 59,
      value: 0.0858
    },
    {
      feature: 60,
      value: 0.0536
    },
    {
      feature: 61,
      value: 0.0415
    },
    {
      feature: 62,
      value: 0.0526
    },
    {
      feature: 63,
      value: 0.0354
    },
    {
      feature: 64,
      value: 0.0062
    },
    {
      feature: 65,
      value: 0.0687
    },
    {
      feature: 66,
      value: 0.0526
    },
    {
      feature: 67,
      value: 0.0455
    },
    {
      feature: 68,
      value: 0.0506
    },
    {
      feature: 69,
      value: 0.0758
    },
    {
      feature: 70,
      value: 0.0727
    },
    {
      feature: 71,
      value: 0.0536
    },
    {
      feature: 72,
      value: 0.0707
    },
    {
      feature: 73,
      value: 0.0778
    },
    {
      feature: 74,
      value: 0.0667
    },
    {
      feature: 75,
      value: 0.0475
    },
    {
      feature: 76,
      value: 0.0475
    },
    {
      feature: 77,
      value: 0.0667
    },
    {
      feature: 78,
      value: 0.0516
    },
    {
      feature: 79,
      value: 0.0919
    },
    {
      feature: 80,
      value: 0.0516
    },
    {
      feature: 81,
      value: 0.0717
    },
    {
      feature: 82,
      value: 0.0475
    },
    {
      feature: 83,
      value: 0.0253
    },
    {
      feature: 84,
      value: 0.0485
    },
    {
      feature: 85,
      value: 0.0626
    },
    {
      feature: 86,
      value: 0.0788
    },
    {
      feature: 87,
      value: 0.0586
    },
    {
      feature: 88,
      value: 0.0445
    },
    {
      feature: 89,
      value: 0.0022
    },
    {
      feature: 90,
      value: 0.0626
    },
    {
      feature: 91,
      value: 0.0647
    },
    {
      feature: 92,
      value: 0.0788
    },
    {
      feature: 93,
      value: 0.0596
    },
    {
      feature: 94,
      value: 0.0465
    },
    {
      feature: 95,
      value: 0.0445
    },
    {
      feature: 96,
      value: 0.0536
    },
    {
      feature: 97,
      value: 0.0193
    },
    {
      feature: 98,
      value: 0.0052
    },
    {
      feature: 99,
      value: 0.0294
    },
    {
      feature: 100,
      value: 0.0667
    },
    {
      feature: 101,
      value: 0.0364
    },
    {
      feature: 102,
      value: 0.0334
    },
    {
      feature: 103,
      value: 0.0536
    },
    {
      feature: 104,
      value: 0.0465
    },
    {
      feature: 105,
      value: 0.0647
    },
    {
      feature: 106,
      value: 0.106
    }
  ].map(i => ({ ...i, value: String(i.value) }))

  return (
    <div {...styles.chart}>
      <ChartLead>Geographische Verteilung</ChartLead>
      <Chart
        config={{
          type: 'ProjectedMap',
          heightRatio: 0.63,
          choropleth: true,
          colorLegend: true,
          features: {
            url:
              'https://cdn.republik.space/s3/republik-assets/assets/geo/bfs-2019-ms-reg.json',
            object: 'msreg'
          },
          thresholds: [0.02, 0.04, 0.06, 0.08],
          colorRange: ['#bbb', '#81b6d2', '#4b97c9', '#1864aa', '#08306b'],
          colorLegendSize: 0.18,
          legendTitle: 'Preisänderung',
          numberFormat: '+.1%'
        }}
        values={values}
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
      <ChartLead>Geschlechtsparität</ChartLead>
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
      <ChartLead>Altersgruppe</ChartLead>
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
