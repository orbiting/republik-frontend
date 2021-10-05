import React, { useState } from 'react'
// @ts-ignore
import { Overlay, OverlayToolbar, OverlayBody } from '@project-r/styleguide'
import {
  CustomDescendant,
  CustomElement,
  CustomText
} from './custom-types'
import Select from './components/editor/ui/Select'
import Populate from './components/editor/ui/Populate'
import Editor from './components/editor'
import { config as elConfig } from './components/elements'
import { Element as SlateElement } from 'slate'

const needsData = (value: (CustomElement | CustomText)[]): boolean => {
  return value.some(
    node =>
      SlateElement.isElement(node) &&
      ((elConfig[node.type].dataRequired || []).some(
        // @ts-ignore
        requiredKey => !node[requiredKey]
      ) ||
        needsData(node.children))
  )
}

enum Step {
  Select,
  Populate,
  Edit
}

const getStep = (value: CustomDescendant[]): Step => {
  if (!value.length) return 0
  else if (needsData(value)) return 1
  return 2
}

const EditorOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [value, setValue] = useState<CustomDescendant[]>([])
  const [localStorageId, setLocalStorageId] = useState<string>()
  const step = getStep(value)
  const reset = () => {
    setValue([])
    setLocalStorageId(undefined)
  }

  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 695, minHeight: 0 }}>
      <OverlayToolbar title='Streams' onClose={onClose} />
      <OverlayBody>
        {
          {
            [Step.Select]: (
              <Select
                setValue={setValue}
                setLocalStorageId={setLocalStorageId}
              />
            ),
            [Step.Populate]: <Populate nodes={value} setNodes={setValue} />,
            [Step.Edit]: (
              <Editor
                value={value}
                setValue={setValue}
                reset={reset}
                localStorageId={localStorageId}
              />
            )
          }[step]
        }
      </OverlayBody>
    </Overlay>
  )
}

export default EditorOverlay
