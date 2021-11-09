import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Interaction,
  InlineSpinner,
  FigureImage,
  Figure,
  useHeaderHeight,
  Label,
  fontStyles,
  Chart
} from '@project-r/styleguide'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { css } from 'glamor'
import voteT from './voteT'
import ErrorMessage from '../ErrorMessage'
import { ElectionActions, isSelected } from './Election'
import { sharedStyles } from './text'
import { deduplicate } from '../../lib/utils/helpers'
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
  charts: css({
    margin: '0 auto',
    maxWidth: 360
  }),
  confirm: css({
    textAlign: 'center',
    width: '80%',
    margin: '10px 0 15px 0'
  }),
  chart: css({
    marginBottom: 20
  }),
  mapLegend: css({
    ...fontStyles.sansSerifRegular12,
    fontFeatureSettings: '"tnum" 1, "kern" 1',
    padding: '3px 0 6px'
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

  const outsideSwitzerland = candidates.filter(
    c => c.postalCodeGeo?.countryCode !== 'CH'
  )

  return (
    <div {...styles.chart}>
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
          sizeRangeMax: 150,
          opacity: 0.5,
          colorLegend: false,
          tooltipLabel: '{city}, {postalCode}',
          tooltipBody: 'Kandidatinnen: {count}'
        }}
        values={values}
      />
      {!!outsideSwitzerland.length && (
        <div {...styles.mapLegend}>
          Nicht angezeigt:{' '}
          {outsideSwitzerland.length === 1
            ? 'eine Kandidatur'
            : `${outsideSwitzerland.length} Kandidaturen`}{' '}
          ausserhalb der Schweiz:{' '}
          {outsideSwitzerland
            .map(c => `${c.city} ${c.postalCodeGeo.countryName}`)
            .filter(deduplicate)
            .join(', ')}
          .
        </div>
      )}
    </div>
  )
})

const getPercentString = total => item => ({
  ...item,
  value: String(item.value / total)
})

const GENDER = {
  weiblich: '#9467bd',
  divers: 'neutral',
  ['männlich']: '#2ca02c'
}

const CandidatesGender = voteT(({ candidates, vt }) => {
  const candidatesWithGender = candidates.filter(
    candidate => candidate?.user?.gender
  )
  const values = candidatesWithGender
    .reduce(
      (acc, candidate) =>
        acc.map(item =>
          item.key ===
          (GENDER[candidate.user.gender] ? candidate.user.gender : 'divers')
            ? { ...item, value: item.value + 1 }
            : item
        ),
      Object.keys(GENDER).map(key => ({ key, value: 0 }))
    )
    .map(getPercentString(candidatesWithGender.length))

  return (
    <div {...styles.chart}>
      <div style={{ marginBottom: 3 }}>
        <Label>{vt('vote/election/confirm/gender/header')}</Label>
      </div>
      <Chart
        config={{
          type: 'Bar',
          numberFormat: '.0%',
          color: 'key',
          colorMap: GENDER,
          colorSort: 'none',
          colorLegend: true,
          colorLegendValues: Object.keys(GENDER),
          domain: [0, 1],
          sort: 'none',
          inlineValue: true
        }}
        values={values.filter(v => v.value !== '0')}
      />
    </div>
  )
})

const getAge = birthYear => new Date().getFullYear() - birthYear

const AGES = {
  ['<\u200930']: '#1f77b4',
  ['30\u201340']: '#ff7f0e',
  ['40\u201350']: '#2ca02c',
  ['50\u201360']: '#d62728',
  ['>\u200960 Jahre']: '#9467bd'
}
const AGE_KEYS = Object.keys(AGES)

const getLabel = age =>
  age < 30
    ? AGE_KEYS[0]
    : age < 40
    ? AGE_KEYS[1]
    : age < 50
    ? AGE_KEYS[2]
    : age < 60
    ? AGE_KEYS[3]
    : AGE_KEYS[4]

const CandidatesAge = voteT(({ candidates, vt }) => {
  const candidatesWithBirthday = candidates.filter(
    candidate => candidate.yearOfBirth
  )
  const values = candidatesWithBirthday
    .reduce(
      (acc, candidate) =>
        acc.map(item =>
          item.key === getLabel(getAge(candidate.yearOfBirth))
            ? { ...item, value: item.value + 1 }
            : item
        ),
      AGE_KEYS.map(key => ({ key, value: 0 }))
    )
    .map(getPercentString(candidatesWithBirthday.length))

  return (
    <div {...styles.chart}>
      <div style={{ marginBottom: 3 }}>
        <Label>{vt('vote/election/confirm/age/header')}</Label>
      </div>
      <Chart
        config={{
          type: 'Bar',
          numberFormat: '.0%',
          color: 'key',
          colorMap: AGES,
          colorSort: 'none',
          colorLegend: true,
          colorLegendValues: AGE_KEYS,
          domain: [0, 1],
          sort: 'none',
          inlineValue: true
        }}
        values={values.filter(v => v.value !== '0')}
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
)(
  ({
    election,
    candidates,
    vote,
    submitElectionBallot,
    resetVote,
    goBack,
    vt
  }) => {
    const [isUpdating, setUpdating] = useState(false)
    const [error, setError] = useState(null)
    const ref = useRef()
    const [headerHeight] = useHeaderHeight()

    useEffect(() => {
      const { top } = ref.current.getBoundingClientRect()
      const { pageYOffset } = window
      const target = pageYOffset + top - headerHeight - 80
      window.scroll(0, target)
    }, [])

    const selectedCandidates = candidates.filter(candidate =>
      isSelected(candidate, vote)
    )

    const submitBallot = async () => {
      setUpdating(true)
      await submitElectionBallot(election.id, vote)
        .then(() => {
          setUpdating(false)
          setError(null)
          resetVote()
        })
        .catch(error => {
          setUpdating(false)
          setError(error)
        })
    }

    const { numSeats } = election
    const givenVotes = vote.length
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
      <div {...sharedStyles.buttons}>
        <div style={{ marginRight: 15 }}>
          <Button disabled={isUpdating} onClick={goBack}>
            {vt('vote/common/back')}
          </Button>
        </div>
        <Button primary onClick={submitBallot}>
          {isUpdating ? (
            <InlineSpinner size={40} />
          ) : (
            vt('vote/election/labelConfirm')
          )}
        </Button>
      </div>
    )

    return (
      <ElectionActions>
        <div ref={ref} {...styles.confirm}>
          {!givenVotes ? (
            <Figure>
              <FigureImage src={emptyGifLink} maxWidth={500} alt='Leer' />
            </Figure>
          ) : (
            <>
              <Interaction.P>
                <strong>{vt('vote/election/confirm/header')}</strong>
              </Interaction.P>
              <div {...styles.charts}>
                <CandidatesLocation candidates={selectedCandidates} />
                <CandidatesGender candidates={selectedCandidates} />
                <CandidatesAge candidates={selectedCandidates} />
              </div>
            </>
          )}
        </div>
        {error && <ErrorMessage error={error} />}
        {confirmation}
        {actions}
        <div {...sharedStyles.hint}>{vt('vote/common/help/final')}</div>
      </ElectionActions>
    )
  }
)

export default ElectionConfirm
