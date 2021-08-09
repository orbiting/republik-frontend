import { ElementConfigI } from '../custom-types'
import React, { Attributes, ReactElement } from 'react'
import { css } from 'glamor'
// @ts-ignore
import { Interaction } from '@project-r/styleguide'
const { P } = Interaction

const styles = {
  question: css({
    margin: '0px 0 10px 0'
  })
}

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => (
  <P {...attributes} {...styles.question}>
    {children}
  </P>
)

export const config: ElementConfigI = {
  Component,
  attrs: {
    formatText: true
  }
}
