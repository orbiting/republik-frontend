import React, { Attributes, ReactElement } from 'react'
import {
  Editor,
  Element as SlateElement,
  Transforms,
  Node,
  BasePoint
} from 'slate'
import { useSlate } from 'slate-react'

import { config, configKeys, coreEditorAttrs } from '../elements'
import { ToolbarButton } from './ui/Toolbar'
import {
  CustomEditor,
  CustomElement,
  CustomElementsType,
  NormalizeFn
} from '../../custom-types'
import { getElConfig, testSomeChildEl } from './helpers/element'

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

const hasNoBreakAncestor = (editor: CustomEditor, path?: BasePoint): boolean =>
  testSomeChildEl(
    node => !!getElConfig(node)?.attrs?.disableBreaks,
    editor,
    path
  )

// TODO: jump to next node instead of just disabling breaks
//  move this in the normalisation logic
export const withBreaksDisabled = (editor: CustomEditor): CustomEditor => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    const { selection } = editor

    if (
      hasNoBreakAncestor(editor, selection?.anchor) ||
      hasNoBreakAncestor(editor, selection?.focus)
    ) {
      return
    }
    return insertBreak()
  }

  return editor
}

export const withElAttrsConfig = (editor: CustomEditor): CustomEditor => {
  coreEditorAttrs.forEach(attr => {
    const editorCheck = editor[attr]
    editor[attr] = element =>
      (config[element.type]?.attrs || {})[attr] || editorCheck(element)
  })
  return editor
}

const matchStructure: NormalizeFn<CustomElement> = ([node, path], editor) => {
  if (!SlateElement.isElement(node)) return
  const template = config[node.type].structure

  if (!template) return

  console.log('normalisation', node, path)

  for (let i = 0; i < template.length; i++) {
    const templateEl = template[i]
    const currentEl = node.children[i]
    if (
      SlateElement.isElement(currentEl) &&
      currentEl.type !== templateEl.type
    ) {
      console.log('insert', templateEl, 'at', path.concat(i))
      return Transforms.insertNodes(
        editor,
        { ...templateEl, children: [] },
        {
          at: path.concat(i)
        }
      )
    }
  }
}

const BASE_NORMALIZATIONS = [matchStructure]

export const withNormalizations = (editor: CustomEditor): CustomEditor => {
  const { normalizeNode } = editor
  editor.normalizeNode = ([node, path]) => {
    configKeys.forEach(elKey => {
      if (matchElement(elKey)(node)) {
        const customNormalizations = BASE_NORMALIZATIONS.concat(
          config[elKey].normalizations || []
        )
        customNormalizations.forEach(normalizeFn =>
          normalizeFn([node as CustomElement, path], editor)
        )
        normalizeNode([node, path])
      }
    })
  }
  return editor
}
