import React, { useState } from 'react'
import Link from 'next/link'
import { Center, Editorial, Interaction } from '@project-r/styleguide'
import Frame from '../components/Frame'
import MembershipSelector from '../components/Pledge/Checkout/MembershipSelector'
import GiftMembershipSelector from '../components/Pledge/Checkout/GiftMembershipSelector'
import GoodieSelector from '../components/Pledge/Checkout/GoodieSelector'

const options = [
  {
    label: 'Eigener Preis',
    description:
      'Journalismus kostet. Was ist er Ihnen wert? Wählen Sie einen Preis, der Ihnen gerecht scheint.',
    price: 24000,
    userPrice: true,
    minUserPrice: 1,
    suggestedPrice: 24000,
    reward: {
      __typename: 'MembershipType',
      name: 'ABO'
    }
  },
  {
    id: '123123-123123-123123',
    label: 'Regulär',
    description:
      'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
    price: 24000,
    reward: {
      __typename: 'MembershipType',
      name: 'ABO'
    }
  }
]

const options2 = [
  {
    id: '123123-123123-123123',
    label: 'Regulär',
    description:
      'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
    price: 24000,
    reward: {
      __typename: 'MembershipType',
      name: 'ABO'
    }
  },
  {
    id: '123123-123123-123123',
    label: 'Grosszügig',
    description:
      'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und ermöglichen vergünstigte Mitgliedschaften.',
    price: 36000,
    reward: {
      __typename: 'MembershipType',
      name: 'ABO'
    }
  },
  {
    id: '123123-123123-123123',
    label: 'Tollkühn',
    description:
      'Mit Ihrem Beitrag setzen Sie sich energisch für das Fortbestehen der Republik ein und ermöglichen vergünstigte Mitgliedschaften.',
    price: 48000,
    reward: {
      __typename: 'MembershipType',
      name: 'ABO'
    }
  }
]

const options3 = [
  {
    label: 'Ausbildungs-Mitgliedschaft',
    description:
      'Journalismus kostet. Was ist er Ihnen wert? Wählen Sie einen Preis, der Ihnen gerecht scheint.',
    price: 24000,
    userPrice: true,
    minUserPrice: 1,
    suggestedPrice: 14000,
    reward: {
      __typename: 'MembershipType',
      name: 'ABO'
    }
  },
  {
    id: '123123-123123-123123',
    label: 'Regulär',
    description:
      'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
    price: 24000,
    reward: {
      __typename: 'MembershipType',
      name: 'ABO'
    }
  }
]

const options4 = [
  {
    label: 'Gönner',
    description:
      'Mit Ihrem Beitrag setzen sie sich energisch dafür ein, dass die Republik existiert. Um uns für Ihre Unterstützung zu revanchieren, schicken wir Ihnen das Start-up-Verleger-Paket zu.',
    price: 100000,
    minUserPrice: 1,
    reward: {
      __typename: 'MembershipType',
      name: 'BENEFACTOR'
    }
  },
  {
    label: 'Grosszügige Gönner',
    description:
      'Mit Ihrem Beitrag setzen sie sich energisch dafür ein, dass die Republik existiert. Um uns für Ihre Unterstützung zu revanchieren, schicken wir Ihnen das Start-up-Verleger-Paket zu.',
    price: 150000,
    minUserPrice: 1,
    reward: {
      __typename: 'MembershipType',
      name: 'BENEFACTOR'
    }
  },
  {
    label: 'Tollküne Gönner',
    description:
      'Mit Ihrem Beitrag setzen sie sich energisch dafür ein, dass die Republik existiert. Um uns für Ihre Unterstützung zu revanchieren, schicken wir Ihnen das Start-up-Verleger-Paket zu.',
    price: 200000,
    minUserPrice: 1,
    reward: {
      __typename: 'MembershipType',
      name: 'BENEFACTOR'
    }
  }
]

const options5 = [
  {
    label: 'Monats-Abo',
    description:
      'Mit Ihrem Beitrag garantieren Sie das Fortbestehen der Republik und des unabhängigen Journalismus.',
    price: 2200,
    minUserPrice: 1,
    reward: {
      __typename: 'MembershipType',
      name: 'MONATS-ABO'
    }
  }
]

const Checkout = () => {
  const [selectedMembershipOption, setSelectedMembershipOption] = useState(
    options[0] || {}
  )
  const [ownPrice, setOwnPrice] = useState(null)

  return (
    <Frame raw>
      <Center>
        {/* <Link passhref href='/'>
          <Editorial.A>Zum gesammten Angebot</Editorial.A>
        </Link>
        <Interaction.H2>Jahresmitgliedschaft kaufen</Interaction.H2>
        <p>
          Mit einer Jahresmitgliedschaft werden Sie Teil der Project R
          Genossenschaft.
        </p> */}
        <MembershipSelector
          membershipOptions={options}
          onMembershipSelect={option => {
            setSelectedMembershipOption(option)
          }}
          onOwnPriceSelect={ownPrice => {
            setOwnPrice(ownPrice)
          }}
          selectedMembershipOption={selectedMembershipOption}
        />
        {/* <MembershipSelector
          membershipOptions={options2}
          onMembershipSelect={option => {
            setSelectedMembershipOption(option)
          }}
          onOwnPriceSelect={ownPrice => {
            setOwnPrice(ownPrice)
          }}
          selectedMembershipOption={selectedMembershipOption}
        />
        <MembershipSelector
          membershipOptions={options3}
          onMembershipSelect={option => {
            setSelectedMembershipOption(option)
          }}
          onOwnPriceSelect={ownPrice => {
            setOwnPrice(ownPrice)
          }}
          selectedMembershipOption={selectedMembershipOption}
        />
        <MembershipSelector
          membershipOptions={options4}
          onMembershipSelect={option => {
            setSelectedMembershipOption(option)
          }}
          onOwnPriceSelect={ownPrice => {
            setOwnPrice(ownPrice)
          }}
          selectedMembershipOption={selectedMembershipOption}
        />
        <MembershipSelector
          membershipOptions={options5}
          onMembershipSelect={option => {
            setSelectedMembershipOption(option)
          }}
          onOwnPriceSelect={ownPrice => {
            setOwnPrice(ownPrice)
          }}
          selectedMembershipOption={selectedMembershipOption}
        /> */}
        {/* Gönner Upsell, should only be visible if regular options */}
        {/* <Link passHref href='/'>
          <Editorial.A>Gönner werden</Editorial.A>
        </Link>
        */}
        <GiftMembershipSelector />
        <GoodieSelector />
        {/* 
        // 
        <PaymentSelector  /> */}
      </Center>
    </Frame>
  )
}

export default Checkout
