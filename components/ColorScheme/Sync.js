import React, { useEffect } from 'react'
import {
  COLOR_SCHEME_KEY,
  OS_COLOR_SCHEME_KEY,
  useColorSchemeKey,
  usePersistedOSColorSchemeKey
} from './lib'
import NextHead from 'next/head'

const ColorSchemeSync = props => {
  const [colorSchemeKey, _, defaultKey] = useColorSchemeKey()
  const [osColorSchemeKey] = usePersistedOSColorSchemeKey()

  const setColorSchemeKey = key => {
    if (key && key !== 'auto') {
      document.documentElement.setAttribute('data-user-color-scheme', key)
    } else {
      document.documentElement.removeAttribute('data-user-color-scheme')
    }
  }

  useEffect(() => {
    // used for our Android app, see usePersistedOSColorSchemeKey
    setColorSchemeKey(
      colorSchemeKey === 'auto' && osColorSchemeKey
        ? osColorSchemeKey
        : colorSchemeKey
    )
  }, [colorSchemeKey, osColorSchemeKey])
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
            'var key;try{',
            `key=JSON.parse(localStorage.getItem('${COLOR_SCHEME_KEY}'))`,
            '}catch(e){}',
            `key=key||'${defaultKey}';`,
            `if(key==='auto'){try{`,
            `key=JSON.parse(localStorage.getItem('${OS_COLOR_SCHEME_KEY}'))`,
            `}catch(e){}}`,
            `if(key!=='auto'){document.documentElement.setAttribute('data-user-color-scheme', key)}`
          ].join('')
        }}
      />
    </NextHead>
  )
}

export default ColorSchemeSync
