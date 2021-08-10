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
    <div {...attributes}>
      <div contentEditable={false}>
        <Chart {...JSON.parse(JSON.stringify(element))} />
      </div>
      {children}
    </div>
  )
}

export const config: ElementConfigI = {
  Component
}
