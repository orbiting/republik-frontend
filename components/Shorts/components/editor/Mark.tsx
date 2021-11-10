import React, { Attributes, ReactElement } from 'react'
import { Editor } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { config, configKeys } from '../marks'
import { ToolbarButton } from './ui/Toolbar'
import { Placeholder } from './ui/Placeholder'
import { CustomEditor, CustomMarksType, CustomText } from '../../custom-types'

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
      disabled={!isMarkActive(editor, mKey)}
      onClick={() => toggleMark(editor, mKey)}
    />
  )
}

export const LeafComponent: React.FC<{
  attributes: Attributes
  children: ReactElement
  leaf: CustomText
}> = ({ attributes, children, leaf }) => {
  const editor = useSlate()
  const parentEl = children.props.parent
  const path = ReactEditor.findPath(editor, parentEl)

  configKeys
    .filter(mKey => leaf[mKey])
    .forEach(mKey => {
      const Component = config[mKey].Component
      children = <Component>{children}</Component>
    })
  return (
    <span {...attributes} style={{ position: 'relative' }}>
      {!leaf.text && !leaf.bookend && (
        <Placeholder leaf={leaf} element={parentEl} />
      )}
      {children}
    </span>
  )
}
