import React from 'react'
import { compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Center, Interaction } from '@project-r/styleguide'

import withT from '../../lib/withT'

import Box from '../Frame/Box'
import { onDocumentFragment as bookmarkOnDocumentFragment } from '../Bookmarks/fragments'
import { WithoutMembership, WithActiveMembership } from '../Auth/withMembership'

import DocumentListContainer from '../Feed/DocumentListContainer'

const Feed = ({ t, formats, totalCount }) => {
  const getFeedDocuments = `
    query {
      documents(formats: ["${formats.join('","')}"]) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }  
        nodes {
          id
          ...BookmarkOnDocument
          meta {
            credits
            title
            description
            publishDate
            path
            format {
              id
              meta {
                kind
                color
                title
              }
            }
            estimatedReadingMinutes
            estimatedConsumptionMinutes
            indicateChart
            indicateGallery
            indicateVideo
            audioSource {
              mp3
            }
          }
        }
      }
    }
    ${bookmarkOnDocumentFragment}
  `

  const help = (
    <WithoutMembership
      render={() => (
        <Box style={{ marginBottom: 30, padding: '15px 20px' }}>
          <Interaction.P>{t('section/feed/payNote')}</Interaction.P>
        </Box>
      )}
    />
  )

  return (
    <Center>
      <DocumentListContainer
        feedProps={{ showHeader: false }}
        help={help}
        showTotal={true}
        query={gql(getFeedDocuments)}
      />
    </Center>
  )
}

export default compose(withT)(Feed)
