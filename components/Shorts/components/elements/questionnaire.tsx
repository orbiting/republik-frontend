import { ElementConfigI } from '../custom-types'
import React, { Attributes, ReactElement } from 'react'
import { css } from 'glamor'
import { matchTemplateElement } from './helpers/normalization'
import { questionnaire } from '../templates/questionnaire'

const styles = {
  container: css({
    margin: '50px 0 10px 0'
  })
}

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => (
  <div {...attributes} {...styles.container}>
    {children}
  </div>
)

export const config: ElementConfigI = {
  Component,
  normalizations: [matchTemplateElement(questionnaire)]
}
