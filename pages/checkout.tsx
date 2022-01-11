import React, { useState, useMemo } from 'react'
import compose from 'lodash/flowRight'
import withT from '../lib/withT'
import { gql, useQuery } from '@apollo/client'
import { Center, Editorial } from '@project-r/styleguide'
import Frame from '../components/Frame'
import MembershipOptions from '../components/Pledge/PledgeOptions/MembershipOptions'
import { PackageType } from '../components/Pledge/PledgeOptions/PledgeOptionsTypes'
import GoodieOptions from '../components/Pledge/PledgeOptions/GoodieOptions'
import GiftMembershipOptions from '../components/Pledge/PledgeOptions/GiftMembershipOptions'
import { truncate } from 'fs'

const GET_PACKAGES = gql`
  query getPackages {
    crowdfunding(name: "LAUNCH") {
      packages {
        name
        suggestedTotal
        options {
          optionGroup
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

const Checkout = ({ t }: { t: (any) => any }) => {
  const { loading, error, data } = useQuery(GET_PACKAGES)

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`
  const { packages }: { packages: PackageType[] } = data.crowdfunding

  const newPackages = packages.concat({
    name: 'PROLONG',
    suggestedTotal: 24000,
    options: [
      {
        optionGroup: 'A',
        minAmount: 1,
        maxAmount: 1,
        membership: {
          user: {
            isUserOfCurrentSession: true
          }
        },
        suggestions: [
          {
            price: 24000,
            label: 'Abo verlängern',
            description: 'Monatsabo verlängern',
            userPrice: false,
            favorite: true
          }
        ],
        reward: {
          __typename: 'MembershipType',
          name: 'ABO',
          minPeriods: 1,
          maxPeriods: 1,
          defaultPeriods: 1
        }
      },
      {
        optionGroup: 'A',
        minAmount: 1,
        maxAmount: 1,
        membership: {
          user: {
            isUserOfCurrentSession: true
          }
        },
        suggestions: [
          {
            price: 100000,
            label: 'Gönner werden',
            description: 'Gönner werden',
            userPrice: true,
            favorite: false
          }
        ],
        reward: {
          __typename: 'MembershipType',
          name: 'BENEFACTOR',
          minPeriods: 1,
          maxPeriods: 1,
          defaultPeriods: 1
        }
      },
      {
        optionGroup: 'B',
        minAmount: 1,
        maxAmount: 1,
        membership: {
          user: {
            isUserOfCurrentSession: false
          }
        },
        suggestions: [
          {
            price: 24000,
            label: 'Abo von Clara',
            description: 'Jahresabo von clara verlängern',
            userPrice: false,
            favorite: false
          }
        ],
        reward: {
          __typename: 'MembershipType',
          name: 'ABO',
          minPeriods: 1,
          maxPeriods: 1,
          defaultPeriods: 1
        }
      },
      {
        optionGroup: 'a0d7fc94-4641-4ba6-bd14-77f1207600ab',
        minAmount: 0,
        maxAmount: 1,
        defaultAmount: 1,
        membership: null,
        suggestions: [
          {
            id:
              'YTBkN2ZjOTQtNDY0MS00YmE2LWJkMTQtNzdmMTIwNzYwMGFiL3N1Z2dlc3Rpb24vMA==',
            price: 3900,
            label: 'Fondue',
            description: 'Ein dolles Fondue von dollen Menschen',
            userPrice: false,
            favorite: false
          }
        ],
        reward: {
          __typename: 'Goodie',
          name: 'FONDUE'
        }
      }
    ]
  })

  return (
    <Frame raw>
      <Center breakout={false}>
        {newPackages.map(pkg => (
          <PackageConfigurator t={t} key={pkg.name} pkg={pkg} />
        ))}
      </Center>
    </Frame>
  )
}

const PackageConfigurator = ({
  pkg,
  t
}: {
  pkg: PackageType
  t: (any) => any
}) => {
  const membershipOptions = useMemo(() => {
    return pkg.options.filter(
      option =>
        // No Goodies
        option.reward?.__typename !== 'Goodie' &&
        // No GiftMemberships
        (option.membership === null ||
          option.membership?.user?.isUserOfCurrentSession === true)
    )
  }, [pkg])

  const goodieOptions = useMemo(() => {
    return pkg.options.filter(option => option.reward?.__typename === 'Goodie')
  }, [pkg])

  const giftMembershipOptions = useMemo(() => {
    return pkg.options.filter(
      option =>
        // No Goodies
        option.reward?.__typename !== 'Goodie' &&
        // Only GiftMemberships
        option.membership !== null &&
        option.membership?.user?.isUserOfCurrentSession === false
    )
  }, [pkg])

  const values = {}

  return (
    <div style={{ marginBottom: 100 }}>
      <h2>Package {pkg.name}</h2>
      <MembershipOptions
        options={membershipOptions}
        onChange={options => console.log(options)}
      />
      <GoodieOptions
        options={goodieOptions}
        values={values}
        onChange={a => console.log(a)}
        t={t}
      />
      <GiftMembershipOptions options={giftMembershipOptions} t={t} />
    </div>
  )
}

export default compose(withT)(Checkout)
