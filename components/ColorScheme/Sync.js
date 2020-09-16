import React, { useEffect, useRef } from 'react'
import { generateCSSColorDefinitions, colors } from '@project-r/styleguide'
import { COLOR_SCHEME_KEY, useColorSchemeKey } from './lib'
import NextHead from 'next/head'

const schemes = {
  light: {
    color: colors.text,
    backgroundColor: colors.containerBg,
    defs: generateCSSColorDefinitions(colors)
  },
  dark: {
    color: colors.negative.text,
    backgroundColor: colors.negative.containerBg,
    defs: generateCSSColorDefinitions(colors.negative)
  }
}

function createStyleTag(colorSchemeKey) {
  function schemeToCSS(scheme) {
    return (
      'html, body { background-color: ' +
      scheme.backgroundColor +
      '; color: ' +
      scheme.color +
      '; } :root { ' +
      scheme.defs +
      ' }'
    )
  }

  var styleTag = document.createElement('style')
  styleTag.setAttribute('data-color-scheme', colorSchemeKey || '')
  styleTag.innerHTML = schemes[colorSchemeKey]
    ? schemeToCSS(schemes[colorSchemeKey])
    : schemeToCSS(schemes.light) +
      ' @media (prefers-color-scheme: dark) { ' +
      schemeToCSS(schemes.dark) +
      ' }'
  document.head.appendChild(styleTag)
  return styleTag
}

const ColorSchemeSync = () => {
  const [colorSchemeKey] = useColorSchemeKey()
  const lastStyleTag = useRef()

  useEffect(() => {
    // to prevent pollution we always remove the previous one
    if (!lastStyleTag.current) {
      // search dom for color scheme style tag
      lastStyleTag.current = document.querySelector('style[data-color-scheme]')
    }
    if (lastStyleTag.current) {
      if (
        lastStyleTag.current.getAttribute('data-color-scheme') ===
        (colorSchemeKey || '')
      ) {
        // do nothing if already the right one
        return
      }
      document.head.removeChild(lastStyleTag.current)
    }
    lastStyleTag.current = createStyleTag(colorSchemeKey)
  }, [colorSchemeKey])

  return (
    <NextHead>
      <script
        dangerouslySetInnerHTML={{
          __html:
            '(function(){' +
            [
              'var colorSchemeKey',
              `try {colorSchemeKey = localStorage.getItem('${COLOR_SCHEME_KEY}')} catch (e) {}`,
              `var schemes = ${JSON.stringify(schemes)}`,
              createStyleTag.toString(),
              'createStyleTag(colorSchemeKey)'
            ].join(';') +
            '})()'
        }}
      />
    </NextHead>
  )
}

export default ColorSchemeSync
