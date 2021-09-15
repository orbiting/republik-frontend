// @ts-ignore
import { FigureImage } from '@project-r/styleguide'
import {
  DataFormType,
  ElementConfigI,
  FigureImageElement,
  needsDataFn
} from '../../custom-types'
import React, { Attributes, ReactElement } from 'react'
import ImageInput from '../../Publikator/ImageInput'

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

const DataForm: DataFormType<FigureImageElement> = ({
  element,
  setElement
}) => (
  <ImageInput
    onChange={(_: any, src: string) => {
      setElement({
        ...element,
        src
      })
    }}
  />
)

const needsData: needsDataFn<FigureImageElement> = el => !el.src

export const config: ElementConfigI = {
  Component,
  DataForm,
  needsData,
  attrs: {
    isVoid: true,
    editUi: true
  }
}
