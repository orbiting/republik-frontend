import React, { useEffect, useRef, useState } from 'react'
import { css } from 'glamor'
import { mediaQueries } from '@project-r/styleguide'

const ACTIONBAR_FADE_AREA = 400

const ActionBarOverlay = ({ children, audioPlayerVisible, inNativeApp }) => {
  const [actionBarOpacity, setActionBarOpacity] = useState(0)

  const fixedRef = useRef()
  const diff = useRef(0)
  const lastY = useRef()
  const lastDiff = useRef()
  const actionBarOpacityRef = useRef()

  const audioPlayerOffset = audioPlayerVisible ? 112 : 0
  const bottomOffset = audioPlayerOffset ? 24 : inNativeApp ? 20 : 44
  const bottomPosition = audioPlayerOffset + bottomOffset

  actionBarOpacityRef.current = actionBarOpacity

  useEffect(() => {
    const onScroll = () => {
      const y = Math.max(window.pageYOffset)
      const newDiff = lastY.current ? lastY.current - y : bottomPosition
      diff.current += newDiff
      diff.current = Math.min(Math.max(-100, diff.current), bottomPosition)
      const opacityFromScrenPosition =
        0 + Math.min(1, Math.max(0, y - 300) / ACTIONBAR_FADE_AREA)

      const opacity =
        opacityFromScrenPosition >= 1
          ? diff.current / bottomPosition
          : Math.min(opacityFromScrenPosition, diff.current / bottomPosition)
      setActionBarOpacity(opacity)

      lastY.current = y
      lastDiff.current = diff.current
    }

    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return (
    <div
      ref={fixedRef}
      style={{
        opacity: actionBarOpacity,
        bottom: bottomPosition
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
    left: 0,
    right: 0,
    padding: '12px 0',
    margin: '0 20px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    transition: 'bottom ease-out 0.3s',
    [mediaQueries.mUp]: {
      right: 16,
      left: 'auto'
    }
  })
}

export default ActionBarOverlay
