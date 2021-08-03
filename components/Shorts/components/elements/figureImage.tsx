// @ts-ignore
import { FigureImage } from '@project-r/styleguide'
import { ElementConfigI, FigureImageElement } from '../custom-types'
import React, { Attributes, ReactElement } from 'react'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
  element: FigureImageElement
}> = ({ attributes, children, element }) => {
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <FigureImage {...element} />
      </div>
      {children}
    </div>
  )
}

export const config: ElementConfigI = {
  Component,
  attrs: {
    isVoid: true,
    editUi: true
  }
}
