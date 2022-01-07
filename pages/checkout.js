import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Center, Editorial } from '@project-r/styleguide'
import Frame from '../components/Frame'
import MembershipSelector from '../components/Pledge/PledgeOptions/MembershipOptions'

const GET_PACKAGES = gql`
  query getPackages {
    crowdfunding(name: "LAUNCH") {
      packages {
        name
        suggestedTotal
        options {
          minAmount
          maxAmount
          defaultAmount
          membership {
            user {
              isUserOfCurrentSession
            }
          }
          suggestions {
            id
            price
            label
            description
            userPrice
            favorite
          }
          reward {
            __typename
            ... on Goodie {
              name
            }
            ... on MembershipType {
              name
              minPeriods
              maxPeriods
              defaultPeriods
            }
          }
        }
      }
    }
  }
`

const Checkout = () => {
  const { loading, error, data } = useQuery(GET_PACKAGES)

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`
  const { packages } = data.crowdfunding

  // hier gruppieren: membershipOptions, goodieOptions, giftMembershipOptions
  // <MemebershipSelector onChange={(option, price, ) => } />
  // hier onChange FieldSet.reset
  // let fields = FieldSet.utils.fieldsState({
  //   field: fieldKey,
  //   value: parsedValue,
  //   error,
  //   dirty: shouldValidate
  // })
  // if (group) {
  //   // unselect all other options from group
  //   options
  //     .filter(other => other !== option)
  //     .forEach(other => {
  //       fields = FieldSet.utils.mergeField({
  //         field: getOptionFieldKey(other),
  //         value: 0,
  //         error: undefined,
  //         dirty: false
  //       })(fields)
  //     })
  // }

  return (
    <Frame raw>
      <Center>
        {packages.map(pkg => (
          <>
            <h2>Package {pkg.name}</h2>
            <MembershipSelector
              key={pkg.name}
              pkg={pkg}
              onSuggestionSelect={suggestion => console.log(suggestion)}
            />
            {/* <GoodieSelector />
            <GiftMembershipSelector /> */}
          </>
        ))}
      </Center>
    </Frame>
  )
}

export default Checkout
