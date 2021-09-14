import React, { useState } from 'react'
// @ts-ignore
import { Overlay, OverlayToolbar, OverlayBody, Interaction } from '@project-r/styleguide'
import EditorApp from './components/editor'
import { TemplatePicker } from './components/templates'
import { CustomElement } from './components/custom-types'
import Drafts from './components/editor/ui/Drafts'
import ImageInput from './components/Publikator/ImageInput'

const needsData = (template: CustomElement[]): boolean => {
  const lastEl = template[template.length - 1]
  return (
    lastEl.type === 'figure' &&
    lastEl.children[0].type === 'figureImage' &&
    !lastEl.children[0].src
  )
}

const EditorOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [template, setTemplate] = useState<CustomElement[]>()
  const [localStorageId, setLocalStorageId] = useState<string>()

  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 695, minHeight: 0 }}>
      <OverlayToolbar title='Streams' onClose={onClose} />
      <OverlayBody>
        {template && needsData(template) ? (
          <div>
            <ImageInput
              onChange={(_: any, src: string) => {
                setTemplate(
                  template.map(el =>
                    el.type === 'figure'
                      ? {
                          ...el,
                          children: el.children.map(child =>
                            child.type === 'figureImage'
                              ? { ...child, src }
                              : child
                          )
                        }
                      : el
                  )
                )
              }}
            />
          </div>
        ) : template ? (
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
