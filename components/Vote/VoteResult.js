import React, { Fragment } from 'react'
import { compose } from 'react-apollo'
import { sum } from 'd3-array'

import Chart, { ChartTitle } from '@project-r/styleguide/lib/components/Chart'
import { Editorial } from '@project-r/styleguide'

import voteT from './voteT'

import withT from '../../lib/withT'
import { countFormat, swissNumbers } from '../../lib/utils/format'

const percentFormat = swissNumbers.format('.1%')

const VOTE_BAR_CONFIG = {
  type: 'Bar',
  numberFormat: '.1%',
  color: 'color',
  colorSort: 'none',
  colorRange: ['rgb(75,151,201)', 'rgb(239,69,51)'],
  highlight: 'true',
  sort: 'none',
  y: 'label',
  xTicks: []
}
const ELECTION_BAR_CONFIG = {
  type: 'Bar',
  numberFormat: 's',
  color: 'color',
  colorSort: 'none',
  colorRange: ['rgb(75,151,201)', 'rgb(239,69,51)'],
  sort: 'none',
  y: 'label',
  xTicks: [],
  column: 'category',
  columns: 1
}

const VoteResult = ({ votings, elections, vt, t }) =>
  <Fragment>
    {votings.map(({ id, data }) => {
      const results = data.result.options
        .filter(result => result.option)
      const total = sum(results, r => r.count)
      const values = results.map(result => ({
        value: String(result.count / total),
        color: result.option.label,
        label: vt('vote/voting/label', {
          formattedCount: countFormat(total)
        })
      }))
      const emptyVotes = data.result.options.find(result => !result.option).count

      const { eligible, submitted } = data.turnout

      return (
        <Fragment key={id}>
          <ChartTitle>{data.description}</ChartTitle>
          <Chart t={t}
            config={VOTE_BAR_CONFIG}
            values={values} />
          <Editorial.Note style={{ marginTop: -10 }}>
            {vt('vote/voting/turnout', {
              formattedPercent: percentFormat(submitted / eligible),
              formattedEmptyCount: countFormat(emptyVotes),
              formattedFilledCount: countFormat(total)
            })}
          </Editorial.Note>
        </Fragment>
      )
    })}
    {elections.map(({ id, data }) => {
      const results = data.result.candidacies
        .filter(result => result.candidacy)
      const total = sum(results, r => r.count)
      const numElected = results.filter(r => r.elected).length
      const numNotElected = results.filter(r => !r.elected).length
      const values = results.map(result => ({
        value: String(result.count),
        color: result.elected ? '1' : '0',
        label: result.candidacy.user.name,
        category: result.elected
          ? vt.pluralize('vote/election/elected', {
            count: numElected
          })
          : vt.pluralize('vote/election/notElected', {
            count: numNotElected
          })
      }))
      const emptyVotes = data.result.candidacies.find(result => !result.candidacy).count

      const { eligible, submitted } = data.turnout

      return (
        <Fragment key={id}>
          <ChartTitle>{ vt(`vote/${id}/title`) }</ChartTitle>
          <Chart t={t}
            config={ELECTION_BAR_CONFIG}
            values={values} />
          <Editorial.Note style={{ marginTop: -10 }}>
            {vt('vote/election/turnout', {
              formattedPercent: percentFormat(submitted / eligible),
              formattedEmptyCount: countFormat(emptyVotes),
              formattedFilledCount: countFormat(total)
            })}
          </Editorial.Note>
        </Fragment>
      )
    })}
  </Fragment>

export default compose(
  voteT,
  withT
)(VoteResult)
