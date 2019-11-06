import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const TRIAL_QUERY = gql`
  query getTrialEligibility {
    me {
      id
      activeMembership {
        id
        endDate
      }
      accessGrants {
        id
        endAt
      }
    }
  }
`

export const handleTrialEligibility = ({ data }) => {
  const hasActiveMembership = !!data.me && !!data.me.activeMembership
  const hasAccessGrant =
    !!data.me && !!data.me.accessGrants && data.me.accessGrants.length > 0

  const isTrialEligible = !hasActiveMembership && !hasAccessGrant

  const trialEligibility = {
    viaActiveMembership: {
      until: hasActiveMembership && data.me.activeMembership.endDate
    },
    viaAccessGrant: {
      until:
        hasAccessGrant &&
        data.me.accessGrants.reduce(
          (acc, grant) =>
            new Date(grant.endAt) > acc ? new Date(grant.endAt) : acc,
          new Date()
        )
    }
  }

  return { isTrialEligible, trialEligibility, trialRefetch: data.refetch }
}

export default graphql(TRIAL_QUERY, { props: handleTrialEligibility })
