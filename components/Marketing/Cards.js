import React, { Fragment, useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { css } from 'glamor'
import {
  FigureImage,
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'
import { P } from '../Overview/Elements'
import { negativeColors } from '../Frame/constants'
import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'
import { t } from '../../lib/withT'

// Inspired by https://codesandbox.io/s/j0y0vpz59

const styles = {
  container: css({
    zIndex: 1,
    background: negativeColors.primaryBg,
    position: 'relative',
    textAlign: 'center',
    paddingTop: '20px',
    [mediaQueries.mUp]: {
      paddingTop: '30px'
    }
  }),
  root: css({
    background: negativeColors.primaryBg,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    // height: '100%',
    height: '100vh',
    textAlign: 'center',
    cursor: 'url("https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/Ad1_-cursor.png") 39 39, auto',
    '& > div': {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
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
      width: '85vh',
      // maxHeight: '500px',
      // height: '60vh',
      maxWidth: '800px',
      willChange: 'transform',
      borderRadius: '5px',
      boxShadow: '0 12px 50px -10px rgba(0, 0, 0, 0.4), 0 10px 10px -10px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      padding: '15px'
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
    userSelect: 'none',
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

const RESIZE_PX = 780

const cards = [
  // In reverse order (last is stacked on top).
  {
    title: tt('11/title'),
    subtitle: tt('11/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/international.jpg?${RESIZE_PX}x`
  },
  {
    title: tt('10/title'),
    subtitle: tt('10/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/feuilleton.jpg?${RESIZE_PX}x`
  },
  {
    title: tt('9/title'),
    subtitle: tt('9/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/reportagen.jpg?${RESIZE_PX}x`
  },
  {
    title: tt('8/title'),
    subtitle: tt('8/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/demokratie.gif?${RESIZE_PX}x`
  },
  {
    title: tt('7/title'),
    subtitle: tt('7/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/bundeshaus.gif?${RESIZE_PX}x`
  },
  {
    title: tt('6/title'),
    subtitle: tt('6/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/investigativ.jpg?${RESIZE_PX}x`
  },
  {
    title: tt('5/title'),
    subtitle: tt('5/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/gespraeche.jpg?${RESIZE_PX}x`
  },
  {
    title: tt('4/title'),
    subtitle: tt('4/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/klimawandel.jpg?${RESIZE_PX}x`
  },
  {
    title: tt('3/title'),
    subtitle: tt('3/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/digitalisierung.gif?${RESIZE_PX}x`
  },
  {
    title: tt('2/title'),
    subtitle: tt('2/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/justiz.gif?${RESIZE_PX}x`
  },
  {
    title: tt('1/title'),
    subtitle: tt('1/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/briefings.jpg?${RESIZE_PX}x`
  },
  {
    title: tt('0/title'),
    subtitle: tt('0/subtitle'),
    image: `${CDN_FRONTEND_BASE_URL}/static/marketing/datenjournalismus.png?${RESIZE_PX}x`
  }
]

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => ` rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const Cards = () => {
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [currentIndex, setCurrentIndex] = useState(0) // For my onclick test
  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) })) // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.01 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    set(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      setCurrentIndex(index)
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })

  const handleClick = () => {
    console.log(currentIndex)
    // How do we trigger a card fly out from here?
  }

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <Fragment>
      <div {...styles.container} onClick={handleClick}>
        <P {...styles.title}>{cards[currentIndex ? currentIndex - 1 : cards.length - 1].title}</P>
      </div>
      <div {...styles.root}>
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
            {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
            <animated.div {...bind(i)} style={{ transform: interpolate([rot, scale], trans) }}>
              <Subtitle>{cards[i].subtitle}</Subtitle>
              <FigureImage src={cards[i].image} />
            </animated.div>
          </animated.div>

        ))}
      </div>
    </Fragment>
  )
}

export default Cards
