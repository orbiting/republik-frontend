import React from 'react'
import { flowRight as compose } from 'lodash'
import { graphql } from '@apollo/client/react/hoc'
import gql from 'graphql-tag'
import { Loader, CommentTeaser, mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'

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
          <div {...styles.row}>
            {featured.nodes.map(comment => {
              return (
                <div {...styles.comment} key={comment.id}>
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
                </div>
              )
            })}
          </div>
        )}
      />
    </SectionContainer>
  )
}

const styles = {
  row: css({
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 1280,
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }),
  comment: css({
    margin: '0 auto',
    width: '100%',
    maxWidth: 500,
    padding: 0,
    [mediaQueries.mUp]: {
      width: '50%',
      padding: '0 15px'
    }
  })
}

const query = gql`
  query MarketingCommunity {
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
