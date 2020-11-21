import React, { useEffect, useRef } from 'react'
import { colors } from '@project-r/styleguide'
import { COLOR_SCHEME_KEY, useColorSchemeKey } from './lib'
import NextHead from 'next/head'

const ColorSchemeSync = () => {
  const [colorSchemeKey] = useColorSchemeKey()

  const setColorSchemeKey = key => {
    if (key) {
      document.documentElement.setAttribute('data-user-color-scheme', key)
    } else {
      document.documentElement.removeAttribute('data-user-color-scheme')
    }
  }

  useEffect(() => {
    setColorSchemeKey(colorSchemeKey)
  }, [colorSchemeKey])
  useEffect(() => {
    return () => {
      // removeAttribute when unmounted
      setColorSchemeKey()
    }
  }, [])
  return (
    <NextHead>
      <script
        dangerouslySetInnerHTML={{
          __html: [
            'var key;try {',
            `key = JSON.parse(localStorage.getItem('${COLOR_SCHEME_KEY}'))`,
            '} catch (e) {}',
            // ToDo activating auto
            // - rm || 'light'
            // - wrap in if(key){}
            `document.documentElement.setAttribute('data-user-color-scheme', key || 'light')`
          ].join('')
        }}
      />
    </NextHead>
  )
}

export default ColorSchemeSync
