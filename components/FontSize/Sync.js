import React, { useEffect, useRef } from 'react'
import { FONT_SIZE_KEY, useFontSize } from '../../lib/fontSize'
import { DEFAULT_FONT_SIZE } from '@project-r/styleguide'
import NextHead from 'next/head'

const FontSizeSync = () => {
  const [fontSize] = useFontSize(DEFAULT_FONT_SIZE)
  const lastStyleTag = useRef()
  useEffect(
    () => {
      document.documentElement.style.fontSize = fontSize + 'px'

      // IE, Edge do not recalculate all font sizes
      // unless new css or at least an style element is added
      // to prevent polution we always remove the last one
      if (lastStyleTag.current) {
        document.head.removeChild(lastStyleTag.current)
      }
      lastStyleTag.current = document.createElement('style')
      lastStyleTag.current.setAttribute('data-font-size-sync', fontSize)
      document.head.appendChild(lastStyleTag.current)
    },
    [fontSize]
  )
  useEffect(
    () => {
      return () => {
        document.documentElement.style.fontSize = DEFAULT_FONT_SIZE + 'px'
        if (lastStyleTag.current) {
          document.head.removeChild(lastStyleTag.current)
        }
      }
    },
    []
  )
  return <NextHead>
    <script dangerouslySetInnerHTML={{
      __html: `try {document.documentElement.style.fontSize = (localStorage.getItem('${FONT_SIZE_KEY}') || ${DEFAULT_FONT_SIZE}) + 'px'} catch (e) {}`
    }} />
  </NextHead>
}

export default FontSizeSync
