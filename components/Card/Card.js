import React, { useState } from 'react'
import { css } from 'glamor'

import { Editorial, InfoBoxText, InfoBoxListItem } from '@project-r/styleguide'

import { chfFormat } from '../../lib/utils/format'

import Spider from './Spider'
import getPartyColor from './partyColors'

const styles = {
  centerContent: css({
    width: 300,
    margin: '0 auto',
    paddingTop: 50
  }),
  financialSlide: css({
    '& ul': {
      marginTop: 0
    }
  })
}

const Card = ({ payload, user }) => {
  const [slide, setSlide] = useState(0)

  const partyColor = getPartyColor(payload.party)
  const slides = [
    user.portrait && <div style={{
      height: '100%',
      backgroundImage: `url(${user.portrait})`,
      backgroundSize: 'cover'
    }} />,
    payload.smartvoteCleavage && <div {...styles.centerContent}>
      <InfoBoxText>
        <Spider
          width={300}
          height={300}
          fill={partyColor}
          data={payload.smartvoteCleavage} />
        <br /><br />
        <div style={{ textAlign: 'right' }}>
          <small>Quelle: Smartvote</small>
        </div>
      </InfoBoxText>
    </div>,
    <div {...styles.centerContent} {...styles.financialSlide}>
      <InfoBoxText>
        <strong>Wahlkampfbudget</strong>
        {payload.campaignBudget ? `: ${chfFormat(payload.campaignBudget)}` : <><br />Keine Angabe</>}
        {payload.campaignBudgetComment && <><br />{payload.campaignBudgetComment}<br /></>}
        <br />
        <strong>Interessenbindungen</strong>
        {payload.vestedInterestsSmartvote.length ? <Editorial.UL compact>
          {payload.vestedInterestsSmartvote.map((vestedInterest, i) =>
            <InfoBoxListItem key={i}>
              {vestedInterest.name}
              {vestedInterest.entity ? ` (${vestedInterest.entity})` : ''}
              {vestedInterest.position ? `; ${vestedInterest.position}` : ''}
            </InfoBoxListItem>
          )}
        </Editorial.UL> : <><br />Keine Angabe<br /></>}
        <small>Quelle: Smartvote</small>
      </InfoBoxText>
    </div>
  ].filter(Boolean)
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
          {payload.councilOfStates.candidacy && <strong>
            {payload.nationalCouncil.candidacy
              ? 'Stände- und Nationalratskandidatur'
              : 'Ständeratskandidatur'
            }
            <br />
          </strong>}
          {[
            payload.listPlaces && payload.listPlaces.length && `Listenplatz ${payload.listPlaces.join(', ')}`,
            payload.councilOfStates.candidacy
              ? payload.councilOfStates.incumbent
                ? 'bisher'
                : payload.nationalCouncil.incumbent ? 'bisher im Nationalrat' : 'neu'
              : payload.nationalCouncil.incumbent ? 'bisher' : 'neu'
          ].filter(Boolean).join(', ')}
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
