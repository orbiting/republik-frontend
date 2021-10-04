import React, { useCallback, useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact } from 'slate-react'

import { config as elementsConfig } from '../elements'
import { FixedToolbar, HoveringToolbar } from './ui/Toolbar'
import { EditableElement } from './ui/Edit'
import { LeafComponent } from './Mark'
import {
  withBreaksDisabled,
  withCharLimit,
  withElementsAttrs,
  withNormalizations,
  withTemplate
} from './Element'
import {
  CustomDescendant,
  CustomElement,
  CustomElementsType
} from '../custom-types'
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
              withElementsAttrs(withReact(withHistory(createEditor())))
            )
          )
        )
      ),
    []
  )
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

export default Editor
