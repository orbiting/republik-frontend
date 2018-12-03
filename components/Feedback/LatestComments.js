import React, { Component } from 'react'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'

import { withComments } from './enhancers'

import {
  Loader
} from '@project-r/styleguide'

import CommentTeaser from './CommentTeaser'

class LatestComments extends Component {
  render () {
    const { t, data, onArticleClick, filter = [] } = this.props

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
                    <CommentTeaser key={node.id} t={t} {...node} onArticleClick={onArticleClick} />
                  )

                )}
            </div>
          )
        }} />
    )
  }
}

export default compose(
  withComments,
  withT
)(LatestComments)
