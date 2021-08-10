import { ElementConfigI } from '../../custom-types'
import React, { Attributes, ReactElement } from 'react'
import {
  matchTemplateElement,
  singleCaptionNode
} from '../helpers/normalization'
import { chart } from '../../templates/chart'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => <div {...attributes}>{children}</div>

export const config: ElementConfigI = {
  Component,
  normalizations: [matchTemplateElement(chart), singleCaptionNode]
}
