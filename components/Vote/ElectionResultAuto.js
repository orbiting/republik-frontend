import React from 'react'
import { gql } from '@apollo/client'
import { graphql } from '@apollo/client/react/hoc'
import Loader from '../Loader'
import ElectionResultSingle from './ElectionResultSingle'

const electionsQuery = gql`
  query electionResults($slug: String!) {
    election(slug: $slug) {
      id
      userHasSubmitted
      userSubmitDate
      userIsEligible
      beginDate
      endDate
      turnout {
        eligible
        submitted
      }
      result {
        candidacies {
          count
          elected
          candidacy {
            id
            user {
              id
              username
              name
            }
            recommendation
          }
        }
      }
    }
  }
`

const ElectionResultAuto = graphql(
  electionsQuery
)(({ title, footnote, data }) => (
  <Loader
    loading={data.loading}
    error={data.error}
    render={() => (
      <ElectionResultSingle
        title={title}
        footnote={footnote}
        data={data.election}
      />
    )}
  />
))

export default ElectionResultAuto
