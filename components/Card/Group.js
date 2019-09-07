import React, { useState } from 'react'
import { css } from 'glamor'
import { useSpring, animated, interpolate } from 'react-spring/web.cjs'
import { useGesture } from 'react-use-gesture/dist/index.js'
import { compose } from 'react-apollo'

import MdNotificationsOff from 'react-icons/lib/md/notifications-off'
import MdNotificationsActive from 'react-icons/lib/md/notifications-active'

import withT from '../../lib/withT'
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
    height: '90vh',
    willChange: 'transform',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  cardInner: css({
    userSelect: 'none',
    backgroundColor: 'white',
    minWidth: 300,
    width: '40vh',
    maxWidth: 400,
    height: '60vh',
    minHeight: 450,
    maxHeight: 570,
    willChange: 'transform',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 12px 50px -10px rgba(0, 0, 0, 0.4), 0 10px 10px -10px rgba(0, 0, 0, 0.1)'
  }),
  button: css({
    display: 'inline-block',
    width: 60,
    height: 60,
    borderRadius: '50%',
    margin: 20,
    padding: 15,
    lineHeight: 0,
    verticalAlign: 'middle',
    boxShadow: '0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3)'
  }),
  buttonPanel: css({
    position: 'absolute',
    bottom: 30,
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

const SpringCard = ({ i, zIndex, card, bindGestures, fallIn, active }) => {
  const [props, set] = useSpring(() => fallIn
    ? { ...to(), delay: i * 100, from: fromFall() }
    : { ...to(), from: { opacity: 0 } }
  )
  const { x, y, rot, scale, opacity } = props
  if (active) {
    set({
      scale: 1.05, rot: 0
    })
  }

  return (
    <animated.div {...styles.card} style={{
      transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
      zIndex: zIndex
    }}>
      <animated.div
        {...bindGestures(set, card)}
        {...styles.cardInner}
        style={{
          opacity,
          transform: interpolate([rot, scale], interpolateTransform)
        }}
      >
        {card && <Card key={card.id} {...card} />}
      </animated.div>
    </animated.div>
  )
}

const nSprings = 5
const Group = ({ t, group, fetchMore }) => {
  const allCards = group.cards.nodes
  // const totalCount = group.cards.totalCount
  const mapCardToActive = (card, i) => ({
    key: card.id,
    card,
    i
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeCards, setActiveCards] = useState(() => allCards.slice(0, nSprings).map((card, i) => ({
    ...mapCardToActive(card, i),
    fallIn: true
  })))
  const [gone] = useState(() => new Set())

  const bindGestures = useGesture(({ args: [set, card], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    // flick hard enough
    const trigger = velocity > 0.2
    const dir = xDir < 0 ? -1 : 1

    // If button/finger's up, fly out
    if (!down && trigger) {
      gone.add(card)

      setActiveCards(acs => allCards[acs.length]
        ? acs.concat(mapCardToActive(allCards[acs.length], acs.length))
        : acs
      )
      setActiveIndex(index => index + 1)

      // move to proper useEffect
      if (activeCards.length >= allCards.length - 5 && group.cards.pageInfo.hasNextPage) {
        fetchMore(group.cards.pageInfo)
      }
    }

    const isGone = gone.has(card)
    const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0
    // how much the card tilts, flicking it harder makes it rotate faster
    const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)

    // active cards lift up a bit
    const scale = down ? 1.05 : 1
    set({
      x,
      rot,
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
          if (i + 3 < activeIndex) {
            return null
          }
          return <SpringCard
            {...activeCard}
            active={activeIndex === i}
            zIndex={activeCards.length - i}
            bindGestures={bindGestures} />
        })}

        <div {...styles.buttonPanel} style={{
          zIndex: activeCards.length + 1
        }}>
          <span {...styles.button} style={{ backgroundColor: '#9F2500' }}>
            <MdNotificationsOff size={25} fill='#fff' />
          </span>
          <span {...styles.button} style={{ backgroundColor: 'rgb(8,48,107)' }}>
            <MdNotificationsActive size={25} fill='#fff' />
          </span>
        </div>
      </div>
    </>
  )
}

export default compose(
  withT
)(Group)
