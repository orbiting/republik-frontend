import gql from 'graphql-tag'

export default gql`
query myBelongings {
  me {
    id
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
