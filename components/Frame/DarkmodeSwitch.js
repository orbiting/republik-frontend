import React, { useState } from 'react'
import { useColorContext, IconButton } from '@project-r/styleguide'

import { useColorSchemeKey } from '../ColorScheme/lib'
import Darkmode from '../Icons/Darkmode'

const DarkmodeSwitch = () => {
  const [colorSchemeKey, setColorSchemeKey] = useColorSchemeKey()
  const nextColorSchemeKey = () => {
    switch (colorSchemeKey) {
      case undefined:
        return 'light'
      case 'light':
        return 'dark'
      case 'dark':
        return undefined
      default:
        return undefined
    }
  }
  console.log(colorSchemeKey)
  return (
    <IconButton
      Icon={Darkmode}
      label={`Design: ${colorSchemeKey || 'auto'}`}
      labelShort={`Design: ${colorSchemeKey || 'auto'}`}
      onClick={() => setColorSchemeKey(nextColorSchemeKey)}
    />
  )
}

export default DarkmodeSwitch
