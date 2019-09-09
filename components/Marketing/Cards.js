import React, { useEffect, useState, useRef } from 'react'
import { useSprings, animated, interpolate } from 'react-spring/web.cjs'
import { useGesture } from 'react-use-gesture/dist/index.js'
import { css } from 'glamor'
import {
  Editorial,
  FigureImage,
  mediaQueries,
  usePrevious
} from '@project-r/styleguide'
import { ASSETS_SERVER_BASE_URL } from '../../lib/constants'
import { t } from '../../lib/withT'
import { useWindowWidth } from '../../lib/hooks/useWindowWidth'

const CARDS_ASSETS_BASE_URL = `${ASSETS_SERVER_BASE_URL}/s3/republik-assets/assets/marketing`
const MAX_WIDTH = 800
const PADDING = 15

// Based on https://codesandbox.io/s/j0y0vpz59

const styles = {
  root: css({
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: 960,
    [mediaQueries.mUp]: {
      height: 765
    },
    textAlign: 'center',
    '& > div': {
      position: 'absolute',
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
    },
    '& > div > div > *': {
      pointerEvents: 'none'
    }
  })
}

const tt = key => t(`marketing/cards/${key}`)

const cards = [
  // In reverse order (last is stacked on top).
  {
    title: tt('11/title'),
    subtitle: tt('11/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/international.jpg?size=1200x900&resize=${MAX_WIDTH}x`
  },
  {
    title: tt('10/title'),
    subtitle: tt('10/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/feuilleton.jpg?size=5760x3840&resize=${MAX_WIDTH}x`
  },
  {
    title: tt('9/title'),
    subtitle: tt('9/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/reportagen.jpg?size=3000x2003&resize=${MAX_WIDTH}x`
  },
  {
    title: tt('8/title'),
    subtitle: tt('8/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/demokratie.gif?size=1200x933`
  },
  {
    title: tt('7/title'),
    subtitle: tt('7/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/bundeshaus.gif?size=2666x1500`
  },
  {
    title: tt('6/title'),
    subtitle: tt('6/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/investigativ.jpg?size=3200x2133&resize=${MAX_WIDTH}x`
  },
  {
    title: tt('5/title'),
    subtitle: tt('5/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/gespraeche.jpg?size=2901x1935&resize=${MAX_WIDTH}x`
  },
  {
    title: tt('4/title'),
    subtitle: tt('4/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/klimawandel.jpg?size=3800x2850&resize=${MAX_WIDTH}x`
  },
  {
    title: tt('3/title'),
    subtitle: tt('3/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/digitalisierung.jpg?size=3800x2850&resize=${MAX_WIDTH}x`
  },
  {
    title: tt('2/title'),
    subtitle: tt('2/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/justiz.gif?size=980x653`
  },
  {
    title: tt('1/title'),
    subtitle: tt('1/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/briefings.jpg?size=3543x2531&resize=${MAX_WIDTH}x`
  },
  {
    title: tt('0/title'),
    subtitle: tt('0/subtitle'),
    image: `${CARDS_ASSETS_BASE_URL}/datenjournalismus.png?size=1400x1000&resize=${MAX_WIDTH}x`
  }
]

const cardWidthDesktop = (innerWidth) => Math.min(
  Math.max(MAX_WIDTH, innerWidth) / 2,
  480
)

const xDesktop = (i, innerWidth, cardWidth) => (
  Math.floor(innerWidth / 2) + (i % 2 ? PADDING : -cardWidth + PADDING * 2)
)

const randomRotation = () => -3 + Math.random() * 6

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
    y: 35 + (i - i % 2) * 25,
    scale: 1,
    rot: randomRotation(),
    delay: i * 100
  }
}

const trans = (r, s) => `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const Cards = () => {
  const width = useWindowWidth() || (typeof window !== 'undefined' && window.innerWidth)
  const prevWidth = usePrevious(width)
  const isDesktop = width >= mediaQueries.mBreakPoint
  const cardWidth = cardWidthDesktop(width)
  const to = isDesktop ? toDesktop : toMobile
  const [gone] = useState(() => new Set())
  const [zIndexes, setZIndexes] = useState([])
  const setTopIndex = topIndex => {
    setZIndexes(indexes => [
      ...indexes.filter(i => i !== topIndex), topIndex
    ])
  }
  const [props, set] = useSprings(
    cards.length,
    i => ({
      from: { ...to(i, width, cardWidth), x: i % 2 ? width + 1000 : -1000 }
    })
  )
  const [inView, setInView] = useState(undefined)
  useEffect(
    () => {
      if (!inView) {
        return
      }

      gone.clear()
      setZIndexes([])
      set(i => ({
        ...to(i, window.innerWidth, cardWidth),
        ...(prevWidth !== width ? {
          delay: undefined,
          config: { friction: 50, tension: 1000 }
        } : undefined)
      }))
    },
    [width, prevWidth, inView]
  )
  const rootRef = useRef()
  useEffect(() => {
    if (inView) {
      return
    }
    const check = () => {
      if (!rootRef.current) {
        return
      }
      const { top } = rootRef.current.getBoundingClientRect()
      if (top - window.innerHeight < -250) {
        setInView(true)
      }
    }
    window.addEventListener('scroll', check)
    check()
    return () => {
      window.removeEventListener('scroll', check)
    }
  }, [inView])
  const animateCard = (index, { down, xDelta, dir } = {}) => {
    set(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const xPos = isDesktop ? xDesktop(i, window.innerWidth, cardWidth) : 0
      const x = isGone
        ? (200 + window.innerWidth) * dir
        : down ? xPos + xDelta : xPos
      const rot = down || isGone ? 0 : randomRotation()
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
      }
    })
  }
  const maybeRestoreCards = () => {
    if (gone.size === cards.length) {
      setTimeout(() => {
        gone.clear()
        setZIndexes([])
        set(i => to(i, window.innerWidth, cardWidth))
      }, 600)
    }
  }
  const bind = useGesture(({ args: [index], down, delta: [xDelta], direction: [xDir], velocity }) => {
    const trigger = (
      (velocity > 0.2 && Math.abs(xDelta) > cardWidth / 8) ||
      Math.abs(xDelta) > cardWidth / 4
    )
    const dir = velocity > 0.2
      ? xDir < 0 ? -1 : 1
      : xDelta < 0 ? -1 : 1
    if (!down && trigger && !gone.has(index)) {
      gone.add(index)
    }
    if (down && zIndexes[zIndexes.length - 1] !== index) {
      setTopIndex(index)
    }
    animateCard(index, { down, xDelta, dir })
    if (!down) {
      maybeRestoreCards()
    }
  })

  return (
    <div {...styles.root} ref={rootRef}>
      {!!width && props.map(({ x, y, rot, scale }, i) => (
        <animated.div key={i} style={{
          transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
          zIndex: zIndexes.indexOf(i) + 1,
          width: isDesktop ? cardWidth - PADDING * 4 : '100%'
        }}>
          <animated.div {...bind(i)} style={{
            transform: interpolate([rot, scale], trans),
            maxWidth: isDesktop ? undefined : 350
          }} onDoubleClick={() => {
            gone.add(i)
            animateCard(i, { dir: i % 2 ? 1 : -1 })
            maybeRestoreCards()
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
