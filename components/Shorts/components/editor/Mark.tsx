import React, { Attributes, ElementType, ReactElement } from 'react'
import { Editor } from 'slate'
import { useSlate } from 'slate-react'

import { config, configKeys } from '../marks'
import { config as elementsConfig } from '../elements'
import { ToolbarButton } from './ui/Toolbar'
import { Placeholder } from './ui/Placeholder'
import { CustomEditor, CustomMarksType, CustomText } from '../custom-types'

const isMarkActive = (editor: CustomEditor, mKey: CustomMarksType): boolean => {
  const marks = Editor.marks(editor)
  return !!marks && !!marks[mKey]
}

const toggleMark = (editor: CustomEditor, mKey: CustomMarksType): void => {
  const isActive = isMarkActive(editor, mKey)
  if (isActive) {
    Editor.removeMark(editor, mKey)
  } else {
    Editor.addMark(editor, mKey, true)
  }
}

export const MarkButton: React.FC<{ mKey: CustomMarksType }> = ({ mKey }) => {
  const editor = useSlate()
  const mark = config[mKey]
  if (!mark.button) {
    return null
  }
  return (
    <ToolbarButton
      button={mark.button}
      fill={isMarkActive(editor, mKey) ? 'text' : 'textSoft'}
      onClick={() => toggleMark(editor, mKey)}
    />
  )
}

export const LeafComponent: React.FC<{
  attributes: Attributes
  children: ReactElement
  leaf: CustomText
}> = ({ attributes, children, leaf }) => {
  configKeys
    .filter(mKey => leaf[mKey])
    .forEach(mKey => {
      const Component = config[mKey].Component
      children = <Component>{children}</Component>
    })
  return (
    <span {...attributes} style={{ position: 'relative' }}>
      {!leaf.text && (
        <Placeholder leaf={leaf} element={children.props.parent} />
      )}
      {children}
    </span>
  )
}
