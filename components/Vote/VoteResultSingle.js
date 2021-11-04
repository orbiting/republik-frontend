import React from 'react'
import compose from 'lodash/flowRight'
import { sum } from 'd3-array'

import { Chart, ChartTitle, ChartLead } from '@project-r/styleguide'
import { Editorial } from '@project-r/styleguide'

import voteT from './voteT'
import { countFormat, swissNumbers } from '../../lib/utils/format'
import withT from '../../lib/withT'

const percentFormat = swissNumbers.format('.1%')

const VOTE_BAR_CONFIG = {
  type: 'Bar',
  numberFormat: '.1%',
  color: 'option',
  colorSort: 'none',
  colorRange: 'diverging1',
  highlight: 'true',
  sort: 'none',
  inlineValue: true,
  inlineLabel: 'option',
  inlineSecondaryLabel: 'votes'
}

const VoteResultSingle = compose(
  voteT,
  withT
)(({ data, vt, t }) => {
  const results = data.result.options.filter(result => result.option)
  const winner = results.find(result => result.winner)
  const filledCount = sum(results, r => r.count)
  const values = results.map(result => ({
    value: String(result.count / filledCount),
    option: vt(`vote/voting/option${result.option.label}`),
    votes: vt('vote/votes', {
      formattedCount: countFormat(result.count)
    })
  }))
  const empty = data.result.options.find(result => !result.option)
  const emptyVotes = empty ? empty.count : 0
  const { eligible, submitted } = data.turnout

  return (
    <div>
      <ChartTitle>{data.description}</ChartTitle>
      {!!winner && (
        <ChartLead>
          {vt(`vote/voting/winner/${winner.option.label}`, {
            formattedPercent: percentFormat(winner.count / filledCount)
          })}
        </ChartLead>
      )}
      <Chart t={t} config={VOTE_BAR_CONFIG} values={values} />
      <Editorial.Note style={{ marginTop: 10 }}>
        {vt('vote/voting/turnout', {
          formattedPercent: percentFormat(submitted / eligible),
          formattedCount: countFormat(emptyVotes + filledCount),
          formattedEmptyCount: countFormat(emptyVotes),
          formattedFilledCount: countFormat(filledCount)
        })}
      </Editorial.Note>
    </div>
  )
})

export default VoteResultSingle
