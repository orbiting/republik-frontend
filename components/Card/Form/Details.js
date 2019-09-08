import React from 'react'

import { Interaction } from '@project-r/styleguide'

const { H2, H3, P } = Interaction

const Details = (props) => {
  const { card, user } = props

  const {
    party,
    councilOfStates,
    nationalCouncil,
    occupation,
    yearOfBirth
  } = card.payload

  const {
    listName,
    listPlaces,
    listNumbers
  } = nationalCouncil

  return (
    <>
      <H2>{user.name}, {party}</H2>
      <P>{occupation}, geboren {yearOfBirth}</P>
      {nationalCouncil.candidacy && (
        <>
          <H3>Nationalratskandidatur</H3>
          <P>Liste: «{listName}»</P>
          <P>Listenplätze: {
            listNumbers.length > 0
              ? listNumbers.join(', ')
              : listPlaces.join(', ')
          }</P>
        </>
      )}
      {councilOfStates.candidacy && (
        <>
          <H3>Ständeratskandidatur</H3>
        </>
      )}
    </>
  )
}

export default Details
