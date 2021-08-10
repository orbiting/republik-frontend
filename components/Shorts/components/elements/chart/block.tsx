import { ElementConfigI } from '../../custom-types'
import React, { Attributes, ReactElement } from 'react'
import {
  matchTemplateElement,
  singleCaptionNode
} from '../helpers/normalization'
import { chart } from '../../templates/chart'
import { ContainerComponent } from '../../editor/Element'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  normalizations: [matchTemplateElement(chart), singleCaptionNode]
}
