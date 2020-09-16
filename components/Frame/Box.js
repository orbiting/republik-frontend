import React from 'react'
import { useColorContext } from '@project-r/styleguide'

const Box = ({ children, style }) => {
  const [colorScheme] = useColorContext()
  return (
    <div
      style={{
        ...style,
        ...{
          paddingTop: 30,
          paddingBottom: 30,
          backgroundColor: colorScheme.primaryBg,
          color: colorScheme.text
        }
      }}
    >
      {children}
    </div>
  )
}

export default Box
