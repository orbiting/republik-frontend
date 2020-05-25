import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withMembership } from '../Auth/checkRoles'
import withT from '../../lib/withT'
import { styles as iconLinkStyles } from '../IconLink'
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'
import { useColorContext } from '@project-r/styleguide'
import { withRouter } from 'next/router'

import {
  onDocumentFragment,
  BOOKMARKS_COLLECTION_NAME
} from '../Bookmarks/fragments'

import { getBookmarkedDocuments } from '../Bookmarks/queries'

const styles = {
  button: css({
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    marginBottom: '-1px',
    '@media(hover)': {
      '&:hover': {
        opacity: 0.6
      }
    }
  })
}

const BookmarkIcon = ({ error, mutating, bookmarked, small }) => {
  const [colorScheme] = useColorContext()
  const Icon = bookmarked ? MdBookmark : MdBookmarkBorder
  const size = small ? 23 : 27

  return (
    <Icon
      size={size}
      fill={
        error
          ? colorScheme.error
          : mutating
          ? colorScheme.disabled
          : colorScheme.text
      }
    />
  )
}

class Bookmark extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mutating: false
    }

    this.toggle = () => {
      const { bookmarked } = this.props
      const { mutating } = this.state
      if (mutating) {
        return
      }
      this.setState({
        mutating: true
      })
      const {
        addDocumentToCollection,
        removeDocumentFromCollection,
        documentId
      } = this.props
      const mutate = bookmarked
        ? removeDocumentFromCollection
        : addDocumentToCollection
      mutate(documentId, this.props.router.route !== '/bookmarks')
        .then(this.finish)
        .catch(this.catchServerError)
    }

    this.finish = () => {
      this.setState({
        mutating: false,
        error: undefined
      })
    }

    this.catchServerError = () => {
      this.setState({
        mutating: false,
        error: true
      })
    }
  }

  render() {
    const { t, style, small, isMember, bookmarked } = this.props
    if (!isMember) {
      return null
    }
    const { mutating, error } = this.state
    const title = t(`bookmark/title/${bookmarked ? 'bookmarked' : 'default'}`)

    return (
      <button
        {...iconLinkStyles.link}
        {...styles.button}
        style={style}
        title={title}
        onClick={this.toggle}
      >
        <BookmarkIcon
          small={small}
          bookmarked={bookmarked}
          error={error}
          mutating={mutating}
        />
      </button>
    )
  }
}

Bookmark.propTypes = {
  t: PropTypes.func.isRequired,
  bookmarked: PropTypes.bool,
  small: PropTypes.bool,
  style: PropTypes.object,
  documentId: PropTypes.string.isRequired,
  addDocumentToCollection: PropTypes.func.isRequired,
  removeDocumentFromCollection: PropTypes.func.isRequired
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
          refetchQueries: update ? [{ query: getBookmarkedDocuments }] : []
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
          refetchQueries: update ? [{ query: getBookmarkedDocuments }] : []
        })
    })
  }),
  withT,
  withRouter,
  withMembership
)(Bookmark)
