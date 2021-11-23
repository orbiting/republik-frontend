import React, { useState } from 'react'
import Link from 'next/link'
import { Center, Editorial, Interaction } from '@project-r/styleguide'
import Frame from '../components/Frame'
import MembershipSelector from '../components/Pledge/Checkout/MembershipSelector'
import GiftMembershipSelector from '../components/Pledge/Checkout/GiftMembershipSelector'

const options = [
  {
    label: 'Regulär',
    price: 24000,
    userPrice: true,
    minUserPrice: 1,
    suggestedPrice: 25000,
    reward: {
      __typename: 'MembershipType',
      name: 'ABO'
    }
  },
  {
    id: '123123-123123-123123',
    label: 'Grosszügige',
    price: 48000,
    reward: {
      __typename: 'MembershipType',
      name: 'ABO'
    }
  },
  {
    id: '123123-123123-123123',
    label: 'Gönner',
    price: 100000,
    reward: {
      __typename: 'MembershipType',
      name: 'BENEFACOTR'
    }
  }
]

const Checkout = () => {
  const [selectedMembershipOption, setSelectedMembershipOption] = useState({})
  const [ownPrice, setOwnPrice] = useState(null)

  return (
    <Frame raw>
      <Center>
        <Link passhref href='/'>
          <Editorial.A>Zum gesammten Angebot</Editorial.A>
        </Link>
        <Interaction.H2>Jahresmitgliedschaft kaufen</Interaction.H2>
        <p>
          Mit einer Jahresmitgliedschaft werden Sie Teil der Project R
          Genossenschaft.
        </p>
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
        <GiftMembershipSelector />
        {/* <GoodieSelector />
        // 
        <PaymentSelector  /> */}
      </Center>
    </Frame>
  )
}

export default Checkout
