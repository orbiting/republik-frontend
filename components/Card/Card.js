import React, { useState } from 'react'
import { css } from 'glamor'

import {
  Interaction, Editorial,
  InfoBoxText, InfoBoxListItem
} from '@project-r/styleguide'

import { chfFormat } from '../../lib/utils/format'

import Spider from './Spider'
import getPartyColor from './partyColors'

const styles = {
  bottomText: css({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '10px 15px',
    backgroundColor: '#fff',
    fontSize: 16,
    lineHeight: '20px'
  }),
  occupation: css({
    display: 'block',
    maxHeight: 40,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }),
  centerContent: css({
    width: 280,
    margin: '0 auto'
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
          size={280}
          fill={partyColor}
          data={payload.smartvoteCleavage} />
        <br />
        <span style={{ display: 'block', textAlign: 'right' }}>
          <small>Quelle: Smartvote</small>
        </span>
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

  const { listPlaces } = payload.nationalCouncil

  return (
    <div
      style={{
        height: '100%',
        backgroundColor: '#f3f3f3',
        borderBottom: `10px solid ${partyColor}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
      {slides[slide]}
      <div {...styles.bottomText} {...Interaction.fontRule}>
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
          {payload.councilOfStates.candidacy && <>
            {payload.nationalCouncil.candidacy
              ? 'Stände- und Nationalratskandidatur'
              : 'Ständeratskandidatur'
            }
            <br />
          </>}
          {user.name}
        </strong>
        &nbsp;
        {payload.age || payload.yearOfBirth}
        <br />
        <strong>
          {payload.party}
          {','}&nbsp;
          {
            payload.councilOfStates.candidacy
              ? payload.councilOfStates.incumbent
                ? 'bisher'
                : payload.nationalCouncil.incumbent ? 'bisher im Nationalrat' : 'neu'
              : payload.nationalCouncil.incumbent ? 'bisher' : 'neu'
          }
        </strong>
        {' '}
        {listPlaces && !!listPlaces.length && `Listenplatz: ${listPlaces.join(' & ')}`}
        <br />
        <span {...styles.occupation}>
          {payload.occupation}
        </span>
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
