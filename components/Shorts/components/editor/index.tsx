import React, { useCallback, useMemo, useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact } from 'slate-react'

import { config as elementsConfig } from '../elements'
import { FixedToolbar, HoveringToolbar } from './ui/Toolbar'
import { EditableElement } from './ui/Edit'
import { LeafComponent } from './Mark'
import {
  withBreaksDisabled,
  withCharCount,
  withElementsAttrs,
  withNormalizations,
  withTemplate
} from './Element'
import { CustomElement, CustomElementsType } from '../custom-types'
import Actions from './ui/Actions'
// @ts-ignore
import { Label, plainButtonRule } from '@project-r/styleguide'
import { MdChevronLeft } from '@react-icons/all-files/md/MdChevronLeft'
import { css } from 'glamor'

const styles = {
  discreteButton: css({
    display: 'flex',
    marginBottom: 20,
    marginLeft: -5
  })
}

const EditorApp: React.FC<{
  template: CustomElement[]
  reset: () => void
  localStorageId?: string
}> = ({ template, reset, localStorageId }) => {
  const editor = useMemo(
    () =>
      withTemplate(template)(
        withCharCount(
          withNormalizations(
            withBreaksDisabled(
              withElementsAttrs(withReact(withHistory(createEditor())))
            )
          )
        )
      ),
    []
  )
  const [value, setValue] = useState<Descendant[]>(template)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const renderElement = useCallback(props => {
    const Component =
      elementsConfig[props.element.type as CustomElementsType].Component
    return (
      <EditableElement element={props.element}>
        <Component {...props} />
      </EditableElement>
    )
  }, [])

  const renderLeaf = useCallback(props => <LeafComponent {...props} />, [])

  // @ts-ignore
  const ActionsT = Actions as React.FC<{
    value: Descendant[]
    reset: () => void
    localStorageId?: string
  }>

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
      <ActionsT value={value} reset={reset} localStorageId={localStorageId} />
    </div>
  )
}

export default EditorApp
