import React, { Fragment } from 'react'
import { compose } from 'react-apollo'
import { sum } from 'd3-array'

import Chart, {
  ChartTitle,
  ChartLead
} from '@project-r/styleguide/lib/components/Chart'
import { Editorial } from '@project-r/styleguide'

import voteT from './voteT'

import withT from '../../lib/withT'
import { countFormat, swissNumbers } from '../../lib/utils/format'
import VoteResultSingle from './VoteResultSingle'

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
const ELECTION_BAR_CONFIG_SINGLE = {
  type: 'Bar',
  numberFormat: 's',
  color: 'elected',
  colorSort: 'none',
  colorRange: ['rgb(24,100,170)', '#bbb'],
  sort: 'none',
  y: 'label',
  column: 'category',
  columns: 1,
  inlineValue: true,
  inlineValueUnit: 'Stimmen',
  link: 'href'
}
const ELECTION_BAR_CONFIG_MULTIPLE = {
  type: 'Bar',
  numberFormat: 's',
  color: 'elected',
  colorSort: 'none',
  colorRange: ['rgb(24,100,170)', '#bbb'],
  sort: 'none',
  y: 'label',
  column: 'category',
  columns: 2,
  minInnerWidth: 170,
  inlineValue: true,
  inlineValueUnit: 'Stimmen',
  link: 'href'
}

const VoteResult = ({ votings, elections, vt, t }) => (
  <Fragment>
    {votings &&
      votings.map(({ id, data }) => (
        <VoteResultSingle key={id} data={data} />
      ))}
    {elections &&
      elections.map(({ id, data }) => {
        const results = data.result.candidacies.filter(
          result => result.candidacy
        )
        const filledCount = sum(results, r => r.count)
        const numElected = results.filter(r => r.elected).length
        const numNotElected = results.filter(r => !r.elected).length
        const values = results.map(result => ({
          value: String(result.count),
          elected: result.elected ? '1' : '0',
          label: result.candidacy.user.name,
          href: `/~${result.candidacy.user.username ||
            result.candidacy.user.id}`,
          category: result.elected
            ? vt.pluralize('vote/election/elected', {
                count: numElected
              })
            : vt.pluralize('vote/election/notElected', {
                count: numNotElected
              })
        }))

        const empty = data.result.candidacies.find(result => !result.candidacy)
        const emptyVotes = empty ? empty.count : 0

        const { eligible, submitted } = data.turnout
        const manualFootnote = vt(
          `vote/election/${id}/footnote`,
          undefined,
          null
        )

        return (
          <Fragment key={id}>
            <ChartTitle>{vt(`vote/${id}/title`)}</ChartTitle>
            <Chart
              t={t}
              config={
                numElected === 1
                  ? ELECTION_BAR_CONFIG_SINGLE
                  : ELECTION_BAR_CONFIG_MULTIPLE
              }
              values={values}
            />
            <Editorial.Note style={{ marginTop: 10 }}>
              {vt('vote/election/turnout', {
                formattedPercent: percentFormat(submitted / eligible),
                formattedCount: countFormat(emptyVotes + filledCount),
                formattedEmptyCount: countFormat(emptyVotes),
                formattedFilledCount: countFormat(filledCount)
              })}
              {manualFootnote ? <span> {manualFootnote}</span> : null}
            </Editorial.Note>
          </Fragment>
        )
      })}
  </Fragment>
)

export default compose(voteT, withT)(VoteResult)
