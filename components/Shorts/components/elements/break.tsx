import React, { Attributes, Fragment, ReactElement } from 'react'
import { BreakElement, ElementConfigI } from '../custom-types'
import { MdKeyboardReturn } from '@react-icons/all-files/md/MdKeyboardReturn'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => (
  <Fragment {...attributes}>
    <br />
    {children}
  </Fragment>
)

const node: BreakElement = {
  type: 'break',
  children: [{ text: '' }]
}

export const config: ElementConfigI = {
  Component,
  node,
  attrs: {
    isInline: true,
    isVoid: true
  },
  button: { icon: MdKeyboardReturn }
}
