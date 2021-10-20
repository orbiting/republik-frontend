import React, { useEffect, useRef, useState } from 'react'
import {
  A,
  Button,
  Interaction,
  InlineSpinner,
  FigureImage,
  Figure,
  useHeaderHeight
} from '@project-r/styleguide'
import { Chart, ChartLead } from '@project-r/styleguide/chart'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { css } from 'glamor'
import voteT from './voteT'
import ErrorMessage from '../ErrorMessage'
import { ElectionActions, ElectionHeader } from './Election'
import { birthdayParse } from '../Account/UpdateMe'
import { scrollIt } from '../../lib/utils/scroll'
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

const emptyGifLink =
  'https://cdn.repub.ch/s3/republik-assets/assets/vote/empty.gif'

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
    marginBottom: 60
  })
}

const CandidatesLocation = voteT(({ candidates, vt }) => {
  const values = candidates
    .filter(candidate => candidate.postalCodeGeo?.countryCode === 'CH')
    .reduce((acc, { postalCodeGeo, city }) => {
      const currentLocation = acc.find(
        point => point.postalCode === postalCodeGeo.postalCode
      )
      if (currentLocation) {
        currentLocation.count += 1
      } else {
        acc.push({
          ...postalCodeGeo,
          city,
          count: 1
        })
      }
      return acc
    }, [])
    .map(point => ({
      ...point,
      lat: String(point.lat),
      lon: String(point.lon),
      value: String(point.count)
    }))

  return (
    <div {...styles.chart}>
      <ChartLead>{vt('vote/election/confirm/geo/header')}</ChartLead>
      <Chart
        config={{
          type: 'SwissMap',
          heightRatio: 0.63,
          features: {
            url:
              'https://cdn.repub.ch/s3/republik-assets/assets/geo/ch-cantons-wo-lakes.json',
            object: 'cantons'
          },
          points: true,
          sizeRangeMax: 300,
          opacity: 0.5,
          colorLegend: false,
          tooltipLabel: '{city} {postalCode}',
          tooltipBody: 'Kandidatinnen: 1'
        }}
        values={values}
      />
    </div>
  )
})

const getPercentString = total => item => ({
  ...item,
  value: String(item.value / total)
})

const CandidatesGender = voteT(({ candidates, vt }) => {
  const candidatesWithGender = candidates.filter(
    candidate => candidate?.user?.gender
  )
  const values = candidatesWithGender
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
    .map(getPercentString(candidatesWithGender.length))

  return (
    <div {...styles.chart}>
      <ChartLead>{vt('vote/election/confirm/gender/header')}</ChartLead>
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
})

const getAge = birthday => {
  const birthdayParsed = birthdayParse(birthday)
  return Math.floor(
    (new Date() - new Date(birthdayParsed).getTime()) / 3.15576e10
  )
}

const getLabel = age =>
  age < 30
    ? '<30'
    : age < 40
    ? '30-40'
    : age < 50
    ? '40-50'
    : age < 60
    ? '50-60'
    : '>60'

const CandidatesAge = voteT(({ candidates, vt }) => {
  const candidatesWithBirthday = candidates.filter(
    candidate => candidate.user?.birthday
  )
  const values = candidatesWithBirthday
    .reduce(
      (acc, candidate) =>
        acc.map(item =>
          item.key === getLabel(getAge(candidate.user.birthday))
            ? { ...item, value: item.value + 1 }
            : item
        ),
      [
        { key: '<30', value: 0.001 },
        { key: '30-40', value: 0.001 },
        { key: '40-50', value: 0.001 },
        { key: '50-60', value: 0.001 },
        { key: '>60', value: 0.001 }
      ]
    )
    .map(getPercentString(candidatesWithBirthday.length))

  return (
    <div {...styles.chart}>
      <ChartLead>{vt('vote/election/confirm/age/header')}</ChartLead>
      <Chart
        config={{
          type: 'TimeBar',
          x: 'key',
          xScale: 'ordinal',
          unit: 'der Kandidatinnen',
          numberFormat: '.0%',
          domain: [0, 1]
        }}
        values={values}
      />
    </div>
  )
})

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
)(({ election, vote, submitElectionBallot, goBack, vt, membershipStats }) => {
  const [isUpdating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const ref = useRef()
  const [headerHeight] = useHeaderHeight()

  useEffect(() => {
    const { top } = ref.current.getBoundingClientRect()
    const { pageYOffset } = window
    const target = pageYOffset + top - headerHeight - 80
    scrollIt(target, 100)
  }, [])

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
        {vt('vote/election/confirm/back')}
      </A>
    </>
  )

  return (
    <>
      <ElectionHeader>{vt('vote/election/confirm/header')}</ElectionHeader>
      <div {...styles.wrapper} ref={ref}>
        {!givenVotes ? (
          <Figure>
            <FigureImage src={emptyGifLink} maxWidth={500} alt='Leer' />
          </Figure>
        ) : (
          <>
            <CandidatesLocation candidates={selectedCandidates} />
            <CandidatesGender candidates={selectedCandidates} />
            <CandidatesAge candidates={selectedCandidates} />
          </>
        )}
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
