// @ts-ignore
import { Chart } from '@project-r/styleguide/lib/chart'
import { ChartElement, ElementConfigI } from '../../custom-types'
import React, { Attributes, ReactElement } from 'react'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
  element: ChartElement
}> = ({ attributes, children, element }) => {
  return (
    <div {...attributes} contentEditable={false}>
      <Chart {...element} />
      {children}
    </div>
  )
}

export const config: ElementConfigI = {
  Component
}
