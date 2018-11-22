import React, { Component } from 'react'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'

import { withComments } from './enhancers'

import {
  Loader
} from '@project-r/styleguide'

import CommentTeaser from '../Search/CommentTeaser'

class LatestComments extends Component {
  render () {
    const { t, data } = this.props

    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          const { comments } = data
          return (
            <div>
              {comments && comments.nodes.map(
                node => (
                  <CommentTeaser t={t} {...node} />
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
