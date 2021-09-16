import React from 'react'
import { gql } from '@apollo/client'
import { graphql } from '@apollo/client/react/hoc'
import VoteResultSingle from './VoteResultSingle'
import Loader from '../Loader'

const votingQuery = gql`
  query votingResults($slug: String!) {
    voting(slug: $slug) {
      id
      description
      turnout {
        eligible
        submitted
      }
      result {
        options {
          count
          winner
          option {
            id
            label
          }
        }
      }
    }
  }
`

const VoteResultAuto = graphql(votingQuery)(({ data }) => (
  <Loader
    loading={data.loading}
    error={data.error}
    render={() => <VoteResultSingle data={data.voting} />}
  />
))

export default VoteResultAuto
