import React, {Fragment} from 'react'
import Frame from '../Frame'
import withMe from '../../lib/apollo/withMe'
import { compose } from 'react-apollo'
import {
  Interaction,
  mediaQueries,
  A
} from '@project-r/styleguide'

import { Router } from '../../lib/routes'
import VoteInfo from './VoteInfo'
import VoteForm from './VoteForm'

import { VOTING_STAGES } from './votingStage'

class Page extends React.Component {
  render () {
    const meta = {
      title: 'Wahl des Genossenschaftsrats',
      description: 'Bestimme über die Zukunft der Republik!'
    }

    const {url} = this.props

    return (
      <Frame meta={meta} url={url} disableNavBar>
        { url.query.stage===VOTING_STAGES.VOTE
          ? <VoteForm />
          : <VoteInfo />
        }
      </Frame>
    )
  }
}

export default compose(
  withMe
)(Page)
