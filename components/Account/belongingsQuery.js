import gql from 'graphql-tag'

export default gql`
query myBelongings {
  me {
    id
    accessToken(scope: CUSTOM_PLEDGE)
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
      user {
        id
      }
      pledge {
        id
        package {
          name
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
      granteeName
    }
    accessCampaigns {
      id
      title
      description
      grants {
        id
        email
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
      }
      options {
        templateId
        reward {
          ... on MembershipType {
            name
          }
          ... on Goodie {
            name
          }
        }
        minAmount
        maxAmount
        amount
        price
        membership {
          id
          user {
            id
            name
          }
          sequenceNumber
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
