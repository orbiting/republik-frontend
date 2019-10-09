import React, { useEffect } from 'react'
import { FONT_SIZE_KEY, useFontSize } from '../../lib/fontSize'
import { DEFAULT_FONT_SIZE } from '@project-r/styleguide'
import NextHead from 'next/head'
import { css } from 'glamor'

const FontSizeSync = () => {
  const [fontSize] = useFontSize(DEFAULT_FONT_SIZE)
  useEffect(
    () => {
      document.documentElement.style.fontSize = fontSize + 'px'
      document.documentElement.className = css({ fontSize }).toString()
    },
    [fontSize]
  )
  useEffect(
    () => {
      return () => {
        document.documentElement.style.fontSize = DEFAULT_FONT_SIZE + 'px'
        document.documentElement.className = ''
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
