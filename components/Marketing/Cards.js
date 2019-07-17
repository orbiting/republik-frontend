import React, { useEffect, useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { css } from 'glamor'
import {
  Editorial,
  FigureImage,
  mediaQueries
} from '@project-r/styleguide'
import { negativeColors } from '../Frame/constants'
import { t } from '../../lib/withT'

const ASSETS_URL = 'https://cdn.republik.space/s3/republik-assets/assets/marketing/'
const MAX_WIDTH = 800
const PADDING = 15

// Inspired by https://codesandbox.io/s/j0y0vpz59

const styles = {
  root: css({
    background: negativeColors.primaryBg,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '960px',
    [mediaQueries.mUp]: {
      height: '760px'
    },
    textAlign: 'center',
    '& > div': {
      position: 'absolute',
      height: '100%',
      willChange: 'transform',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center'
    },
    '& > div > div': {
      cursor: 'grab',
      '&:active': {
        cursor: 'grabbing'
      },
      backgroundColor: '#fff',
      backgroundSize: 'auto 85%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      width: '85vw',
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
  })
}

const tt = key => t(`marketing/v2/cards/${key}`)

const cards = [
  // In reverse order (last is stacked on top).
  {
    title: tt('11/title'),
    subtitle: tt('11/subtitle'),
    image: `${ASSETS_URL}international.jpg?size=3500x2333&resize=${MAX_WIDTH}x`
  },
  {
    title: tt('10/title'),
    subtitle: tt('10/subtitle'),
    image: `${ASSETS_URL}feuilleton.jpg?resize=${MAX_WIDTH}x`
  },
  {
    title: tt('9/title'),
    subtitle: tt('9/subtitle'),
    image: `${ASSETS_URL}reportagen.jpg?resize=${MAX_WIDTH}x`
  },
  {
    title: tt('8/title'),
    subtitle: tt('8/subtitle'),
    image: `${ASSETS_URL}demokratie.gif`
  },
  {
    title: tt('7/title'),
    subtitle: tt('7/subtitle'),
    image: `${ASSETS_URL}bundeshaus.gif`
  },
  {
    title: tt('6/title'),
    subtitle: tt('6/subtitle'),
    image: `${ASSETS_URL}investigativ.jpg?resize=${MAX_WIDTH}x`
  },
  {
    title: tt('5/title'),
    subtitle: tt('5/subtitle'),
    image: `${ASSETS_URL}gespraeche.jpg?resize=${MAX_WIDTH}x`
  },
  {
    title: tt('4/title'),
    subtitle: tt('4/subtitle'),
    image: `${ASSETS_URL}klimawandel.jpg?resize=${MAX_WIDTH}x`
  },
  {
    title: tt('3/title'),
    subtitle: tt('3/subtitle'),
    image: `${ASSETS_URL}digitalisierung.gif`
  },
  {
    title: tt('2/title'),
    subtitle: tt('2/subtitle'),
    image: `${ASSETS_URL}justiz.gif`
  },
  {
    title: tt('1/title'),
    subtitle: tt('1/subtitle'),
    image: `${ASSETS_URL}briefings.jpg?resize=${MAX_WIDTH}x`
  },
  {
    title: tt('0/title'),
    subtitle: tt('0/subtitle'),
    image: `${ASSETS_URL}datenjournalismus.png?resize=${MAX_WIDTH}x`
  }
]

const cardWidthDesktop = (innerWidth) => Math.min((Math.max(MAX_WIDTH, innerWidth)) / 2, 500)

const xDesktop = (i, innerWidth, cardWidth) => (
  Math.floor(innerWidth / 2) + (i % 2 ? PADDING * 2 : -cardWidth + PADDING))

const randomRotation = () => -4 + Math.random() * 8

const toMobile = (i, innerWidth, cardWidth) => ({
  x: 0,
  y: 30 + 50 * i,
  scale: 1,
  rot: randomRotation(),
  delay: i * 100
})

const toDesktop = (i, innerWidth, cardWidth) => {
  return {
    x: xDesktop(i, innerWidth, cardWidth),
    y: 30 + (i - i % 2) * 25,
    scale: 1,
    rot: randomRotation(),
    delay: i * 100
  }
}

const useWindowWidth = () => {
  const [width, setWidth] = useState()

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWidth])

  return width
}

const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r, s) => ` rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const Cards = () => {
  if (!process.browser) return null
  const width = useWindowWidth()
  const isDesktop = width >= mediaQueries.mBreakPoint
  const cardWidth = cardWidthDesktop(width)
  const to = isDesktop ? toDesktop : toMobile
  const [gone] = useState(() => new Set())
  const [downIndex, setDownIndex] = useState(undefined)
  const [props, set] = useSprings(cards.length, i => ({ ...to(i, width, cardWidth), from: from(i) }))
  useEffect(
    () => {
      gone.clear()
      set(i => ({ ...to(i, window.innerWidth, cardWidth), delay: undefined }))
    },
    [width]
  )

  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.01
    const dir = xDir < 0 ? -1 : 1
    if (!down && trigger) gone.add(index)
    const newDownIndex = down ? index : undefined
    if (newDownIndex !== downIndex) {
      setDownIndex(newDownIndex)
    }
    set(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const xPos = isDesktop ? xDesktop(i, window.innerWidth, cardWidth) : 0
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xPos + xDelta : xPos
      const rot = down ? 0 : randomRotation()
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i, window.innerWidth, cardWidth)), 600)
  })

  return (
    <div {...styles.root}>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div key={i} style={{
          transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
          zIndex: i === downIndex ? 1 : undefined,
          width: isDesktop ? `${cardWidth - PADDING * 4}px` : '100%'
        }}>
          <animated.div {...bind(i)} style={{
            transform: interpolate([rot, scale], trans),
            maxWidth: isDesktop ? undefined : '380px'
          }}>
            <Editorial.Subhead style={{ marginTop: 0 }}>{cards[i].title}</Editorial.Subhead>
            <Editorial.P>{cards[i].subtitle}</Editorial.P>
            <FigureImage src={cards[i].image} attributes={{ draggable: false }} />
          </animated.div>
        </animated.div>
      ))}
    </div>
  )
}

export default Cards
