import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Center, Editorial } from '@project-r/styleguide'
import Frame from '../components/Frame'
import MembershipSelector from '../components/Pledge/Checkout/MembershipSelector'

// objekt: 'ABO' | "BENEFACTOR" | "MONLY ABO" | "PROLONG" | "EDU" | "CUSTOM" | "ABO_GIVE" | "ABO_GIVE_MONTH",

const packageABO = {
  name: 'ABO',
  suggestedTotal: null,
  options: [
    {
      id: 1234,
      name: 'ABO',
      suggestions: [
        {
          price: 24000,
          label: 'Regulär',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
          userPrice: false
        },
        {
          price: 36000,
          label: 'Grosszügig',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und ermöglichen vergünstigte Mitgliedschaften.',
          userPrice: false
        },
        {
          price: 48000,
          label: 'Tollkühn',
          description:
            'Mit Ihrem Beitrag setzen Sie sich energisch für das Fortbestehen der Republik ein und ermöglichen vergünstigte Mitgliedschaften.',
          userPrice: false
        }
      ],
      reward: {
        __typename: 'MembershipType',
        name: 'ABO'
      }
    }
  ]
}

const packageBENEFACTOR = {
  name: 'BENEFACTOR',
  suggestedTotal: null,
  options: [
    {
      id: 1234,
      name: 'BENEFACTOR',
      suggestions: [
        {
          price: 100000,
          label: 'Gönner',
          description: 'Sie sind toll',
          userPrice: false
        },
        {
          price: 150000,
          label: 'Grosszügiger Gönner',
          description: 'Sie sind grosszügig und toll.',
          userPrice: false
        },
        {
          price: 200000,
          label: 'Tollkühner Gönner',
          description: 'Sie sind tollkühn und toll',
          userPrice: false
        }
      ]
    }
  ]
}

const packagePROLONG = {
  name: 'PROLONG',
  suggestedTotal: 32200,
  options: [
    {
      id: 1234,
      name: 'ABO',
      suggestions: [
        {
          price: 32200,
          label: 'Eigener Preis',
          description: 'Verlängern Sie um denselbern Beitrag wie letztes Jahr.',
          userPrice: true,
          favorite: true
        },
        {
          price: 24000,
          label: 'Regulär',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
          userPrice: false,
          favorite: false
        }
      ],
      reward: {
        __typename: 'MembershipType',
        name: 'ABO'
      }
    },
    {
      id: 5678,
      name: 'BENEFACTOR',
      suggestions: [
        {
          price: 100000,
          label: 'Gönner',
          description: 'Sie werden Gönner.',
          userPrice: false,
          favorite: false
        }
      ],
      reward: {
        __typename: 'MembershipType',
        name: 'ABO'
      }
    }
  ]
}

const packagePROLONG_BENEFACTOR = {
  name: 'PROLONG',
  suggestedTotal: null,
  options: [
    {
      id: 1234,
      name: 'ABO',
      suggestions: [
        {
          price: 24000,
          label: 'Regulär',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
          userPrice: false,
          favorite: false
        }
      ],
      reward: {
        __typename: 'MembershipType',
        name: 'ABO'
      }
    },
    {
      id: 5678,
      name: 'BENEFACTOR',
      suggestions: [
        {
          price: 100000,
          label: 'Gönner',
          description: 'Sie werden Gönner.',
          userPrice: false,
          favorite: true
        }
      ],
      reward: {
        __typename: 'MembershipType',
        name: 'ABO'
      }
    }
  ]
}

const packagePROLONG_EDU = {
  name: 'PROLONG',
  suggestedTotal: null,
  options: [
    {
      id: 1234,
      name: 'ABO',
      suggestions: [
        {
          price: 14000,
          label: 'Ausbildungs-Abo',
          description: 'Ausbildung Description',
          userPrice: false,
          favorite: true
        },
        {
          price: 24000,
          label: 'Regulär',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
          userPrice: false,
          favorite: false
        }
      ],
      reward: {
        __typename: 'MembershipType',
        name: 'ABO'
      }
    }
  ]
}

const PackageABO = ({ pkg }) => {
  return (
    <>
      <h2>Package ABO</h2>
      <MembershipSelector
        pkg={pkg}
        onSuggestionSelect={suggestion => {
          console.log(suggestion)
        }}
      />
      <Editorial.A>Gönner werden</Editorial.A>
    </>
  )
}

const PackageBENEFACTOR = () => {
  return (
    <>
      <h2>Package BENEFACTOR</h2>
      <MembershipSelector
        pkg={packageBENEFACTOR}
        onSuggestionSelect={suggestion => {
          console.log(suggestion)
        }}
      />
    </>
  )
}

const PackagePROLONG = () => {
  return (
    <>
      <h2>Package PROLONG ABO</h2>
      <MembershipSelector
        pkg={packagePROLONG}
        onSuggestionSelect={suggestion => {
          console.log(suggestion)
        }}
      />
    </>
  )
}

const PackagePROLONG_BENEFACTOR = () => {
  return (
    <>
      <h2>Package PROLONG BENEFACTOR</h2>
      <MembershipSelector
        pkg={packagePROLONG_BENEFACTOR}
        onSuggestionSelect={suggestion => {
          console.log(suggestion)
        }}
      />
    </>
  )
}

const PackagePROLONG_EDU = () => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(
    packagePROLONG_EDU.options[0].suggestions[0] || {}
  )
  const [userPrice, setuserPrice] = useState(null)
  return (
    <>
      <h2>Package PROLONG_EDU</h2>
      <MembershipSelector
        pkg={packagePROLONG_EDU}
        onSuggestionSelect={suggestion => {
          console.log(suggestion)
        }}
      />
    </>
  )
}

const GET_PACKAGES = gql`
  query getPackages {
    crowdfunding(name: "LAUNCH") {
      packages {
        name
        suggestedTotal
        options {
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

  return (
    <Frame raw>
      <Center>
        <PackageABO pkg={packages.find(pkg => pkg.name === 'BENEFACTOR')} />
        <br />
        <PackagePROLONG />
        <br />
        <PackageBENEFACTOR />
        <br />
        <PackagePROLONG_BENEFACTOR />
        <br />
        <PackagePROLONG_EDU />
      </Center>
    </Frame>
  )
}

export default Checkout
