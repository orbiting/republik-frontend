import React from 'react'
import { Descendant, Node } from 'slate'
import { useSlate } from 'slate-react'
import { CustomEditor } from '../../../custom-types'
import editorConfig from '../../../config'
import { useColorContext } from '@project-r/styleguide'

const MAX_SIGNS = editorConfig.maxSigns

const getCharCount = (nodes: (Descendant | Node)[]): number =>
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
