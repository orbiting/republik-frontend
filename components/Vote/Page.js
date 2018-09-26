import React from 'react'
import Frame from '../Frame'
import withMe from '../../lib/apollo/withMe'
import { compose } from 'react-apollo'

import VoteInfo from './VoteInfo'
import voteT from './voteT'

// import VoteForm from './VoteForm'

class Page extends React.Component {
  render () {
    const {url, vt} = this.props

    const meta = {
      title: vt('info/title'),
      description: vt('info/description')
    }

    return (
      <Frame meta={meta} url={url}>
        {
          <VoteInfo />
        }
      </Frame>
    )
  }
}

export default compose(
  withMe,
  voteT
)(Page)
