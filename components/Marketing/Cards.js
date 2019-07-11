import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { css } from 'glamor'
import {
  Editorial,
  FigureImage,
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'
import { negativeColors } from '../Frame/constants'
import { t } from '../../lib/withT'

const ASSETS_URL = 'https://cdn.republik.space/s3/republik-assets/assets/marketing/'
const MAX_WIDTH = 800

// Inspired by https://codesandbox.io/s/j0y0vpz59

const styles = {
  root: css({
    background: negativeColors.primaryBg,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    // height: '100%',
    height: '100vh',
    maxHeight: '600px',
    [mediaQueries.mUp]: {
      maxHeight: '1000px'
    },
    textAlign: 'center',
    cursor: `url('${ASSETS_URL}cards-cursor.png') 39 39, auto`,
    '& > div': {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      maxHeight: '600px',
      [mediaQueries.mUp]: {
        maxHeight: '1000px'
      },
      willChange: 'transform',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    '& > div > div': {
      backgroundColor: '#fff',
      backgroundSize: 'auto 85%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      width: '85vw',
      // height: '60vh',
      maxHeight: '600px',
      [mediaQueries.mUp]: {
        maxHeight: '1000px'
      },
      maxWidth: `${MAX_WIDTH}px`,
      willChange: 'transform',
      borderRadius: '5px',
      boxShadow: '0 12px 50px -10px rgba(0, 0, 0, 0.4), 0 10px 10px -10px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      padding: '20px 15px 15px 15px'
    },
    '& *': {
      userSelect: 'none'
    }
  }),
  title: css({
    position: 'absolute',
    left: 0,
    right: 0,
    top: '20px',
    textAlign: 'center',
    color: negativeColors.text,
    [mediaQueries.mUp]: {
      top: '30px'
    }
  }),
  subtitle: css({
    ...fontStyles.serifTitle58,
    fontWeight: 'normal',
    fontSize: 18,
    lineHeight: '24px',
    color: colors.text,
    backgroundColor: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    [mediaQueries.mUp]: {
      fontSize: 24,
      lineHeight: '30px',
      marginBottom: 20
    }
  })
}

const Subtitle = ({ children }) => <h2 {...styles.subtitle}>{children}</h2>

const tt = key => t(`marketing/v2/cards/${key}`)

const cards = [
  // In reverse order (last is stacked on top).
  {
    title: tt('11/title'),
    subtitle: tt('11/subtitle'),
    image: `${ASSETS_URL}international.jpg?${MAX_WIDTH}x`
  },
  {
    title: tt('10/title'),
    subtitle: tt('10/subtitle'),
    image: `${ASSETS_URL}feuilleton.jpg?${MAX_WIDTH}x`
  },
  {
    title: tt('9/title'),
    subtitle: tt('9/subtitle'),
    image: `${ASSETS_URL}reportagen.jpg?${MAX_WIDTH}x`
  },
  {
    title: tt('8/title'),
    subtitle: tt('8/subtitle'),
    image: `${ASSETS_URL}demokratie.gif?${MAX_WIDTH}x`
  },
  {
    title: tt('7/title'),
    subtitle: tt('7/subtitle'),
    image: `${ASSETS_URL}bundeshaus.gif?${MAX_WIDTH}x`
  },
  {
    title: tt('6/title'),
    subtitle: tt('6/subtitle'),
    image: `${ASSETS_URL}investigativ.jpg?${MAX_WIDTH}x`
  },
  {
    title: tt('5/title'),
    subtitle: tt('5/subtitle'),
    image: `${ASSETS_URL}gespraeche.jpg?${MAX_WIDTH}x`
  },
  {
    title: tt('4/title'),
    subtitle: tt('4/subtitle'),
    image: `${ASSETS_URL}klimawandel.jpg?${MAX_WIDTH}x`
  },
  {
    title: tt('3/title'),
    subtitle: tt('3/subtitle'),
    image: `${ASSETS_URL}digitalisierung.gif?${MAX_WIDTH}x`
  },
  {
    title: tt('2/title'),
    subtitle: tt('2/subtitle'),
    image: `${ASSETS_URL}justiz.gif?${MAX_WIDTH}x`
  },
  {
    title: tt('1/title'),
    subtitle: tt('1/subtitle'),
    image: `${ASSETS_URL}briefings.jpg?${MAX_WIDTH}x`
  },
  {
    title: tt('0/title'),
    subtitle: tt('0/subtitle'),
    image: `${ASSETS_URL}datenjournalismus.png?${MAX_WIDTH}x`
  }
]

const to = i => ({ x: 0, y: (i * 12) - 70, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r, s) => ` rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const Cards = () => {
  const [gone] = useState(() => new Set())
  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) }))
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.01
    const dir = xDir < 0 ? -1 : 1
    if (!down && trigger) gone.add(index)
    set(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })

  return (
    <div {...styles.root}>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
          <animated.div {...bind(i)} style={{ transform: interpolate([rot, scale], trans) }}>
            <Editorial.Format color={colors.lightText}>{cards[i].title}</Editorial.Format>
            <Subtitle>{cards[i].subtitle}</Subtitle>
            <FigureImage src={cards[i].image} draggable={false} />
          </animated.div>
        </animated.div>
      ))}
    </div>
  )
}

export default Cards
