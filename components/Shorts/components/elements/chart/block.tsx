import { ElementConfigI } from '../../custom-types'
import React, { Attributes, ReactElement } from 'react'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => (
  <div {...attributes}>
    {children}
  </div>
)

export const config: ElementConfigI = {
  Component
}
