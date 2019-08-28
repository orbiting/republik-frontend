import React, { useState } from 'react'

import Spider from './Spider'
import getPartyColor from './partyColors'

const Card = ({ payload, user }) => {
  const [slide, setSlide] = useState(0)
  const slides = 2

  const partyColor = getPartyColor(payload.party)

  return (
    <div
      style={{
        height: '100%',
        borderBottom: `10px solid ${partyColor}`,
        position: 'relative'
      }}>
      {user.portrait && <img
        src={user.portrait}
        alt=''
        style={{
          width: '100%',
          marginTop: '3%',
          padding: 20
        }}
      />}
      {payload.smartvoteCleavage && <Spider
        width={400}
        height={400}
        fill={partyColor}
        data={payload.smartvoteCleavage} />}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 15px', backgroundColor: '#fff' }}>
        <div style={{ position: 'absolute', top: -30, left: 0, right: 0, textAlign: 'center' }}>
          {Array.from({ length: slides }).map((_, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                margin: 5,
                borderRadius: '50%',
                backgroundColor: i === slide ? '#fff' : 'rgba(255, 255, 255, 0.6)'
              }}
            />
          ))}
        </div>
        <strong>
          {user.name}, {payload.party}
        </strong>
        <br />
        {slide === 0 && <>
          Listenplatz {payload.listNumber} mit Chance, neu
          <br />
          {payload.occupation}, geboren {payload.yearOfBirth}
        </>}
        {slide === 1 && <>
          Statement<br />
          Lange etc.
        </>}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          top: 0,
          left: 0,
          width: '50%'
        }}
        onClick={() => {
          setSlide(Math.max(0, slide - 1))
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          top: 0,
          right: 0,
          width: '50%'
        }}
        onClick={() => {
          setSlide(Math.min(slides - 1, slide + 1))
        }}
      />
    </div>
  )
}

export default Card
