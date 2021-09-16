import React from 'react'
import compose from 'lodash/flowRight'
import gql from 'graphql-tag'
import { graphql } from '@apollo/client/react/hoc'

import Campaign from './Campaign'
import Loader from '../../Loader'

import { Interaction } from '@project-r/styleguide'
import withT from '../../../lib/withT'

const query = gql`
  query accessCampaigns {
    me {
      id
      accessCampaigns {
        id
        title
        description
        grants {
          id
          email
          voucherCode
          beginBefore
          beginAt
          endAt
        }
        slots {
          total
          used
          free
        }
        perks {
          giftableMemberships
        }
      }
    }
  }
`

const Campaigns = ({ t, data, grantAccess, revokeAccess }) => {
  return (
    <>
      <Interaction.H1 style={{ marginBottom: 60 }}>
        {t('Account/Access/Page/title')}
      </Interaction.H1>
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          if (!data.me) {
            return null
          }
          return (
            <>
              {data.me.accessCampaigns.map((campaign, key) => (
                <Campaign
                  key={`campaign-${key}`}
                  campaign={campaign}
                  grantAccess={grantAccess}
                  revokeAccess={revokeAccess}
                />
              ))}
            </>
          )
        }}
      />
    </>
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
  withT,
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
      data
    })
  })
)(Campaigns)
