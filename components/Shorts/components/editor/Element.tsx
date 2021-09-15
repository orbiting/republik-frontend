import React, { Attributes, ReactElement } from 'react'
import {
  Editor,
  Element as SlateElement,
  Transforms,
  Node,
  Descendant,
  BasePoint
} from 'slate'
import { useSlate } from 'slate-react'

import { editorAttrsKey, config, configKeys } from '../elements'
import { ToolbarButton } from './ui/Toolbar'
import {
  CustomEditor,
  CustomElement,
  CustomElementsType,
  NormalizeFn
} from '../custom-types'
// @ts-ignore
import { useColorContext } from '@project-r/styleguide'

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

export const MAX_SIGNS = 3000

export const getCharCount = (nodes: (Descendant | Node)[]): number =>
  nodes.map(node => Node.string(node).length).reduce((a, b) => a + b, 0)

export const CharCount: React.FC = () => {
  const editor = useSlate()
  const [colorScheme] = useColorContext()
  const countdown = MAX_SIGNS - getCharCount(editor.children)
  return (
    <span {...colorScheme.set('color', countdown < 100 ? 'error' : 'textSoft')}>
      ✂️ {countdown} Zeichen
    </span>
  )
}

export const withCharLimit = (editor: CustomEditor): CustomEditor => {
  const { insertText, insertFragment, insertNode } = editor

  editor.insertText = text => {
    if (getCharCount(editor.children) >= MAX_SIGNS) {
      return
    }
    insertText(text)
  }

  editor.insertFragment = nodes => {
    if (getCharCount(editor.children) + getCharCount(nodes) >= MAX_SIGNS) {
      return
    }
    insertFragment(nodes)
  }

  editor.insertNode = node => {
    if (getCharCount(editor.children) + getCharCount([node]) >= MAX_SIGNS) {
      return
    }
    insertNode(node)
  }

  return editor
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

const hasNoBreakAncestor = (
  editor: CustomEditor,
  path?: BasePoint
): boolean => {
  if (!path) return false
  for (const [node] of Node.ancestors(editor, Editor.path(editor, path))) {
    const currentType = SlateElement.isElement(node) && node.type
    if (
      currentType &&
      config[currentType as CustomElementsType]?.attrs?.disableBreaks
    ) {
      return true
    }
  }
  return false
}

// TODO: jump to next node instead of just disabling breaks
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

export const withElementsAttrs = (editor: CustomEditor): CustomEditor => {
  editorAttrsKey.forEach(attr => {
    const editorCheck = editor[attr]
    editor[attr] = element =>
      (config[element.type]?.attrs || {})[attr] || editorCheck(element)
  })
  return editor
}

// TODO: this one is doing weird things...
//  (Maybe instead of normalisation tweaking the insert/delete functions
//  would do the trick?)
const matchStructure: NormalizeFn<CustomElement> = ([node, path], editor) => {
  if (!SlateElement.isElement(node)) return
  const structure = config[node.type].structure
  if (!structure) return

  structure.some((elementType, i) => {
    if (
      node.children.length <= i ||
      (SlateElement.isElement(node.children[i]) &&
        // @ts-ignore
        node.children[i].type !== elementType)
    ) {
      Transforms.insertNodes(
        editor,
        { type: elementType, children: [] },
        {
          at: path.concat(i)
        }
      )
      return true
    }
  })
}

const BASE_NORMALIZATIONS = [matchStructure]

export const withNormalizations = (editor: CustomEditor): CustomEditor => {
  const { normalizeNode } = editor
  editor.normalizeNode = ([node, path]) => {
    configKeys.forEach(elKey => {
      if (matchElement(elKey)(node)) {
        normalizeNode([node, path])
        const customNormalizations = BASE_NORMALIZATIONS.concat(
          config[elKey].normalizations || []
        )
        customNormalizations.forEach(normalizeFn =>
          normalizeFn([node as CustomElement, path], editor)
        )
      }
    })
  }
  return editor
}
