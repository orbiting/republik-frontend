import React from 'react'

import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { ascending } from 'd3-array'

import Chart, { ChartTitle } from '@project-r/styleguide/lib/components/Chart'

import Loader from '../Loader'
import withT from '../../lib/withT'

const query = gql`
query getQuestionnaireResults($slug: String!) {
  questionnaire(slug: $slug) {
    id
    slug
    questions {
      id
      text
      turnout {
        skipped
        submitted
      }
      __typename
      ... on QuestionTypeRange {
        result {
          median
          histogram {
            x0
            x1
            count
          }
        }
      }
      ... on QuestionTypeChoice {
        results: result {
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
        results: result {
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
  colorRange: ['rgb(24,100,170)', '#bbb'],
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
  colorRange: ['rgb(24,100,170)', '#bbb'],
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
  colorRange: ['rgb(187,21,26)', 'rgb(239,69,51)', '#bbb', 'rgb(75,151,201)', 'rgb(24,100,170)'],
  sort: 'none',
  barStyle: 'large',
  // inlineValue: true,
  // inlineSecondaryLabel: 'label',
  colorLegend: true
}

const HISTO_BAR_CONFIG = {
  type: 'TimeBar',
  numberFormat: 's',
  sort: 'none'
}

const RankedBars = withT(({ t, question }) => {
  if (question.__typename === 'QuestionTypeDocument') {
    return (
      <Chart t={t}
        config={RANKED_BAR_CONFIG}
        values={question.results
          .filter(result => result.count >= 3 && result.document)
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
  const mapResult = result => ({
    label: result.option.label,
    category: result.option.category,
    value: String(result.count)
  })
  const filter = result => result.count >= 3
  return (
    <Chart t={t}
      config={RANKED_CATEGORY_BAR_CONFIG}
      values={question.results.filter(filter).map(mapResult)} />
  )
})

const HistoBars = withT(({ t, question }) => {
  const mapResult = result => ({
    year: 10 + (result.x0 * 10),
    value: String(result.count)
  })

  return (
    <Chart t={t}
      config={HISTO_BAR_CONFIG}
      values={question.result.histogram.map(mapResult)} />
  )
})

const Results = ({ data }) => {
  return <Loader loading={data.loading} error={data.error} render={() => {
    return data.questionnaire.questions.map(question => {
      const { id, text } = question

      if (question.__typename === 'QuestionTypeText') {
        return null
      }

      return (
        <div style={{ marginBottom: 40 }} key={id}>
          { text && <ChartTitle>{text}</ChartTitle> }
          { question.results && <RankedBars question={question} />}
          { question.result && <HistoBars question={question} />}
        </div>
      )
    })
  }} />
}

export default compose(
  graphql(query)
)(Results)
