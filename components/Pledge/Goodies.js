import React from 'react'
import Goodie from './Goodie'

function Goodies({ goodies }) {
  return (
    <>
      {goodies.map(goodie => (
        <Goodie key={goodie.name} goodie={goodie} />
      ))}
    </>
  )
}

export default Goodies
