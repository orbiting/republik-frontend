import React from 'react'
import { css } from 'glamor'
import { mediaQueries, Center } from '@project-r/styleguide'

export default function SectionContainer({ children }) {
  return <Center {...sectionContainerStyle}>{children}</Center>
}

export const sectionContainerStyle = css({
  marginTop: '4em',
  [mediaQueries.mUp]: {
    marginTop: '6em'
  }
})
