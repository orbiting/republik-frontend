import React, { useState } from 'react'
import { css } from 'glamor'

import {
  Interaction
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'

import Spider from './Spider'
import getPartyColor from './partyColors'
import InfoIcon from './InfoIcon'
import DiscussionIconLink from './DiscussionIconLink'

import { shouldIgnoreClick } from '../Link/utils'
import sharedStyles from '../sharedStyles'

import { SmallParagraph, Finance } from './Shared'

export const MEDIUM_MIN_WIDTH = 360

const PADDING = 15

export const styles = {
  card: css({
    position: 'absolute',
    width: '100vw',
    top: 20,
    bottom: 80,
    minHeight: 340,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  cardInner: css({
    position: 'relative',
    userSelect: 'none',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 12px 50px -10px rgba(0, 0, 0, 0.4), 0 10px 10px -10px rgba(0, 0, 0, 0.1)'
  }),
  bottomText: css({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: `5px ${PADDING}px`,
    backgroundColor: '#fff',
    fontSize: 14,
    lineHeight: '16px',
    [`@media (min-width: ${MEDIUM_MIN_WIDTH}px)`]: {
      padding: `10px ${PADDING}px`,
      fontSize: 16,
      lineHeight: '20px'
    }
  }),
  icons: css({
    zIndex: 1,
    position: 'absolute',
    top: -12,
    right: PADDING
  }),
  portrait: css({
    height: '100%',
    backgroundSize: 'cover'
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
    [`@media (min-width: ${MEDIUM_MIN_WIDTH}px)`]: {
      paddingTop: PADDING + 3
    }
  }),
  opacityHover: css({
    '@media(hover)': {
      '[href]:hover > *': {
        opacity: 0.8
      }
    }
  })
}

const Card = ({ payload, user, statement, group, dragTime, width, inNativeIOSApp, onDetail, t, mySmartspider, medianSmartspiderQuery, firstSlideOnly }) => {
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

  const { councilOfStates, nationalCouncil } = payload
  const innerWidth = width - PADDING * 2
  const textLines = 2 + !!payload.occupation + !!councilOfStates.candidacy

  const partyColor = getPartyColor(payload.party)
  const slides = [
    user.portrait && <div {...styles.portrait} style={{
      backgroundImage: `url(${user.portrait})`,
      height: `calc(100% - ${16 * textLines + 10}px)`
    }} />,
    payload.smartvoteCleavage && <div {...styles.centerContent} style={{ width: innerWidth }}>
      <SmallParagraph>
        <strong>{t('components/Card/Smartspider/title')}</strong><br />
        <small>
          {t('components/Card/Smartspider/legend')}
        </small>
      </SmallParagraph>
      <Spider
        size={innerWidth}
        fill={partyColor}
        data={payload.smartvoteCleavage}
        reference={mySmartspider} />
    </div>,
    <div {...styles.centerContent} style={{ width: innerWidth }}>
      <Finance payload={payload} />
    </div>
  ].filter(Boolean).slice(0, firstSlideOnly ? 1 : undefined)
  const totalSlides = slides.length

  const { listPlaces, electionPlausibility } = nationalCouncil
  const plausibilityEmoji = t(`components/Card/electionPlausibility/${electionPlausibility}/emoji`, undefined, '')

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
        <div {...styles.icons}>
          {!!statement && <>
            <Link route='cardGroup' params={{
              group: group.slug,
              suffix: 'diskussion',
              focus: statement.id,
              ...medianSmartspiderQuery
            }} passHref>
              <DiscussionIconLink
                style={{
                  marginLeft: 0,
                  verticalAlign: 'top',
                  marginTop: 1
                }}
                count={1 + statement.comments.totalCount} />
            </Link>
          </>}
          {!!onDetail && <a href={`/~${user.slug}`} onClick={(e) => {
            if (shouldIgnoreClick(e)) {
              return
            }
            e.preventDefault()
            onDetail()
          }} {...sharedStyles.plainButton} {...styles.opacityHover}>
            <InfoIcon size={30} fill='#000' />
          </a>}
        </div>
        <strong>
          {councilOfStates.candidacy && <>
            {t(`components/Card/candidacy/${nationalCouncil.candidacy ? 'sr_nr' : 'sr'}`)}
            <br />
          </>}
          {user.name}
        </strong>
        {!!(payload.age || payload.yearOfBirth) && <>
          {','}&nbsp;
          {payload.age || payload.yearOfBirth}
        </>}
        <br />
        <strong>
          {payload.party}
          {','}&nbsp;
          {
            councilOfStates.candidacy
              ? councilOfStates.elected
                ? nationalCouncil.candidacy
                  ? t(`components/Card/${councilOfStates.incumbent ? 're' : ''}elected/sr`)
                  : t(`components/Card/${councilOfStates.incumbent ? 're' : ''}elected`)
                : councilOfStates.incumbent
                  ? t('components/Card/incumbent')
                  : nationalCouncil.incumbent
                    ? t('components/Card/incumbent/nr')
                    : t('components/Card/incumbent/new')
              : nationalCouncil.elected
                ? councilOfStates.candidacy
                  ? t(`components/Card/${nationalCouncil.incumbent ? 're' : ''}elected/nr`)
                  : t(`components/Card/${nationalCouncil.incumbent ? 're' : ''}elected`)
                : nationalCouncil.incumbent
                  ? t('components/Card/incumbent')
                  : t('components/Card/incumbent/new')
          }
        </strong>
        {listPlaces && !!listPlaces.length && <>
          {`, ${t('components/Card/listPlaces').trim()}${'\u00a0'}${listPlaces.join(' & ')}`}
          {!!plausibilityEmoji && `${'\u00a0'}${plausibilityEmoji}`}
        </>}
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
          if (dragTime && dragTime.current > 100) {
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
          if (dragTime && dragTime.current > 100) {
            return
          }
          gotoSlide(Math.min(totalSlides - 1, slide + 1))
        }}
      />
    </div>
  )
}

export default withInNativeApp(Card)
