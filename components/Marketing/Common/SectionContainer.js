import React from 'react'
import { css } from 'glamor'
import { mediaQueries, Center } from '@project-r/styleguide'

export default function SectionContainer({ children, maxWidth, marginTop }) {
  return (
    <div {...sectionContainerStyle} style={{ maxWidth: maxWidth || 1280 }}>
      {children}
    </div>
  )
}

export const sectionContainerStyle = css({
  margin: '0 auto',
  marginTop: '5em',
  padding: '0px 15px',
  [mediaQueries.mUp]: {
    marginTop: '8em'
  }
})
