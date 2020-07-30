import React, { useEffect, useRef, useState } from 'react'
import { css } from 'glamor'
import { mediaQueries } from '@project-r/styleguide'

const ACTIONBAR_FADE_AREA = 400

const ActionBarOverlay = ({ children, actionBarTopY, inNativeApp }) => {
  const [actionBarOpacity, setActionBarOpacity] = useState(0)

  const fixedRef = useRef()
  const diff = useRef(0)
  const lastY = useRef()
  const lastDiff = useRef()
  const actionBarOpacityRef = useRef()

  const bottomOffset = inNativeApp ? 20 : 44
  const bottomOffsetShift = bottomOffset + 48

  actionBarOpacityRef.current = actionBarOpacity
  useEffect(() => {
    const onScroll = () => {
      const y = Math.max(window.pageYOffset)
      const newDiff = lastY.current ? lastY.current - y : bottomOffset
      diff.current += newDiff
      diff.current = Math.min(
        Math.max(-bottomOffsetShift, diff.current),
        bottomOffset
      )

      if (diff.current !== lastDiff.current) {
        fixedRef.current.style.bottom = `${diff.current}px`
      }

      lastY.current = y
      lastDiff.current = diff.current

      // 300 should be replaced with y location of action bar
      const newActionBarOpacity =
        0 + Math.min(1, Math.max(0, y - 300) / ACTIONBAR_FADE_AREA)
      if (newActionBarOpacity !== actionBarOpacityRef.current) {
        setActionBarOpacity(newActionBarOpacity)
      }
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
      style={{ opacity: actionBarOpacity }}
      {...styles.container}
      {...css({ [mediaQueries.mUp]: { right: 0 } })}
    >
      {children}
    </div>
  )
}

const styles = {
  container: css({
    position: 'fixed',
    bottom: 44,
    left: 0,
    right: 0,
    padding: '12px 0',
    margin: '0 20px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    [mediaQueries.mUp]: {
      boxShadow: 'none'
    }
  })
}

export default ActionBarOverlay
