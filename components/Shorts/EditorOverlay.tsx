import React, { useState } from 'react'
// @ts-ignore
import { Overlay, OverlayToolbar, OverlayBody } from '@project-r/styleguide'
import EditorApp from './components/editor'
import { TemplatePicker } from './components/templates'
import { CustomElement } from './components/custom-types'
import Drafts from './components/editor/ui/Drafts'

const EditorOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [template, setTemplate] = useState<CustomElement[]>()
  const [localStorageId, setLocalStorageId] = useState<string>()

  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 695, minHeight: 0 }}>
      <OverlayToolbar title='Streams' onClose={onClose} />
      <OverlayBody>
        {template ? (
          <EditorApp
            template={template}
            reset={() => {
              setTemplate(undefined)
              setLocalStorageId(undefined)
            }}
            localStorageId={localStorageId}
          />
        ) : (
          <>
            <TemplatePicker setTemplate={setTemplate} />
            <Drafts
              setTemplate={setTemplate}
              setLocalStorageId={setLocalStorageId}
            />
          </>
        )}
      </OverlayBody>
    </Overlay>
  )
}

export default EditorOverlay
