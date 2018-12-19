import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'
import PropTypes from 'prop-types'
import withInNativeApp from '../../lib/withInNativeApp'

import { A, mediaQueries, Spinner } from '@project-r/styleguide'
import Feed from './Feed'

const styles = {
  container: css({
    [mediaQueries.mUp]: {
      maxWidth: 695,
      margin: 'auto'
    }
  }),
  more: css({
    position: 'relative',
    height: 50,
    padding: '10px 0 0 0'
  })
}

class DocumentList extends Component {
  constructor (props) {
    super(props)
    this.container = null
    this.setContainerRef = (el) => { this.container = el }
    this.state = {
      infiniteScroll: false,
      loadingMore: false
    }
    this.getRemainingDocumentsCount = (nodes) => {
      const { data: { documents } } = this.props
      return (documents.totalCount) - // all docs
        nodes.length - // already displayed
        (documents.nodes.length - nodes.length) // formats
    }
    this.onScroll = async () => {
      if (this.container) {
        const bbox = this.container.getBoundingClientRect()
        if (bbox.bottom < window.innerHeight * 10) {
          const { loadMore, hasMore } = this.props
          const { infiniteScroll } = this.state
          if (infiniteScroll && hasMore) {
            this.setState({ loadingMore: true })
            await loadMore()
            this.setState({ loadingMore: false })
          }
        }
      }
    }
    this.activateInfiniteScroll = async (e) => {
      e.preventDefault()
      this.setState(
        {
          infiniteScroll: true,
          loadingMore: true
        },
        this.onScroll
      )
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  }

  render () {
    const { infiniteScroll, loadingMore } = this.state
    const { data: { documents }, hasMore, t } = this.props
    return (
      <div {...styles.container}>
        <div ref={this.setContainerRef}>
          <Feed documents={documents} />
        </div>
        <div {...styles.more}>
          {loadingMore &&
          <Spinner />
          }
          {!infiniteScroll && hasMore &&
          <A href='#'
            onClick={this.activateInfiniteScroll}>
            {
              t('feed/loadMore',
                {
                  count: documents.nodes.length,
                  remaining: this.getRemainingDocumentsCount(documents.nodes)
                }
              )
            }
          </A>
          }
        </div>
      </div>
    )
  }
}

DocumentList.propTypes = {
  data: PropTypes.object.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  t: PropTypes.func.isRequired,
  inline: PropTypes.bool
}

export default compose(
  withT,
  withInNativeApp
)(DocumentList)
