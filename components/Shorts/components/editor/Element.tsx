import React, { Attributes, ReactElement } from 'react'
import { Editor, Element as SlateElement, Transforms, Node } from 'slate'
import { useSlate } from 'slate-react'

import { editorAttrsKey, config, configKeys } from '../elements'
import { ToolbarButton } from './ui/Toolbar'
import {
  CustomEditor,
  CustomElement,
  CustomElementsType
} from '../custom-types'

export const matchElement = (elKey: CustomElementsType) => (n: any): boolean =>
  !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === elKey

export const ContainerComponent: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => {
  return <div {...attributes}>{children}</div>
}

export const ElementButton: React.FC<{
  elKey: CustomElementsType
  disabled?: boolean
}> = ({ elKey, disabled }) => {
  const editor = useSlate()
  const element = config[elKey]
  if (!element?.button) {
    return null
  }
  return (
    <ToolbarButton
      button={element.button}
      disabled={disabled}
      onClick={() =>
        element.insert
          ? element.insert(editor)
          : element.node
          ? Transforms.insertNodes(editor, element.node)
          : console.warn(`Element ${elKey} missing insert/node definition`)
      }
    />
  )
}

export const withTemplate = (template: CustomElement[]) => (
  editor: CustomEditor
): CustomEditor => {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length === 0) {
        Transforms.insertNodes(editor, template, { at: path.concat(0) })
      }
      for (const [child, childPath] of Node.children(editor, path)) {
        const currentType = SlateElement.isElement(child) && child.type
        if (childPath[0] === 0 && currentType !== 'headline') {
          const newProperties: Partial<SlateElement> = { type: 'headline' }
          Transforms.setNodes(editor, newProperties, { at: childPath })
        } else if (childPath[0] !== 0 && currentType === 'headline') {
          const newProperties: Partial<SlateElement> = { type: 'paragraph' }
          Transforms.setNodes(editor, newProperties, { at: childPath })
        } else if (
          childPath[0] === editor.children.length - 1 &&
          currentType !== template[template.length - 1].type
        ) {
          Transforms.insertNodes(editor, template[template.length - 1], {
            at: path.concat(editor.children.length)
          })
        }
      }
    }

    return normalizeNode([node, path])
  }
  return editor
}

export const withElementsAttrs = (editor: CustomEditor): CustomEditor => {
  editorAttrsKey.forEach(attr => {
    const editorCheck = editor[attr]
    editor[attr] = element =>
      (config[element.type]?.attrs || {})[attr] || editorCheck(element)
  })
  return editor
}

export const withNormalizations = (editor: CustomEditor): CustomEditor => {
  const { normalizeNode } = editor
  editor.normalizeNode = ([node, path]) => {
    configKeys.forEach(elKey => {
      if (matchElement(elKey)(node)) {
        const normalizations = config[elKey].normalizations || []
        normalizeNode([node, path])
        normalizations.forEach(normalizeFn => normalizeFn([node, path], editor))
      }
    })
  }
  return editor
}
