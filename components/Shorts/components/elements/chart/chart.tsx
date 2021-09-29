// @ts-ignore
import { Chart } from '@project-r/styleguide/lib/chart'
import {
  ChartElement,
  DataFormType,
  ElementConfigI,
  needsDataFn
} from '../../custom-types'
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

const DataForm: DataFormType<ChartElement> = ({ element, setElement }) => (
  <div>TODO</div>
)

const needsData: needsDataFn<ChartElement> = el => !el.values || !el.config

export const config: ElementConfigI = {
  Component,
  DataForm,
  needsData
}
