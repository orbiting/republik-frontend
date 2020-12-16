import React, { useEffect } from 'react'
import { COLOR_SCHEME_KEY, usePersistedColorSchemeKey } from './lib'
import NextHead from 'next/head'

const ColorSchemeSync = () => {
  const [colorSchemeKey] = usePersistedColorSchemeKey()

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
            `if (key) { document.documentElement.setAttribute('data-user-color-scheme', key) }`
          ].join('')
        }}
      />
    </NextHead>
  )
}

export default ColorSchemeSync
