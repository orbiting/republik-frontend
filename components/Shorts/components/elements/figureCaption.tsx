import { Transforms } from 'slate'
// @ts-ignore
import { FigureCaption } from '@project-r/styleguide'
import {
  ElementConfigI,
  NormalizeFn,
  FigureCaptionElement
} from '../custom-types'
import { byline as bylineTemplate } from '../templates/figure'

const preserveByline: NormalizeFn<FigureCaptionElement> = (
  [node, path],
  editor
) => {
  if (node.children.length === 1) {
    Transforms.insertNodes(editor, bylineTemplate, {
      at: path.concat(0)
    })
  }
}

export const config: ElementConfigI = {
  Component: FigureCaption,
  normalizations: [preserveByline],
  attrs: {
    formatText: true
  }
}
