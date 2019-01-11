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
    const { documents, totalCount, unfilteredCount, hasMore, t } = this.props
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
                  count: documents.length,
                  remaining: totalCount - unfilteredCount
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
  documents: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  unfilteredCount: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  t: PropTypes.func.isRequired
}

export default compose(
  withT,
  withInNativeApp
)(DocumentList)
