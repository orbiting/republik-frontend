import gql from 'graphql-tag'

export default gql`
  query myBelongings {
    me {
      id
      memberships {
        id
        accessGranted
        claimerName
        voucherCode
        createdAt
        sequenceNumber
        renew
        active
        overdue
        autoPay
        autoPayIsMutable
        canProlong
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
          accessGranted
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
          reference(pretty: true)
          paymentslipUrl
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
