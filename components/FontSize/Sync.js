import React, { useEffect, useRef, useCallback } from 'react'
import { FONT_SIZE_KEY, useFontSize } from '../../lib/fontSize'
import { DEFAULT_FONT_SIZE } from '@project-r/styleguide'
import NextHead from 'next/head'
import { useDebounce } from '../../lib/hooks/useDebounce'

const FontSizeSync = () => {
  const [fontSize] = useFontSize(DEFAULT_FONT_SIZE)
  const [slowFontSize] = useDebounce(fontSize, 500)
  const lastStyleTag = useRef()

  const setRootFontSize = useCallback(() => {
    document.documentElement.style.fontSize = fontSize + 'px'

    // IE, Edge do not recalculate all font sizes
    // unless new css or at least an style element is added
    // to prevent pollution we always remove the last one
    if (lastStyleTag.current) {
      document.head.removeChild(lastStyleTag.current)
    }
    lastStyleTag.current = document.createElement('style')
    lastStyleTag.current.setAttribute('data-font-size-sync', fontSize)
    document.head.appendChild(lastStyleTag.current)
  })

  useEffect(() => {
    setRootFontSize()
  }, [setRootFontSize, slowFontSize])
  useEffect(() => {
    // resize on browser: back button for IE, Edge
    setRootFontSize()
    return () => {
      document.documentElement.style.fontSize =
        DEFAULT_FONT_SIZE + 'px'
      if (lastStyleTag.current) {
        document.head.removeChild(lastStyleTag.current)
      }
    }
  }, [setRootFontSize])
  return (
    <NextHead>
      <script
        dangerouslySetInnerHTML={{
          __html: `try {document.documentElement.style.fontSize = (localStorage.getItem('${FONT_SIZE_KEY}') || ${DEFAULT_FONT_SIZE}) + 'px'} catch (e) {}`,
        }}
      />
    </NextHead>
  )
}

export default FontSizeSync
