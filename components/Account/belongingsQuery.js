import gql from 'graphql-tag'

export default gql`
  query myBelongings {
    me {
      id
      customPackages {
        id
        name
        options {
          id
          membership {
            id
          }
        }
      }
      memberships {
        id
        claimerName
        voucherCode
        createdAt
        sequenceNumber
        renew
        active
        overdue
        autoPay
        user {
          id
        }
        pledge {
          id
          package {
            name
            group
          }
          options {
            price
            reward {
              ... on MembershipType {
                name
              }
            }
          }
        }
        periods {
          beginDate
          endDate
        }
        type {
          name
        }
      }
      accessGrants {
        endAt
        campaign {
          title
          description
        }
      }
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
      }
      pledges {
        id
        package {
          name
          group
          company {
            id
            name
          }
        }
        options {
          templateId
          reward {
            ... on MembershipType {
              name
              interval
            }
            ... on Goodie {
              name
            }
          }
          minAmount
          maxAmount
          amount
          periods
          price
          membership {
            id
            user {
              id
              name
            }
            sequenceNumber
          }
          additionalPeriods {
            endDate
          }
        }
        status
        total
        donation
        payments {
          method
          paperInvoice
          total
          status
          hrid
          createdAt
          updatedAt
        }
        memberships {
          id
          claimerName
          voucherCode
          createdAt
          sequenceNumber
          type {
            name
          }
        }
        createdAt
      }
    }
  }
`
