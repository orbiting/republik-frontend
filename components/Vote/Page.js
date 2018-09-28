import React from 'react'
import Frame from '../Frame'
import withMe from '../../lib/apollo/withMe'
import { compose } from 'react-apollo'

import VoteInfo from './VoteInfo'
import voteT from './voteT'
import { getVotingStage, VOTING_STAGES } from './votingStage'
import VoteForm from './VoteForm'
import VoteMarketing from './VoteMarketing'

class Page extends React.Component {
  renderVoteComponent () {
    const {me} = this.props
    const isAssociate = me.roles.some(r => r === 'associate')

    switch (getVotingStage()) {
      case VOTING_STAGES.VOTE:
        return <VoteForm />
      default:
        return isAssociate ? <VoteInfo /> : <VoteMarketing />
    }
  }

  render () {
    const {url, vt} = this.props

    const meta = {
      title: vt('info/title'),
      description: vt('info/description')
    }

    return (
      <Frame meta={meta} url={url}>
        {this.renderVoteComponent()}
      </Frame>
    )
  }
}

export default compose(
  withMe,
  voteT
)(Page)
