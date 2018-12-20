import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { styles as iconLinkStyles } from '../IconLink'
import IconDefault from 'react-icons/lib/md/bookmark-outline'
import IconBookmarked from 'react-icons/lib/md/bookmark'
import { colors } from '@project-r/styleguide'

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
        documentId,
        listId
      } = this.props
      const mutate = bookmarked ? addDocumentToList : removeDocumentFromList
      mutate(documentId, listId)
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
    const size = small ? 23 : 28

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
  documentId: PropTypes.string.isRequired, // TODO: finalize API, use repoId?
  listId: PropTypes.string.isRequired, // TODO: finalize API.
  addDocumentToList: PropTypes.func,
  removeDocumentFromList: PropTypes.func
}

const mockedPromise = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })

// TODO: remove and wire up with graphql enhancer.
Bookmark.defaultProps = {
  documentId: 'foo',
  listId: 'bar',
  addDocumentToList: mockedPromise,
  removeDocumentFromList: mockedPromise
}

export default compose(
  withT
)(Bookmark)
