import React, { useEffect, useRef, useState } from 'react'
import { css } from 'glamor'
import { mediaQueries, useColorContext } from '@project-r/styleguide'

const ACTIONBAR_FADE_AREA = 400

const ActionBarOverlay = ({ children, audioPlayerVisible, inNativeApp }) => {
  const [colorScheme] = useColorContext()
  const [overlayVisible, setOverlayVisible] = useState(false)

  const audioPlayerOffset = audioPlayerVisible ? 112 : 0
  const bottomOffset = audioPlayerOffset ? 24 : inNativeApp ? 20 : 44
  const bottomPosition = audioPlayerOffset + bottomOffset

  const lastY = useRef()

  useEffect(() => {
    const onScroll = () => {
      const y = Math.max(window.pageYOffset)
      const articleActionBarVisible = ACTIONBAR_FADE_AREA - y >= 0
      if (y > lastY.current) {
        // downscroll
        setOverlayVisible(false)
      } else {
        // upscroll
        setOverlayVisible(articleActionBarVisible ? false : true)
      }
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return (
    <div
      style={{
        opacity: overlayVisible ? 1 : 0,
        bottom: bottomPosition,
        backgroundColor: colorScheme.containerBg
      }}
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
    margin: '0 20px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    transition: 'all ease-out 0.3s',
    [mediaQueries.mUp]: {
      right: 16,
      left: 'auto'
    }
  })
}

export default ActionBarOverlay
