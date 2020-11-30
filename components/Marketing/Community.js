import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Loader,
  TeaserFrontTileRow,
  TeaserFrontTile,
  CommentTeaser,
  Breakout
} from '@project-r/styleguide'

import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'

const Community = ({ t, data: { loading, error, featured } }) => {
  return (
    <SectionContainer>
      <SectionTitle
        title='Wir stehen mit Ihnen im Dialog'
        lead='Unsere Community besteht aus kompetenten Profis. Den besten, die wir finden
          konnten. Uns eint die Leidenschaft für guten Journalismus.'
      />
      <Breakout size='breakout'>
        <Loader
          loading={loading}
          error={error}
          style={{ minHeight: 400 }}
          render={() => (
            <TeaserFrontTileRow>
              {featured.nodes.map(comment => {
                return (
                  <TeaserFrontTile
                    key={comment.id}
                    align='top'
                    textLeft
                    aboveTheFold
                  >
                    <CommentTeaser {...comment} t={t} />
                  </TeaserFrontTile>
                )
              })}
            </TeaserFrontTileRow>
          )}
        />
      </Breakout>
    </SectionContainer>
  )
}

const query = gql`
  query FeaturedCommunityComments {
    featured: comments(
      orderBy: FEATURED_AT
      orderDirection: DESC
      first: 2
      featured: true
    ) {
      id
      nodes {
        id
        featuredText
        createdAt
        updatedAt
        displayAuthor {
          id
          name
          slug
          credential {
            description
            verified
          }
          profilePicture
        }
        discussion {
          id
          title
          path
          comments(first: 0) {
            totalCount
          }
          document {
            id
            meta {
              twitterImage
            }
          }
        }
      }
    }
  }
`

export default compose(graphql(query))(Community)
