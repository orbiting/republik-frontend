import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withMembership } from '../Auth/checkRoles'
import withT from '../../lib/withT'
import { styles as iconLinkStyles } from '../IconLink'
import IconDefault from 'react-icons/lib/md/bookmark-outline'
import IconBookmarked from 'react-icons/lib/md/bookmark'
import { colors } from '@project-r/styleguide'

import {
  onDocumentFragment
} from '../Bookmarks/fragments'

export const BOOKMARKS_LIST_NAME = 'bookmarks'

const styles = {
  button: css({
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer'
  })
}

class Bookmark extends Component {
  constructor (props) {
    super(props)

    this.state = {
      bookmarked: props.bookmarked,
      mutating: false
    }

    this.toggle = () => {
      const { bookmarked, mutating } = this.state
      if (mutating) {
        return
      }
      this.setState({
        mutating: true
      })
      const {
        addDocumentToList,
        removeDocumentFromList,
        documentId
      } = this.props
      const mutate = bookmarked ? removeDocumentFromList : addDocumentToList
      mutate(documentId)
        .then(this.finish)
        .catch(this.catchServerError)
    }

    this.finish = () => {
      this.setState({
        mutating: false,
        bookmarked: !this.state.bookmarked
      })
    }

    this.catchServerError = error => {
      this.setState(() => ({
        mutating: false,
        serverError: error
      }))
    }
  }

  render () {
    const { t, style, small, isMember } = this.props
    if (!isMember) {
      return null
    }
    const { bookmarked, mutating } = this.state
    const Icon = bookmarked ? IconBookmarked : IconDefault
    const title = t(`bookmark/title/${bookmarked ? 'bookmarked' : 'default'}`)
    const size = small ? 23 : 27

    return (
      <button
        {...iconLinkStyles.link}
        {...styles.button}
        style={style}
        title={title}
        onClick={this.toggle}>
        <Icon size={size} fill={mutating ? colors.disabled : colors.text} />
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
  addDocumentToList: PropTypes.func,
  removeDocumentFromList: PropTypes.func
}

const addMutation = gql`
  mutation addDocumentToList(
    $documentId: ID!
    $listName: ID!
  ) {
    addDocumentToList(documentId: $documentId, listName: $listName) {
      id
      ...BookmarkOnDocument
    }
  }

  ${onDocumentFragment}
`

const removeMutation = gql`
  mutation removeDocumentFromList(
    $documentId: ID!
    $listName: ID!
  ) {
    removeDocumentFromList(documentId: $documentId, listName: $listName) {
      id
      ...BookmarkOnDocument
    }
  }

  ${onDocumentFragment}
`

export default compose(
  graphql(addMutation, {
    props: ({ mutate }) => ({
      addDocumentToList: (documentId) =>
        mutate({
          variables: {
            documentId,
            listName: BOOKMARKS_LIST_NAME
          }
        })
    })
  }),
  graphql(removeMutation, {
    props: ({ mutate }) => ({
      removeDocumentFromList: (documentId) =>
        mutate({
          variables: {
            documentId,
            listName: BOOKMARKS_LIST_NAME
          }
        })
    })
  }),
  withT,
  withMembership
)(Bookmark)
