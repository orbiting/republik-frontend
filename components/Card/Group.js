import React, { useState, useRef } from 'react'
import { css } from 'glamor'
import { useSpring, animated, interpolate } from 'react-spring/web.cjs'
import { useGesture } from 'react-use-gesture/dist/index.js'
import { compose } from 'react-apollo'

import IgnoreIcon from 'react-icons/lib/md/notifications-off'
import FollowIcon from 'react-icons/lib/md/notifications-active'
import RevertIcon from 'react-icons/lib/md/settings-backup-restore'
import OverviewIcon from 'react-icons/lib/md/list'

import withT from '../../lib/withT'
import { useWindowWidth } from '../../lib/hooks/useWindowWidth'
import { HEADER_HEIGHT, NAVBAR_HEIGHT } from '../constants'

import Card from './Card'

const styles = {
  container: css({
    position: 'relative',
    background: '#add8e666',
    overflow: 'hidden',
    // overscrollBehaviorY: 'contain',
    width: '100%',
    height: `calc(100vh - ${HEADER_HEIGHT + NAVBAR_HEIGHT}px)`
  }),
  card: css({
    position: 'absolute',
    width: '100vw',
    height: '80vh',
    minHeight: 480,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  cardInner: css({
    userSelect: 'none',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 12px 50px -10px rgba(0, 0, 0, 0.4), 0 10px 10px -10px rgba(0, 0, 0, 0.1)'
  }),
  button: css({
    display: 'inline-block',
    width: 55,
    height: 55,
    borderRadius: '50%',
    margin: 20,
    padding: 15,
    lineHeight: 0,
    verticalAlign: 'middle',
    boxShadow: '0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3)'
  }),
  buttonPanel: css({
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: 100,
    textAlign: 'center'
  })
}

const randDegs = 5
const to = () => ({
  x: 0, y: -5 + Math.random() * 10, scale: 1, rot: -randDegs + Math.random() * randDegs * 2, opacity: 1
})
const fromFall = () => ({
  x: 0, rot: 0, scale: 1.5, y: -1200, opacity: 1
})

const interpolateTransform = (r, s) => `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const SpringCard = ({
  i, zIndex, card, bindGestures, cardWidth,
  fallIn,
  isTop, isHot,
  dragTime
}) => {
  const [props, set] = useSpring(() => fallIn
    ? { ...to(), delay: i * 100, from: fromFall() }
    : { ...to(), from: { opacity: 0 } }
  )
  const { x, y, rot, scale, opacity } = props
  if (isTop) {
    set({
      scale: 1.05, rot: 0
    })
  }

  const willChange = isHot ? 'transform' : undefined

  return (
    <animated.div {...styles.card} style={{
      transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
      zIndex: zIndex,
      willChange
    }}>
      <animated.div
        {...bindGestures(set, card, isTop)}
        {...styles.cardInner}
        style={{
          width: cardWidth,
          height: cardWidth * 1.45,
          opacity,
          transform: interpolate([rot, scale], interpolateTransform),
          willChange
        }}
      >
        {card && <Card key={card.id} {...card} dragTime={dragTime} />}
      </animated.div>
    </animated.div>
  )
}

const nNew = 5
const nOld = 3
const Group = ({ t, group, fetchMore }) => {
  const allCards = group.cards.nodes
  // const totalCount = group.cards.totalCount
  const mapCardToActive = (card, i) => ({
    key: card.id,
    card,
    i
  })
  const [topIndex, setTopIndex] = useState(0)
  const [activeCards, setActiveCards] = useState(() => allCards.slice(0, nNew).map((card, i) => ({
    ...mapCardToActive(card, i),
    fallIn: true
  })))
  const [gone] = useState(() => new Set())
  const windowWidth = useWindowWidth()
  const cardWidth = windowWidth > 500
    ? 320
    : 300

  const dragTime = useRef(0)

  const bindGestures = useGesture(({ first, last, time, args: [set, card, isTop], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    if (first) {
      dragTime.current = time
    }
    if (last) {
      dragTime.current = time - dragTime.current
    }
    // flick hard enough
    const out = Math.abs(xDelta) > cardWidth / 2
    const trigger = velocity > 0.2 || out
    const dir = out
      ? xDelta < 0 ? -1 : 1
      : xDir < 0 ? -1 : 1

    // If button/finger's up, fly out
    if (!down && trigger) {
      gone.add(card)

      setActiveCards(acs => allCards[acs.length]
        ? acs.concat(mapCardToActive(allCards[acs.length], acs.length))
        : acs
      )
      setTopIndex(index => index + 1)

      // move to proper useEffect
      if (activeCards.length >= allCards.length - 5 && group.cards.pageInfo.hasNextPage) {
        fetchMore(group.cards.pageInfo)
      }
    }

    const isGone = gone.has(card)
    const x = isGone
      ? (200 + windowWidth) * dir
      : down ? xDelta : 0
    // how much the card tilts, flicking it harder makes it rotate faster
    const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)

    // active cards lift up a bit
    const scale = down || isTop ? 1.05 : 1
    set({
      x,
      rot: !down && !isGone ? 0 : rot,
      scale,
      delay: undefined,
      config: {
        friction: 50,
        tension: down ? 800 : isGone ? 200 : 500
      }
    })
  })

  return (
    <>
      <div {...styles.container}>
        {activeCards.map((activeCard, i) => {
          if (i + nOld < topIndex) {
            return null
          }
          const isTop = topIndex === i
          return <SpringCard
            {...activeCard}
            dragTime={dragTime}
            windowWidth={windowWidth}
            cardWidth={cardWidth}
            isHot={
              isTop ||
              activeCard.fallIn ||
              Math.abs(topIndex - i) === 1
            }
            isTop={isTop}
            zIndex={activeCards.length - i}
            bindGestures={bindGestures} />
        })}

        <div {...styles.buttonPanel} style={{
          zIndex: activeCards.length + 1
        }}>
          <span {...styles.button} style={{
            backgroundColor: '#EBB900',
            width: 40,
            height: 40,
            padding: 10
          }}>
            <RevertIcon size={20} fill='#fff' />
          </span>
          <span {...styles.button} style={{ backgroundColor: '#9F2500' }}>
            <IgnoreIcon size={25} fill='#fff' />
          </span>
          <span {...styles.button} style={{ backgroundColor: 'rgb(8,48,107)' }}>
            <FollowIcon size={25} fill='#fff' />
          </span>
          <span {...styles.button} style={{
            backgroundColor: '#4B6359', // disabled #B7C1BD
            width: 40,
            height: 40,
            padding: 10
          }}>
            <OverviewIcon size={20} fill='#fff' />
          </span>
        </div>
      </div>
    </>
  )
}

export default compose(
  withT
)(Group)
