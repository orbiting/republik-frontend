import React, { useEffect, useRef, useState } from 'react'
import { css } from 'glamor'
import {
  mediaQueries,
  useColorContext,
  useMediaQuery
} from '@project-r/styleguide'
import { ZINDEX_HEADER, AUDIO_PLAYER_HEIGHT } from '../constants'
const ACTIONBAR_FADE_AREA = 400
const FOOTER_FADE_AREA = 800
const FOOTER_FADE_AREA_MOBILE = 1200

const ActionBarOverlay = ({ children, audioPlayerVisible, inNativeApp }) => {
  const [colorScheme] = useColorContext()
  const [overlayVisible, setOverlayVisible] = useState(false)
  const isDesktop = useMediaQuery(mediaQueries.mUp)

  const lastY = useRef()
  const diff = useRef(0)

  const audioPlayerOffset = audioPlayerVisible ? AUDIO_PLAYER_HEIGHT + 20 : 0
  const bottomOffset = inNativeApp ? 20 : 44
  const bottomPosition = audioPlayerOffset + bottomOffset

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.body.scrollHeight
      const windowHeight = window.innerHeight
      const footerFadeArea = isDesktop
        ? FOOTER_FADE_AREA
        : FOOTER_FADE_AREA_MOBILE
      const y = Math.max(window.pageYOffset)
      const articleActionBarVisible = ACTIONBAR_FADE_AREA - y >= 0
      const footerOverlap = scrollHeight - windowHeight - y <= footerFadeArea
      const newDiff = lastY.current ? lastY.current - y : 0

      diff.current += newDiff
      diff.current = Math.max(Math.min(30, diff.current), 0)
      if (y > lastY.current) {
        // downscroll
        setOverlayVisible(false)
      } else {
        // upscroll
        setOverlayVisible(
          articleActionBarVisible || footerOverlap || diff.current < 30
            ? false
            : true
        )
      }
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [isDesktop])
  return (
    <div
      style={{
        opacity: overlayVisible ? 1 : 0,
        pointerEvents: overlayVisible ? undefined : 'none',
        bottom: bottomPosition,
        zIndex: ZINDEX_HEADER
      }}
      {...colorScheme.set('backgroundColor', 'overlay')}
      {...colorScheme.set('boxShadow', 'overlayShadow')}
      {...styles.container}
    >
      {children}
    </div>
  )
}

const styles = {
  container: css({
    position: 'fixed',
    right: 0,
    padding: '12px 0',
    margin: '0 16px',
    transition: 'opacity ease-out 0.3s, bottom ease-out 0.3s',
    [mediaQueries.mUp]: {
      right: 16,
      left: 'auto'
    }
  })
}

export default ActionBarOverlay
