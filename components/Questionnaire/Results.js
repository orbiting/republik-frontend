import React from 'react'

import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { ascending } from 'd3-array'

import Chart, { ChartTitle } from '@project-r/styleguide/lib/components/Chart'

import { Editorial } from '@project-r/styleguide'

import Loader from '../Loader'
import withT from '../../lib/withT'

import { countFormat } from '../../lib/utils/format'

const query = gql`
query getQuestionnaireResults($slug: String!, $orderFilter: [Int!]) {
  questionnaire(slug: $slug) {
    id
    slug
    questions(orderFilter: $orderFilter) {
      id
      text
      turnout {
        skipped
        submitted
      }
      __typename
      ... on QuestionTypeRange {
        ticks {
          label
          value
        }
        result {
          median
          histogram(ticks: 10) {
            x0
            x1
            count
          }
        }
      }
      ... on QuestionTypeChoice {
        results: result(min: 3) {
          count
          option {
            label
            category
          }
        }
        options {
          label
        }
      }
      ... on QuestionTypeDocument {
        results: result(min: 3, top: 20) {
          count
          document {
            meta {
              title
              path
            }
          }
        }
      }
    }
  }
}
`

const RANKED_CATEGORY_BAR_CONFIG = {
  type: 'Bar',
  numberFormat: 's',
  colorSort: 'none',
  colorRange: ['#62790E'],
  sort: 'none',
  y: 'label',
  column: 'category',
  columnSort: 'none',
  columns: 3,
  minInnerWidth: 170,
  inlineValue: true,
  link: 'href'
}

const RANKED_BAR_CONFIG = {
  type: 'Bar',
  numberFormat: 's',
  colorSort: 'none',
  colorRange: ['#62790E'],
  sort: 'none',
  y: 'label',
  minInnerWidth: 170,
  inlineValue: true,
  link: 'href'
}

const STACKED_BAR_CONFIG = {
  type: 'Bar',
  numberFormat: '.0%',
  color: 'label',
  colorSort: 'none',
  colorRange: [
    '#3D155B', '#A46FDA',
    '#B9EB56', '#90AA00', '#62790E'
  ],
  sort: 'none',
  barStyle: 'large',
  colorLegend: true,
  domain: [0, 1]
}

const BIN_BAR_CONFIG = {
  ...STACKED_BAR_CONFIG,
  colorRange: [
    '#3D155B', '#542785', '#A46FDA', '#C79CF0',
    '#bbb', '#bbb',
    '#D6FA90', '#B9EB56', '#90AA00', '#62790E'
  ]
}

const RankedBars = withT(({ t, question }) => {
  if (question.__typename === 'QuestionTypeDocument') {
    return (
      <Chart t={t}
        config={RANKED_BAR_CONFIG}
        values={question.results
          .filter(result => result.document)
          .map(result => ({
            label: result.document && result.document.meta.title,
            href: result.document && result.document.meta.path,
            value: String(result.count)
          }))} />
    )
  }
  if (question.options && question.options.length === 5) {
    const mapResult = result => {
      return {
        index: question.options.findIndex(option => (
          option.label === result.option.label
        )),
        label: result.option.label,
        category: result.option.category,
        value: String(result.count / question.turnout.submitted)
      }
    }
    return (
      <Chart t={t}
        config={STACKED_BAR_CONFIG}
        values={question.results.map(mapResult).sort(
          (a, b) => ascending(a.index, b.index)
        )} />
    )
  }

  const numberPerColumn = question.results.length / 3
  const mapResult = (result, i) => ({
    label: result.option.label,
    category:
      result.option.category ||
      `Top ${numberPerColumn * (1 + Math.floor(i / numberPerColumn))}`,
    value: String(result.count)
  })
  return (
    <Chart t={t}
      config={RANKED_CATEGORY_BAR_CONFIG}
      values={question.results.map(mapResult)} />
  )
})

const BinBars = withT(({ t, question }) => {
  const mapResult = (result, i) => {
    const tick = question.ticks.find(tick => (
      (i === 0 && tick.value === result.x0) ||
      tick.value === result.x1
    ))
    return {
      label: tick ? tick.label : `${result.x0}`,
      value: String(result.count / question.turnout.submitted)
    }
  }

  return (
    <Chart t={t}
      config={{
        ...BIN_BAR_CONFIG,
        colorLegendValues: question.ticks.map(tick => tick.label)
      }}
      values={question.result.histogram.map(mapResult)} />
  )
})

const DefaultWrapper = ({ children }) => (
  <div style={{ marginBottom: 40 }}>
    {children}
  </div>
)

const Results = ({ data, t, Wrapper = DefaultWrapper }) => {
  return <Loader loading={data.loading} error={data.error} render={() => {
    return data.questionnaire.questions.map(question => {
      const { id, text } = question

      if (question.__typename === 'QuestionTypeText') {
        return null
      }

      return (
        <Wrapper key={id}>
          { text && <ChartTitle>{text}</ChartTitle> }
          { question.results && <RankedBars question={question} />}
          { question.result && <BinBars question={question} />}
          { <Editorial.Note style={{ marginTop: 10 }}>
            {t('questionnaire/turnout', {
              formattedSubmittedCount: countFormat(question.turnout.submitted),
              formattedSkippedCount: countFormat(question.turnout.skipped)
            })}
          </Editorial.Note> }
        </Wrapper>
      )
    })
  }} />
}

export default compose(
  withT,
  graphql(query)
)(Results)
