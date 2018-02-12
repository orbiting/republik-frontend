import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Center, TeaserFeed, Interaction, Loader } from '@project-r/styleguide'
import Link from '../Link/Href'

import withT from '../../lib/withT'

import Box from '../Frame/Box'
import { WithoutMembership } from '../Auth/withMembership'

const getFeedDocuments = gql`
query getFeedDocuments($formatId: String!) {
  documents(format: $formatId) {
    totalCount
    nodes {
      meta {
        credits
        title
        description
        publishDate
        path
        format {
          meta {
            kind
          }
        }
      }
    }
  }
}
`

const Feed = ({ t, data: { loading, error, documents } }) => (
  <Loader
    loading={loading}
    error={error}
    render={() => {
      return (
        <Center>
          <Interaction.H2>
            {t.pluralize('format/feed/title', {count: documents.totalCount})}
          </Interaction.H2>
          <br /><br />
          <WithoutMembership render={() => (
            <Box style={{padding: '15px 20px'}}>
              <Interaction.P>
                {t('format/feed/payNote')}
              </Interaction.P>
            </Box>
          )} />
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
  withT,
  graphql(getFeedDocuments)
)(Feed)
