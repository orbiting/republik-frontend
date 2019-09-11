import React, { useState } from 'react'
import { css } from 'glamor'

import {
  Interaction
} from '@project-r/styleguide'

import { chfFormat } from '../../lib/utils/format'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'

import Spider from './Spider'
import getPartyColor from './partyColors'

const PADDING = 15

const styles = {
  bottomText: css({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: `5px ${PADDING}px`,
    backgroundColor: '#fff',
    fontSize: 14,
    lineHeight: '16px',
    '@media (min-width: 340px)': {
      padding: `10px ${PADDING}px`,
      fontSize: 16,
      lineHeight: '20px'
    }
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
    margin: '0 auto',
    paddingTop: PADDING - 2,
    '@media (min-width: 340px)': {
      paddingTop: PADDING + 3
    }
  }),
  p: css(Interaction.fontRule, {
    margin: '0 0 5px',
    fontSize: 15,
    lineHeight: '22px',
    '& small': {
      display: 'block',
      fontSize: 10,
      lineHeight: '16px'
    }
  }),
  ul: css({
    margin: 0,
    marginTop: -3,
    paddingLeft: 20,
    fontSize: 15,
    lineHeight: '22px'
  })
}

const Paragraph = ({ children }) => <p {...styles.p}>{children}</p>
const UL = ({ children }) => <ul {...styles.ul}>{children}</ul>

const Card = ({ payload, user, dragTime, width, inNativeIOSApp }) => {
  const [slide, setSlide] = useState(0)

  const gotoSlide = nextSlide => {
    if (nextSlide !== slide) {
      setSlide(nextSlide)
    }
    if (inNativeIOSApp) {
      postMessage({
        type: 'haptic',
        payload: {
          type: nextSlide !== slide ? 'impactLight' : 'impactHeavy'
        }
      })
    }
  }

  const innerWidth = width - PADDING * 2

  const partyColor = getPartyColor(payload.party)
  const slides = [
    user.portrait && <div style={{
      height: '100%',
      backgroundImage: `url(${user.portrait})`,
      backgroundSize: 'cover'
    }} />,
    payload.smartvoteCleavage && <div {...styles.centerContent} style={{ width: innerWidth }}>
      <Paragraph>
        <strong>Wertehaltungen</strong><br />
        <small {...styles.small}>
          Von 0 – keine bis 100 – starke Zustimmung.
        </small>
      </Paragraph>
      <Spider
        size={innerWidth}
        fill={partyColor}
        data={payload.smartvoteCleavage} />
    </div>,
    <div {...styles.centerContent} style={{ width: innerWidth }}>
      <Paragraph>
        <strong>Wahlkampfbudget</strong>
        {payload.campaignBudget
          ? `: ${chfFormat(payload.campaignBudget)}`
          : !payload.campaignBudgetComment && <><br />Keine Angaben</>}
        {payload.campaignBudgetComment && <><br />{payload.campaignBudgetComment}<br /></>}
        <br />
        <strong>Interessenbindungen</strong>
        {!payload.vestedInterestsSmartvote.length && <><br />Keine Angaben</>}
      </Paragraph>
      {!!payload.vestedInterestsSmartvote.length && <UL>
        {payload.vestedInterestsSmartvote.map((vestedInterest, i) =>
          <li key={i}>
            {vestedInterest.name}
            {vestedInterest.entity ? ` (${vestedInterest.entity})` : ''}
            {vestedInterest.position ? `; ${vestedInterest.position}` : ''}
          </li>
        )}
      </UL>}
      <Paragraph>
        <small {...styles.small} style={{ marginTop: 10 }}>Quelle: Smartvote</small>
      </Paragraph>
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
      {totalSlides > 1 && <div style={{
        position: 'absolute',
        top: 8,
        left: 10,
        right: 10
      }}>
        {slides.map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * 100 / totalSlides + 1}%`,
              width: `${100 / totalSlides - 2}%`,
              height: 3,
              borderRadius: 1,
              backgroundColor: i === slide ? '#fff' : 'rgba(0, 0, 0, 0.2)'
            }}
          />
        ))}
      </div>}
      <div {...styles.bottomText} {...Interaction.fontRule}>
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
          if (dragTime.current > 100) {
            return
          }
          gotoSlide(Math.max(0, slide - 1))
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
          if (dragTime.current > 100) {
            return
          }
          gotoSlide(Math.min(totalSlides - 1, slide + 1))
        }}
      />
    </div>
  )
}

export default withInNativeApp(Card)
