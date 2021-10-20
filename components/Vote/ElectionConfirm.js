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
import Loader from '../Loader'
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

const membershipQuery = gql`
  query MembershipStats {
    membershipStats {
      ages {
        averageAge
      }
      names {
        buckets {
          key
          sex
          count
        }
      }
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
    marginBottom: 45
  })
}

const CandidatesLocation = ({ candidates }) => {
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
      <ChartLead>Geographische Verteilung</ChartLead>
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
          sizeRangeMax: 100,
          colorLegend: false,
          tooltipLabel: '{city} {postalCode}',
          tooltipBody: 'Kandidatinnen: 1'
        }}
        values={values}
      />
    </div>
  )
}

const getPercentString = total => item => ({
  ...item,
  value: String(item.value / total)
})

const genderLabels = {
  MALE: 'männlich',
  FEMALE: 'weiblich',
  BOTH: 'divers'
}

const CandidatesGender = ({ candidates, membershipStats }) => {
  const candidateValues = candidates
    .filter(candidate => candidate?.user?.gender)
    .reduce(
      (acc, candidate) =>
        acc.map(item =>
          item.key === candidate.user.gender
            ? { ...item, value: item.value + 1 }
            : item
        ),
      [
        { key: 'weiblich', value: 0, group: 'Genossenschaftsrat' },
        { key: 'divers', value: 0, group: 'Genossenschaftsrat' },
        { key: 'männlich', value: 0, group: 'Genossenschaftsrat' }
      ]
    )
    .map(getPercentString(candidates.length))

  let membershipValues = membershipStats.names.buckets.reduce(
    (acc, name) => {
      const currentSex = name.sex
      if (!currentSex) return acc
      const currentGender = acc.find(d => d.key === genderLabels[currentSex])
      currentGender.value += name.count
      return acc
    },
    [
      { key: 'weiblich', value: 0, group: 'Project R Verlegerschaft' },
      { key: 'divers', value: 0, group: 'Project R Verlegerschaft' },
      { key: 'männlich', value: 0, group: 'Project R Verlegerschaft' }
    ]
  )
  const totalMembershipValues = membershipValues.reduce(
    (acc, current) => acc + current.value,
    0
  )
  membershipValues = membershipValues.map(
    getPercentString(totalMembershipValues)
  )

  const values = candidateValues.concat(membershipValues)

  return (
    <div {...styles.chart}>
      <ChartLead>Geschlechtsparität</ChartLead>
      <Chart
        config={{
          type: 'Bar',
          numberFormat: '%',
          color: 'key',
          y: 'group',
          colorRange: ['#9467bd', 'neutral', '#2ca02c'],
          colorLegend: true,
          domain: [0, 1],
          sort: 'none',
          colorSort: 'none',
          highlight: "datum.group == 'Genossenschaftsrat'"
        }}
        values={values}
      />
    </div>
  )
}

const getAge = birthday => {
  const birthdayParsed = birthdayParse(birthday)
  return Math.floor(
    (new Date() - new Date(birthdayParsed).getTime()) / 3.15576e10
  )
}

const CandidatesAge = ({ candidates, membershipStats }) => {
  const averageCandidateAge =
    candidates
      .filter(candidate => candidate.user?.birthday)
      .reduce((acc, candidate) => acc + getAge(candidate.user.birthday), 0) /
    candidates.length

  const values = [
    { key: 'Genossenschaftsrat', value: String(averageCandidateAge) },
    {
      key: 'Project R Verlegerschaft',
      value: String(membershipStats.ages.averageAge)
    }
  ]

  return (
    <div {...styles.chart}>
      <ChartLead>Durchschnittsalter</ChartLead>
      <Chart
        config={{
          type: 'Bar',
          y: 'key',
          showBarValues: true,
          sort: 'none',
          highlight: "datum.key == 'Genossenschaftsrat'"
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
        Zurück
      </A>
    </>
  )

  return (
    <>
      <ElectionHeader>
        So sieht das von Ihnen gewählten Genossenschaftsrat aus:
      </ElectionHeader>
      <div {...styles.wrapper} ref={ref}>
        {!givenVotes ? (
          <Figure>
            <FigureImage src={emptyGifLink} maxWidth={500} alt='Leer' />
          </Figure>
        ) : (
          <>
            <CandidatesLocation candidates={selectedCandidates} />
            <CandidatesGender
              candidates={selectedCandidates}
              membershipStats={membershipStats}
            />
            <CandidatesAge
              candidates={selectedCandidates}
              membershipStats={membershipStats}
            />
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

const ElectionConfirmLoader = graphql(
  membershipQuery
)(({ election, vote, goBack, data }) => (
  <Loader
    loading={data.loading}
    error={data.error}
    render={() => (
      <ElectionConfirm
        election={election}
        vote={vote}
        goBack={goBack}
        membershipStats={data.membershipStats}
      />
    )}
  />
))

export default ElectionConfirmLoader
