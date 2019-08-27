import React, { useState } from 'react'
import { css } from 'glamor'
import { useSprings, animated, interpolate } from 'react-spring/web.cjs'
import { useGesture } from 'react-use-gesture/dist/index.js'
import { compose } from 'react-apollo'

import MdNotificationsOff from 'react-icons/lib/md/notifications-off'
import MdNotificationsActive from 'react-icons/lib/md/notifications-active'
import MdStar from 'react-icons/lib/md/star'

import withT from '../../lib/withT'

import Card from './Card'

const styles = {
  container: css({
    position: 'relative',
    background: 'lightblue',
    overflow: 'hidden',
    // overscrollBehaviorY: 'contain',
    width: '100%',
    height: '100vh'
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
    backgroundColor: 'white',
    width: '55vh',
    maxWidth: 400,
    height: '75vh',
    maxHeight: 570,
    willChange: 'transform',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3)'
  })
}

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const Group = ({ t, group }) => {
  const data = group.cards.nodes
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [props, set] = useSprings(data.length, i => ({ ...to(i), from: from(i) })) // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    set(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === data.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      <div {...styles.container}>
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div key={i} {...styles.card} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
            {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
            <animated.div {...bind(i)} {...styles.cardInner} style={{ transform: interpolate([rot, scale], trans) }}>
              <Card {...data[i]} />
            </animated.div>
          </animated.div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 100, textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            width: 60,
            height: 60,
            borderRadius: '50%',
            margin: 20,
            backgroundColor: '#9F2500',
            padding: 15,
            lineHeight: 0,
            verticalAlign: 'middle',
            boxShadow: '0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3);'
          }}>
          <MdNotificationsOff size={25} fill='#fff' />
        </span>
        <span
          style={{
            display: 'inline-block',
            width: 60,
            height: 60,
            borderRadius: '50%',
            margin: 20,
            backgroundColor: '#E9A733',
            padding: 15,
            lineHeight: 0,
            verticalAlign: 'middle',
            boxShadow: '0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3);'
          }}>
          <MdStar size={25} fill='#fff' />
        </span>
        <span
          style={{
            display: 'inline-block',
            width: 60,
            height: 60,
            borderRadius: '50%',
            margin: 20,
            backgroundColor: 'rgb(8,48,107)',
            padding: 15,
            lineHeight: 0,
            verticalAlign: 'middle',
            boxShadow: '0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3);'
          }}>
          <MdNotificationsActive size={25} fill='#fff' />
        </span>
      </div>
    </>
  )

  // return (
  //   <pre>{JSON.stringify(group, null, 2)}</pre>
  // )
}

export default compose(
  withT
)(Group)
