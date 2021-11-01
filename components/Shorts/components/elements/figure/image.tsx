import { FigureImage } from '@project-r/styleguide'
import {
  DataFormProps,
  dataRequiredType,
  ElementConfigI,
  FigureImageElement
} from '../../../custom-types'
import React, { Attributes, ReactElement } from 'react'
import ImageInput from '../../Publikator/ImageInput'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
  element: FigureImageElement
}> = ({ attributes, children, element }) => {
  return (
    <div {...attributes}>
      <FigureImage {...element} />
      {children}
    </div>
  )
}

const DataForm: React.FC<DataFormProps<FigureImageElement>> = ({
  element,
  setElement
}) => (
  <ImageInput
    onChange={(_: unknown, src: string) => {
      setElement({
        ...element,
        src
      })
    }}
  />
)

const dataRequired: dataRequiredType<FigureImageElement> = ['src']

export const config: ElementConfigI = {
  Component,
  DataForm,
  dataRequired,
  attrs: {
    isVoid: true,
    editUi: true
  }
}
