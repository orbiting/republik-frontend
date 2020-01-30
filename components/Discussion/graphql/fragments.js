import gql from 'graphql-tag'

export const discussion = gql`
  fragment Discussion on Discussion {
    id
    closed
    title
    path
    userPreference {
      anonymity
      credential {
        description
        verified
      }
      notifications
    }
    rules {
      maxLength
      minInterval
      anonymity
      disableTopLevelComments
    }
    userWaitUntil
    userCanComment
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
    document {
      id
      meta {
        path
        template
        ownDiscussion {
          id
          closed
        }
        linkedDiscussion {
          id
          path
          closed
        }
      }
    }
    collapsable
    tagRequired
    tags
  }
`

export const comment = gql`
  fragment Comment on Comment {
    id
    text
    content
    published
    adminUnpublished
    downVotes
    upVotes
    userVote
    userCanEdit
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
    embed {
      ... on LinkPreview {
        url
        title
        description
        imageUrl
        imageAlt
        siteName
        siteImageUrl
        updatedAt
        __typename
      }
      ... on TwitterEmbed {
        id
        url
        text
        html
        userScreenName
        userProfileImageUrl
        image
        createdAt
        __typename
      }
    }
    updatedAt
    createdAt
    parentIds
    tags
    mentioningDocument {
      document {
        meta {
          path
        }
      }
      fragmentId
    }
  }
`

export const connectionInfo = gql`
  fragment ConnectionInfo on CommentConnection {
    id
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
  }
`
