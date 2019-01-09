import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import withT from '../../lib/withT'
import { styles as iconLinkStyles } from '../IconLink'
import IconDefault from 'react-icons/lib/md/bookmark-outline'
import IconBookmarked from 'react-icons/lib/md/bookmark'
import { colors } from '@project-r/styleguide'

export const BOOKMARKS_LIST_NAME = 'bookmarks'

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
    const { t, style, small } = this.props
    const { bookmarked, mutating } = this.state
    const Icon = bookmarked ? IconBookmarked : IconDefault
    const title = t(`bookmark/title/${bookmarked ? 'bookmarked' : 'default'}`)
    const size = small ? 23 : 27

    return (
      <a {...iconLinkStyles.link}
        style={{ cursor: 'pointer', paddingTop: 1, ...style }}
        title={title}
        onClick={this.toggle}>
        <Icon size={size} fill={mutating ? colors.disabled : colors.text} />
      </a>
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
#      userListItems {
#        id
#        list {
#          id
#          name
#        }
#      }
    }
  }
`

const removeMutation = gql`
  mutation removeDocumentFromList(
    $documentId: ID!
    $listName: ID!
  ) {
    removeDocumentFromList(documentId: $documentId, listName: $listName) {
      id
      userListItems {
        id
        list {
          id
          name
        }
      }
    }
  }
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
  withT
)(Bookmark)
