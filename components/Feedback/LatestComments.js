import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { withComments } from './enhancers'

import CommentTeaser from './CommentTeaser'

import { Loader } from '@project-r/styleguide'

class LatestComments extends Component {
  render () {
    const { data, onTeaserClick, filter = [] } = this.props

    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          const { comments } = data
          return (
            <div>
              {comments && comments.nodes
                .filter(node => filter.indexOf(node.discussion.id) === -1)
                .map(
                  node => (
                    <CommentTeaser
                      key={node.id}
                      {...node}
                      onTeaserClick={onTeaserClick}
                    />
                  )
                )}
            </div>
          )
        }} />
    )
  }
}

export default compose(
  withComments
)(LatestComments)
