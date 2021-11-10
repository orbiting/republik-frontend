import React, { PropsWithChildren, useCallback, useMemo } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact } from 'slate-react'

import { config as elementsConfig } from '../elements'
import { FixedToolbar, HoveringToolbar } from './ui/Toolbar'
import { EditableElement } from './ui/Edit'
import { LeafComponent } from './Mark'
import {
  withBreaksDisabled,
  withElAttrsConfig,
  withNormalizations,
  withTemplate
} from './Element'
import { CustomDescendant, CustomElement } from '../../custom-types'
import Actions from './ui/Actions'
import { Label, plainButtonRule } from '@project-r/styleguide'
import { MdChevronLeft } from '@react-icons/all-files/md/MdChevronLeft'
import { css } from 'glamor'
import { withCharLimit } from './ui/CharCount'

const styles = {
  discreteButton: css({
    display: 'flex',
    marginBottom: 20,
    marginLeft: -5
  })
}

const Editor: React.FC<{
  value: CustomDescendant[]
  setValue: (t: CustomDescendant[]) => void
  reset: () => void
  localStorageId?: string
}> = ({ value, setValue, reset, localStorageId }) => {
  const editor = useMemo(
    () =>
      withTemplate(value as CustomElement[])(
        withCharLimit(
          withNormalizations(
            withBreaksDisabled(
              withElAttrsConfig(withReact(withHistory(createEditor())))
            )
          )
        )
      ),
    []
  )
  const containerRef = React.useRef<HTMLDivElement>(null)

  const RenderedElement: React.FC<PropsWithChildren<{
    element: CustomElement
  }>> = props => {
    const Component = elementsConfig[props.element.type].Component
    return (
      <EditableElement element={props.element}>
        <Component {...props} />
      </EditableElement>
    )
  }

  const renderElement = useCallback(RenderedElement, [])

  const renderLeaf = useCallback(props => <LeafComponent {...props} />, [])

  return (
    <div ref={containerRef}>
      <Label>
        <button {...plainButtonRule} {...styles.discreteButton} onClick={reset}>
          <MdChevronLeft size={16} style={{ marginTop: 1 }} />{' '}
          <span style={{ display: 'block' }}>Zurück</span>
        </button>
      </Label>
      <Slate
        editor={editor}
        value={value}
        onChange={newValue => setValue(newValue)}
      >
        <HoveringToolbar containerRef={containerRef} />
        <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
        <FixedToolbar />
      </Slate>
      <Actions value={value} reset={reset} localStorageId={localStorageId} />
    </div>
  )
}

export default Editor
