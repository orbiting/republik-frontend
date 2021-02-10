import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Loader,
  TeaserFrontTileRow,
  TeaserFrontTile,
  CommentTeaser,
  Breakout
} from '@project-r/styleguide'

import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'
import CommentLink from '../Discussion/CommentLink'

const Community = ({ t, data: { loading, error, featured } }) => {
  return (
    <SectionContainer>
      <SectionTitle
        title={t('marketing/page/community/title')}
        lead={t('marketing/page/community/lead')}
      />
      <Loader
        loading={loading}
        error={error}
        style={{ minHeight: 400 }}
        render={() => (
          <TeaserFrontTileRow columns={2} noPadding>
            {featured.nodes.map(comment => {
              return (
                <TeaserFrontTile key={comment.id} align='top' aboveTheFold>
                  <CommentTeaser
                    {...{
                      ...comment,
                      discussion: {
                        ...comment.discussion,
                        image: comment.discussion?.document?.meta?.image
                      }
                    }}
                    Link={CommentLink}
                    t={t}
                  />
                </TeaserFrontTile>
              )
            })}
          </TeaserFrontTileRow>
        )}
      />
    </SectionContainer>
  )
}

const query = gql`
  query FeaturedCommunityComments {
    featured: comments(
      orderBy: FEATURED_AT
      orderDirection: DESC
      first: 2
      featuredTarget: MARKETING
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
              image
            }
          }
        }
      }
    }
  }
`

export default compose(graphql(query))(Community)
