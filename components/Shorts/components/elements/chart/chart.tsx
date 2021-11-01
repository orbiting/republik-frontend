import { Chart } from '@project-r/styleguide/lib/chart'
import {
  ChartElement,
  DataFormProps,
  dataRequiredType,
  ElementConfigI
} from '../../../custom-types'
import React, { Attributes, ReactElement } from 'react'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
  element: ChartElement
}> = ({ attributes, children, element }) => {
  return (
    <div {...attributes}>
      <Chart {...JSON.parse(JSON.stringify(element))} />
      {children}
    </div>
  )
}

const DataForm: React.FC<DataFormProps<ChartElement>> = ({
  element,
  setElement
}) => <div>TODO</div>

const dataRequired: dataRequiredType<ChartElement> = ['values', 'config']

export const config: ElementConfigI = {
  Component,
  DataForm,
  dataRequired,
  attrs: {
    isVoid: true
  }
}
