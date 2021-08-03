import React, { MouseEvent, ReactElement, Ref, useEffect, useRef } from 'react'
// @ts-ignore
import ReactDOM from 'react-dom'
import { css } from 'glamor'

// @ts-ignore
import { useColorContext } from '@project-r/styleguide'
import IconButton from '../../Styleguide/IconButton'

import { MarkButton } from '../Mark'
import { ElementButton } from '../Element'
import {
  ButtonI,
  CustomEditor,
  CustomElement,
  CustomElementsType
} from '../../custom-types'
import { config as elConfig } from '../../elements'
import { configKeys as mKeys } from '../../marks'
import { useSlate, ReactEditor } from 'slate-react'
import {
  Editor,
  Text,
  Node,
  Range,
  Element as SlateElement,
  BasePoint
} from 'slate'

const styles = {
  fixedToolbar: css({
    display: 'flex',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 10
  }),
  hoveringToolbar: css({
    padding: '8px 7px 6px',
    position: 'absolute',
    zIndex: 1,
    top: 10000,
    left: -10000,
    marginTop: -6,
    opacity: 0,
    display: 'flex',
    transition: 'opacity 0.75s'
  }),
  buttonGroup: css({
    display: 'flex'
  })
}

export const ToolbarButton: React.FC<{
  button: ButtonI
  onClick: () => void
  fill: string
}> = ({ button, onClick, fill }) => (
  <IconButton
    // @ts-ignore
    fillColorName={fill}
    onMouseDown={(event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      onClick()
    }}
    Icon={button.icon}
    size={button.small ? 12 : 19}
  />
)

export const FixedToolbar = () => {
  const [colorScheme] = useColorContext()
  return (
    <div
      {...styles.fixedToolbar}
      {...colorScheme.set('borderBottomColor', 'divider')}
    >
      <div {...styles.buttonGroup} style={{ marginLeft: 'auto' }}>
        {['break' as CustomElementsType].map(elKey => (
          <ElementButton key={elKey} elKey={elKey} />
        ))}
      </div>
    </div>
  )
}

export const FormattingToolbar = React.forwardRef(
  (props, ref: Ref<HTMLDivElement>) => {
    const [colorScheme] = useColorContext()
    return (
      <div
        ref={ref}
        {...colorScheme.set('backgroundColor', 'overlay')}
        {...colorScheme.set('boxShadow', 'overlayShadow')}
        {...styles.hoveringToolbar}
      >
        {mKeys.map(mKey => (
          <MarkButton key={mKey} mKey={mKey} />
        ))}
        {['link' as CustomElementsType].map(elKey => (
          <ElementButton key={elKey} elKey={elKey} />
        ))}
      </div>
    )
  }
)

export const Portal: React.FC<{ children: ReactElement }> = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

const getParentElement = (
  editor: CustomEditor,
  anchor: BasePoint,
  focus: BasePoint
): CustomEditor | CustomElement => {
  let [parentElement] = Node.common(
    editor,
    Editor.path(editor, anchor),
    Editor.path(editor, focus)
  )
  if (Text.isText(parentElement)) {
    parentElement = Node.parent(editor, Editor.path(editor, anchor))
  }
  return parentElement
}

export const HoveringToolbar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useSlate()

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
      !selection ||
      Range.isCollapsed(selection) ||
      !ReactEditor.isFocused(editor) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const parentElement = getParentElement(
      editor,
      selection.anchor,
      selection.focus
    )
    if (
      !SlateElement.isElement(parentElement) ||
      !elConfig[parentElement.type].attrs?.formatText
    ) {
      el.removeAttribute('style')
      return
    }

    const rect = window
      .getSelection()
      ?.getRangeAt(0)
      ?.getBoundingClientRect()
    if (!rect) return
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${rect.left +
      window.pageXOffset -
      el.offsetWidth / 2 +
      rect.width / 2}px`
  })

  return (
    <Portal>
      <FormattingToolbar ref={ref} />
    </Portal>
  )
}
