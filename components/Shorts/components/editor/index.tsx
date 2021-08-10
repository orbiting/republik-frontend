import React, { useCallback, useMemo, useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, Editable, withReact, useSlate } from 'slate-react'

import { config as elementsConfig } from '../elements'
import { FixedToolbar, HoveringToolbar } from './ui/Toolbar'
import { EditableElement } from './ui/Edit'
import { LeafComponent } from './Mark'
import {
  withCharCount,
  withElementsAttrs,
  withNormalizations,
  withTemplate
} from './Element'
import { CustomElement, CustomElementsType } from '../custom-types'
import Actions from './ui/Actions'
// @ts-ignore
import { Label, plainButtonRule, mediaQueries } from '@project-r/styleguide'
import { MdChevronLeft } from '@react-icons/all-files/md/MdChevronLeft'
import { css } from 'glamor'

const styles = {
  container: css({
    paddingTop: 10,
    paddingBottom: 60,
    [mediaQueries.mUp]: {
      paddingTop: 20,
      paddingBottom: 120
    }
  }),
  discreteButton: css({
    display: 'block',
    marginBottom: 20,
    [mediaQueries.mUp]: {
      marginBottom: 40
    }
  })
}

const EditorApp: React.FC<{ template: CustomElement[]; reset: () => void }> = ({
  template,
  reset
}) => {
  const editor = useMemo(
    () =>
      withTemplate(template)(
        withCharCount(
          withNormalizations(
            withElementsAttrs(withReact(withHistory(createEditor())))
          )
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

  // @ts-ignore
  const ActionsT = Actions as React.FC<{
    value: Descendant[]
    reset: () => void
  }>

  return (
    <div {...styles.container}>
      <Label>
        <button {...plainButtonRule} {...styles.discreteButton} onClick={reset}>
          <MdChevronLeft size={16} /> Zurück
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
      <ActionsT value={value} reset={reset} />
    </div>
  )
}

export default EditorApp
