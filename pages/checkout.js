import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Center, Editorial, Interaction } from '@project-r/styleguide'
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
      variants: [
        {
          price: 24000,
          label: 'Regulär',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
          ownPrice: false
        },
        {
          price: 36000,
          label: 'Grosszügig',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und ermöglichen vergünstigte Mitgliedschaften.',
          ownPrice: false
        },
        {
          price: 48000,
          label: 'Tollkühn',
          description:
            'Mit Ihrem Beitrag setzen Sie sich energisch für das Fortbestehen der Republik ein und ermöglichen vergünstigte Mitgliedschaften.',
          ownPrice: false
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
      variants: [
        {
          price: 100000,
          label: 'Gönner',
          description: 'Sie sind toll',
          ownPrice: false
        },
        {
          price: 150000,
          label: 'Grosszügiger Gönner',
          description: 'Sie sind grosszügig und toll.',
          ownPrice: false
        },
        {
          price: 200000,
          label: 'Tollkühner Gönner',
          description: 'Sie sind tollkühn und toll',
          ownPrice: false
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
      variants: [
        {
          price: 32200,
          label: 'Eigener Preis',
          description: 'Verlängern Sie um denselbern Beitrag wie letztes Jahr.',
          ownPrice: true,
          suggested: true
        },
        {
          price: 24000,
          label: 'Regulär',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
          ownPrice: false,
          suggested: false
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
      variants: [
        {
          price: 100000,
          label: 'Gönner',
          description: 'Sie werden Gönner.',
          ownPrice: false,
          suggested: false
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
      variants: [
        {
          price: 24000,
          label: 'Regulär',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
          ownPrice: false,
          suggested: false
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
      variants: [
        {
          price: 100000,
          label: 'Gönner',
          description: 'Sie werden Gönner.',
          ownPrice: false,
          suggested: true
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
      variants: [
        {
          price: 14000,
          label: 'Ausbildungs-Abo',
          description: 'Ausbildung Description',
          ownPrice: false,
          suggested: true
        },
        {
          price: 24000,
          label: 'Regulär',
          description:
            'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
          ownPrice: false,
          suggested: false
        }
      ],
      reward: {
        __typename: 'MembershipType',
        name: 'ABO'
      }
    }
  ]
}

const PackageABO = () => {
  const [selectedVariant, setSelectedVariant] = useState(
    packageABO.options[0].variants[0] || {}
  )
  const [ownPrice, setOwnPrice] = useState(null)
  return (
    <>
      <h2>Package ABO</h2>
      <MembershipSelector
        pkg={packageABO}
        onVariantSelect={variant => {
          setSelectedVariant(variant)
        }}
        onOwnPriceSelect={ownPrice => {
          setOwnPrice(ownPrice)
        }}
        selectedVariant={selectedVariant}
      />
      <Editorial.A>Gönner werden</Editorial.A>
    </>
  )
}

const PackageBENEFACTOR = () => {
  const [selectedVariant, setSelectedVariant] = useState(
    packageBENEFACTOR.options[0].variants[0] || {}
  )
  const [ownPrice, setOwnPrice] = useState(null)

  return (
    <>
      <h2>Package BENEFACTOR</h2>
      <MembershipSelector
        pkg={packageBENEFACTOR}
        onVariantSelect={variant => {
          setSelectedVariant(variant)
        }}
        onOwnPriceSelect={ownPrice => {
          setOwnPrice(ownPrice)
        }}
        selectedVariant={selectedVariant}
      />
    </>
  )
}

const PackagePROLONG = () => {
  const variants = useMemo(() => {
    const options = []
    packagePROLONG.options.forEach(option => options.push(...option.variants))
    return options
  }, [packagePROLONG])

  const selected = variants.find(v => v.suggested === true)

  const [selectedVariant, setSelectedVariant] = useState(
    selected || packagePROLONG.options[0].variants[0] || {}
  )
  const [ownPrice, setOwnPrice] = useState(null)
  return (
    <>
      <h2>Package PROLONG ABO</h2>
      <MembershipSelector
        pkg={packagePROLONG}
        onVariantSelect={variant => {
          setSelectedVariant(variant)
        }}
        onOwnPriceSelect={ownPrice => {
          setOwnPrice(ownPrice)
        }}
        selectedVariant={selectedVariant}
      />
    </>
  )
}

const PackagePROLONG_BENEFACTOR = () => {
  const [selectedVariant, setSelectedVariant] = useState(
    packagePROLONG_BENEFACTOR.options[1].variants[0] || {}
  )
  const [ownPrice, setOwnPrice] = useState(null)
  return (
    <>
      <h2>Package PROLONG BENEFACTOR</h2>
      <MembershipSelector
        pkg={packagePROLONG_BENEFACTOR}
        onVariantSelect={variant => {
          setSelectedVariant(variant)
        }}
        onOwnPriceSelect={ownPrice => {
          setOwnPrice(ownPrice)
        }}
        selectedVariant={selectedVariant}
      />
    </>
  )
}

const PackagePROLONG_EDU = () => {
  const [selectedVariant, setSelectedVariant] = useState(
    packagePROLONG_EDU.options[0].variants[0] || {}
  )
  const [ownPrice, setOwnPrice] = useState(null)
  return (
    <>
      <h2>Package PROLONG_EDU</h2>
      <MembershipSelector
        pkg={packagePROLONG_EDU}
        onVariantSelect={variant => {
          setSelectedVariant(variant)
        }}
        onOwnPriceSelect={ownPrice => {
          setOwnPrice(ownPrice)
        }}
        selectedVariant={selectedVariant}
      />
    </>
  )
}

const Checkout = () => {
  return (
    <Frame raw>
      <Center>
        <PackageABO />
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
