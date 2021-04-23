import React, { useState } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import { BookmarkIcon, BookmarkBorderIcon } from '@project-r/styleguide/icons'
import { useColorContext, IconButton } from '@project-r/styleguide'

import { withMembership } from '../Auth/checkRoles'
import withT from '../../lib/withT'
import {
  onDocumentFragment,
  BOOKMARKS_COLLECTION_NAME
} from '../Bookmarks/fragments'
import { getRefetchQueries } from '../Bookmarks/queries'

const Bookmark = ({
  t,
  bookmarked,
  isMember,
  addDocumentToCollection,
  removeDocumentFromCollection,
  documentId,
  skipRefetch,
  router,
  label
}) => {
  const [mutating, setMutating] = useState(false)
  const [error, setError] = useState(undefined)
  const [colorScheme] = useColorContext()
  const Icon = bookmarked ? BookmarkIcon : BookmarkBorderIcon

  const toggle = () => {
    if (mutating) {
      return
    }
    setMutating(true)
    const mutate = bookmarked
      ? removeDocumentFromCollection
      : addDocumentToCollection
    mutate(documentId, !skipRefetch && router.route !== '/bookmarks')
      .then(() => {
        setMutating(false)
        setError(undefined)
      })
      .catch(() => {
        setMutating(false)
        setError(true)
      })
  }

  const title = t(`bookmark/title/${bookmarked ? 'bookmarked' : 'default'}`)

  if (!isMember) {
    return null
  }

  return (
    <IconButton
      Icon={Icon}
      title={title}
      label={label}
      onClick={() => toggle()}
      fillColorName={error ? 'error' : mutating ? 'disabled' : 'text'}
    />
  )
}

const addMutation = gql`
  mutation addDocumentToCollection($documentId: ID!, $collectionName: String!) {
    addDocumentToCollection(
      documentId: $documentId
      collectionName: $collectionName
    ) {
      id
      document {
        id
        ...BookmarkOnDocument
      }
    }
  }

  ${onDocumentFragment}
`

const removeMutation = gql`
  mutation removeDocumentFromCollection(
    $documentId: ID!
    $collectionName: String!
  ) {
    removeDocumentFromCollection(
      documentId: $documentId
      collectionName: $collectionName
    ) {
      id
      document {
        id
        ...BookmarkOnDocument
      }
    }
  }

  ${onDocumentFragment}
`

export default compose(
  graphql(addMutation, {
    props: ({ mutate }) => ({
      addDocumentToCollection: (documentId, update) =>
        mutate({
          variables: {
            documentId,
            collectionName: BOOKMARKS_COLLECTION_NAME
          },
          refetchQueries: update ? getRefetchQueries() : []
        })
    })
  }),
  graphql(removeMutation, {
    props: ({ mutate }) => ({
      removeDocumentFromCollection: (documentId, update) =>
        mutate({
          variables: {
            documentId,
            collectionName: BOOKMARKS_COLLECTION_NAME
          },
          refetchQueries: update ? getRefetchQueries() : []
        })
    })
  }),
  withT,
  withRouter,
  withMembership
)(Bookmark)
