import React, { useState } from 'react'

import Spider from './Spider'
import getPartyColor from './partyColors'

const Card = ({ payload, user }) => {
  const [slide, setSlide] = useState(0)

  const partyColor = getPartyColor(payload.party)
  const slides = [
    user.portrait && <div style={{
      height: '100%',
      backgroundImage: `url(${user.portrait})`,
      backgroundSize: 'cover'
    }} />,
    payload.smartvoteCleavage && <div style={{ width: 300, margin: '0 auto', paddingTop: 50 }}>
      <Spider
        width={300}
        height={300}
        fill={partyColor}
        data={payload.smartvoteCleavage} />
    </div>
  ].filter(Boolean)
  if (!slides.length) {
    slides.push(<div style={{ textAlign: 'center', paddingTop: 100 }}>Nüt</div>)
  }
  const totalSlides = slides.length

  return (
    <div
      style={{
        height: '100%',
        borderBottom: `10px solid ${partyColor}`,
        position: 'relative'
      }}>
      {slides[slide]}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 15px', backgroundColor: '#fff' }}>
        <div style={{ position: 'absolute', top: -30, left: 0, right: 0, textAlign: 'center' }}>
          {slides.map((_, i) => (
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
          {[
            payload.occupation,
            `geboren ${payload.yearOfBirth}`
          ].filter(Boolean).join(', ')}
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
          setSlide(Math.min(totalSlides - 1, slide + 1))
        }}
      />
    </div>
  )
}

export default Card
