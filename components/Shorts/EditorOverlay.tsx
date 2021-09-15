import React, { useState } from 'react'
// @ts-ignore
import { Overlay, OverlayToolbar, OverlayBody } from '@project-r/styleguide'
import { CustomElement, CustomText } from './components/custom-types'
import Select from './components/editor/ui/Select'
import Populate from './components/editor/ui/Populate'
import Editor from './components/editor'
import { config as elConfig } from './components/elements'
import { Element as SlateElement } from 'slate'

const needsData = (value: (CustomElement | CustomText)[]): boolean =>
  value.some(
    node =>
      SlateElement.isElement(node) &&
      ((elConfig[node.type].needsData && elConfig[node.type].needsData(node)) ||
        needsData(node.children))
  )

enum Step {
  Select,
  Populate,
  Edit
}

const getStep = (value: CustomElement[]): Step => {
  if (!value.length) return 0
  else if (needsData(value)) return 1
  return 2
}

const EditorOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [initValue, setInitValue] = useState<CustomElement[]>([])
  const [localStorageId, setLocalStorageId] = useState<string>()
  const step = getStep(initValue)
  const reset = () => {
    setInitValue([])
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
                setInitValue={setInitValue}
                setLocalStorageId={setLocalStorageId}
              />
            ),
            [Step.Populate]: (
              <Populate
                nodes={initValue}
                setNodes={v => setInitValue(v as CustomElement[])}
              />
            ),
            [Step.Edit]: (
              <Editor
                initValue={initValue}
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
