import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Loader } from '@project-r/styleguide'

const query = gql`
query getActiveDiscussions($lastDays: Int!, $highlightId: ID) {
  highlight: comments(first: 1, focusId: $highlightId) {
    id
    nodes {
      id
      displayAuthor {
        id
        ...AuthorMetaData
      }
      discussion {
        id
        ...DiscussionMetaData
        comments(first: 0) {
          totalCount
        }
      }
    }
  }
  activeDiscussions(lastDays: $lastDays) {
    discussion {
      id
      ...DiscussionMetaData
      comments(first: 2) {
        totalCount
        nodes {
          id
          preview(length: 240) {
            string
            more
          }
          displayAuthor {
            id
            ...AuthorMetaData
          }
        }
      }
    }
  }
}

fragment AuthorMetaData on DisplayUser {
  id
  name
  slug
  credential {
    description
    verified
  }
  profilePicture
}

fragment DiscussionMetaData on Discussion {
  id
  title
  path
  closed
  document {
    id
    meta {
      title
      path
      template
      ownDiscussion {
        id
        closed
      }
    }
  }
}
`

const DiscussionFront = ({ data, highlight }) => {
  if (data.loading || data.error) {
    return <Loader loading={data.loading} error={data.error} />
  }

  // check that requested focus id was returned
  const maybeHighlightComment = data.highlight.nodes[0]
  const hasHighlight = maybeHighlightComment && maybeHighlightComment.id === highlight.id

  let discussions = data.activeDiscussions.map(a => a.discussion)
  if (hasHighlight) {
    const highlightComment = {
      ...maybeHighlightComment,
      highlight: highlight.quote,
      discussion: undefined
    }
    // ensure first discussion is the one with the highlight
    let highlightDiscussion = discussions.find(d => d.id === maybeHighlightComment.discussion.id)
    if (highlightDiscussion) {
      discussions.splice(discussions.indexOf(highlightDiscussion), 1)
    } else {
      highlightDiscussion = maybeHighlightComment.discussion
    }
    discussions.unshift({
      ...highlightDiscussion,
      comments: {
        totalCount: highlightDiscussion.comments.totalCount,
        nodes: [highlightComment].concat(highlightDiscussion.comments.nodes || [])
      }
    })
  }

  const seenNames = new Set()
  let remainingComments = 5

  discussions = discussions.reduce(
    (all, discussion, i) => {
      let remainingCommentsPerDiscussion = i === 0 ? 2 : 1
      // get comments from never before seen names
      // - max 5 in total
      // - max 2 for first discussion, max 1 for the rest
      const nodes = discussion.comments.nodes.filter(comment => {
        if (!remainingComments || !remainingCommentsPerDiscussion || seenNames.has(comment.displayAuthor.name)) {
          return false
        }
        seenNames.add(comment.displayAuthor.name)
        remainingComments -= 1
        remainingCommentsPerDiscussion -= 1
        return true
      })

      if (nodes.length) {
        all.push({
          ...discussion,
          comments: {
            ...discussion.comments,
            nodes
          }
        })
      }

      return all
    },
    []
  )

  return <pre>{JSON.stringify({
    hasHighlight,
    discussions
  }, undefined, 2)}</pre>
}

export default compose(
  graphql(query, {
    options: ({ lastDays, highlight: { id: highlightId } = {} }) => ({
      variables: {
        lastDays,
        highlightId
      }
    })
  })
)(DiscussionFront)
