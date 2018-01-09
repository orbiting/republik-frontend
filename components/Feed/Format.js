import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Center, TeaserFeed, Loader } from '@project-r/styleguide'
import Link from '../Link/Href'

const getFeedDocuments = gql`
query getFeedDocuments($formatId: String!) {
  documents(format: $formatId) {
    nodes {
      meta {
        credits
        title
        description
        publishDate
        path
      }
    }
  }
}
`

const Feed = ({ data: { loading, error, documents } }) => (
  <Loader
    loading={loading}
    error={error}
    render={() => {
      return (
        <Center>
          {documents &&
            documents.nodes.map(doc => (
              <TeaserFeed
                {...doc.meta}
                Link={Link}
                key={doc.meta.path}
              />
            ))}
        </Center>
      )
    }}
  />
)

export default compose(
  graphql(getFeedDocuments)
)(Feed)
