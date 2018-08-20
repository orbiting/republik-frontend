import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import { Interaction } from '@project-r/styleguide'

import Box from '../../Frame/Box'
import { MainContainer } from '../../Frame'

import withT from '../../../lib/withT'
import { timeFormat } from '../../../lib/utils/format'
import query from '../belongingsQuery'

const { H2, P } = Interaction

const dayFormat = timeFormat('%e. %B %Y')

class AccessGrants extends Component {
  render () {
    const { accessGrants } = this.props

    return accessGrants.length > 0 && (
      <Box>
        <MainContainer>
          <H2>Zugriff durch eine geteilte Mitgliedschaft</H2>
          <P>Sie können die Republik lesen, weil Verlegerinnen ihre
            Mitgliedschaft mit Ihnen teilen:</P>
          {accessGrants.map((grant, i) => (
            <P key={i}>
              {grant.grantee.name} ({grant.grantee.email}) teilt
              eine Mitgliedschaft mit dir,
              gültig bis {dayFormat(new Date(grant.endAt))}
            </P>
          ))}
        </MainContainer>
      </Box>
    )
  }
}

export default compose(
  graphql(query, {
    props: ({data}) => ({
      accessGrants: (
        (
          !data.loading &&
          !data.error &&
          data.me &&
          data.me.accessGrants
        ) || []
      )
    })
  }),
  withT
)(AccessGrants)
