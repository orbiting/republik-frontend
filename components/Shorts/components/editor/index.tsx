import React, { useCallback, useMemo, useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact } from 'slate-react'

import { config as elementsConfig } from '../elements'
import { FixedToolbar, HoveringToolbar } from './ui/Toolbar'
import { EditableElement } from './ui/Edit'
import { LeafComponent } from './Mark'
import { withElementsAttrs, withNormalizations, withTemplate } from './Element'
import { CustomElement, CustomElementsType } from '../custom-types'
import Actions from './ui/Actions'
// @ts-ignore
import { Label, plainButtonRule } from '@project-r/styleguide'
import { MdChevronLeft } from '@react-icons/all-files/md/MdChevronLeft'
import { css } from 'glamor'

const styles = {
  discreteButton: css({
    display: 'block',
    marginBottom: 30
  })
}

const EditorApp: React.FC<{ template: CustomElement[]; reset: () => void }> = ({
  template,
  reset
}) => {
  const editor = useMemo(
    () =>
      withTemplate(template)(
        withNormalizations(
          withElementsAttrs(withReact(withHistory(createEditor())))
        )
      ),
    []
  )
  const [value, setValue] = useState<Descendant[]>(template)

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

  return (
    <>
      <Label>
        <button {...plainButtonRule} {...styles.discreteButton} onClick={reset}>
          <MdChevronLeft size={16} /> Züruck
        </button>
      </Label>
      <Slate
        editor={editor}
        value={value}
        onChange={newValue => setValue(newValue)}
      >
        <HoveringToolbar />
        <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
        <FixedToolbar />
      </Slate>
      <Actions value={value} reset={reset} />
    </>
  )
}

export default EditorApp
