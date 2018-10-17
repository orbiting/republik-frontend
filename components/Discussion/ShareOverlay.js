import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import withT from '../../lib/withT'
import Loader from '../Loader'

import ShareOverlay from '../ActionBar/ShareOverlay'

const DiscussionShareOverlay = ({
  t,
  data: { loading, error, discussion },
  onClose,
  url
}) => (
  <Loader
    loading={loading}
    error={error}
    render={() => {
      const { title } = discussion
      return (
        <ShareOverlay
          onClose={onClose}
          url={url}
          title={t('discussion/share/title')}
          tweet={''}
          emailSubject={t('discussion/share/emailSubject', {
            title
          })}
          emailBody={''}
          emailAttachUrl={url}
        />
      )
    }}
  />
)

const discussionQuery = gql`
query getDiscussion($discussionId: ID!) {
  discussion(id: $discussionId) {
    id
    title
  }
}
`

export default compose(
  withT,
  graphql(discussionQuery, {
    options: ({ discussionId }) => ({
      variables: {
        discussionId
      }
    })
  })
)(DiscussionShareOverlay)
