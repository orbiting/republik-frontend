import React, { useMemo } from 'react'
import {
  ColorContextProvider,
  ColorContextLocalExtension
} from '@project-r/styleguide'
import { getUniqueColorTagName } from './colorHelper'

const ColorContextHelper = ({ children, tagMappings = [] }) => {
  const localColors = useMemo(() => {
    const colorsObject = { light: {}, dark: {} }

    if (!tagMappings) return colorsObject

    tagMappings.forEach(({ tag, color }) => {
      const colorName = getUniqueColorTagName(tag)
      colorsObject.light[colorName] = color.light
      colorsObject.dark[colorName] = color.dark
    })

    console.debug('localColors', colorsObject, tagMappings)

    return colorsObject
  }, [tagMappings])

  return (
    <ColorContextProvider>
      <ColorContextLocalExtension localColors={localColors}>
        {children}
      </ColorContextLocalExtension>
    </ColorContextProvider>
  )
}

export default ColorContextHelper
