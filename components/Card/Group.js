import React, { useState } from 'react'
import { css } from 'glamor'
import { useSprings, animated, interpolate } from 'react-spring/web.cjs'
import { useGesture } from 'react-use-gesture/dist/index.js'
import { compose } from 'react-apollo'
import { range, max } from 'd3-array'

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

const to = i => ({
  x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100
})
const from = i => ({
  x: 0, rot: 0, scale: 1.5, y: -1200
})

const interpolateTransform = (r, s) => `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const nSprings = 5

const Group = ({ t, group, fetchMore }) => {
  const allCards = group.cards.nodes
  const totalCount = group.cards.totalCount
  const [activeCardIndexes, setACI] = useState(
    range(0, nSprings)
  )
  const [gone] = useState(() => new Set())
  const [springs, setSprings] = useSprings(nSprings, i => ({ ...to(i), from: from(i) }))

  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const cardIndex = activeCardIndexes[index]
    const card = allCards[cardIndex]

    // flick hard enough
    const trigger = velocity > 0.2
    const dir = xDir < 0 ? -1 : 1

    // If button/finger's up, fly out
    if (!down && trigger) {
      gone.add(card)
      if (cardIndex < totalCount - 1) {
        setTimeout(
          () => {
            setACI(aci => {
              if (aci[index] === cardIndex) {
                const nAci = [].concat(aci)
                nAci[index] = null
                return nAci
              }
              return aci
            })
            setSprings(i => {
              if (index !== i) return
              return { ...to(i), delay: undefined, config: { friction: 50, tension: 800 } }
            })
            if (max(activeCardIndexes) >= allCards.length - 5 && group.cards.pageInfo.hasNextPage) {
              fetchMore(group.cards.pageInfo)
            }
            setTimeout(
              () => {
                setACI(aci => {
                  if (aci[index] === null) {
                    const nAci = [].concat(aci)
                    nAci[index] = max(nAci) + 1
                    return nAci
                  }
                  return aci
                })
              },
              1000
            )
          },
          1000
        )
      }
    }
    setSprings(i => {
      if (index !== i) return
      const isGone = gone.has(card)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0
      // how much the card tilts, flicking it harder makes it rotate faster
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)

      // active cards lift up a bit
      const scale = down ? 1.1 : 1

      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
  })

  return (
    <>
      <div {...styles.container}>
        {springs.map(({ x, y, rot, scale }, i) => {
          const cardIndex = activeCardIndexes[i]
          const card = allCards[cardIndex]
          return (
            <animated.div key={i} {...styles.card} style={{
              transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
              zIndex: cardIndex === null
                ? 0
                : totalCount - cardIndex
            }}>
              <animated.div {...bind(i)} {...styles.cardInner} style={{ transform: interpolate([rot, scale], interpolateTransform) }}>
                {card && <Card {...card} />}
              </animated.div>
            </animated.div>
          )
        })}

        <div {...styles.buttonPanel} style={{
          zIndex: totalCount + 1
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
