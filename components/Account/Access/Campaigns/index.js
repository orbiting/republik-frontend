import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Campaign from './Campaign'

import query from '../../belongingsQuery'

class Campaigns extends Component {
  render () {
    const { accessCampaigns, grantAccess, revokeAccess } = this.props

    return accessCampaigns.length > 0 && accessCampaigns.map((campaign, key) => {
      return (
        <Campaign
          campaign={campaign}
          grantAccess={grantAccess}
          revokeAccess={revokeAccess}
          {...this.state}
          key={key} />
      )
    })
  }
}

const grantMutation = gql`
  mutation grantAccess(
    $campaignId: ID!
    $email: String!
  ) {
    grantAccess(campaignId: $campaignId, email: $email) {
      email
      endAt
    }
  }
`

const revokeMutation = gql`
  mutation revokeAccess(
    $id: ID!
  ) {
    revokeAccess(id: $id)
  }
`

export default compose(
  graphql(grantMutation, {
    props: ({mutate}) => ({
      grantAccess: variables => mutate({
        variables,
        refetchQueries: [{
          query
        }]
      })
    })
  }),
  graphql(revokeMutation, {
    props: ({mutate}) => ({
      revokeAccess: variables => mutate({
        variables,
        refetchQueries: [{
          query
        }]
      })
    })
  }),
  graphql(query, {
    props: ({data}) => ({
      loading: data.loading,
      accessCampaigns: (
        (
          !data.loading &&
          !data.error &&
          data.me &&
          data.me.accessCampaigns
        ) || []
      )
    })
  })
)(Campaigns)
