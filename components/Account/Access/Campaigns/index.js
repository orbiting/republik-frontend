import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Campaign from './Campaign'

import query from '../../belongingsQuery'

const Campaigns = ({ accessCampaigns, grantAccess, revokeAccess }) => {
  return (
    accessCampaigns &&
    accessCampaigns.map((campaign, key) => {
      return (
        <Campaign
          key={`campaign-${key}`}
          campaign={campaign}
          grantAccess={grantAccess}
          revokeAccess={revokeAccess}
        />
      )
    })
  )
}

const grantMutation = gql`
  mutation grantAccess($campaignId: ID!, $email: String!, $message: String) {
    grantAccess(campaignId: $campaignId, email: $email, message: $message) {
      email
      endAt
    }
  }
`

const revokeMutation = gql`
  mutation revokeAccess($id: ID!) {
    revokeAccess(id: $id)
  }
`

export default compose(
  graphql(grantMutation, {
    props: ({ mutate }) => ({
      grantAccess: variables =>
        mutate({
          variables,
          refetchQueries: [
            {
              query
            }
          ]
        })
    })
  }),
  graphql(revokeMutation, {
    props: ({ mutate }) => ({
      revokeAccess: variables =>
        mutate({
          variables,
          refetchQueries: [
            {
              query
            }
          ]
        })
    })
  }),
  graphql(query, {
    props: ({ data }) => ({
      loading: data.loading,
      accessCampaigns:
        (!data.loading && !data.error && data.me && data.me.accessCampaigns) ||
        []
    })
  })
)(Campaigns)
