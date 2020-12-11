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
                    <CommentTeaser
                      {...{
                        ...comment,
                        discussion: {
                          ...comment.discussion,
                          image:
                            comment.discussion?.document?.meta?.twitterImage
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
              twitterImage
            }
          }
        }
      }
    }
  }
`

export default compose(graphql(query))(Community)
