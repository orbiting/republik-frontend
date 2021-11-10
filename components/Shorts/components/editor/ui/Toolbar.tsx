import React, {
  MouseEvent,
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react'
import ReactDOM from 'react-dom'
import { css } from 'glamor'
import { useColorContext, Label } from '@project-r/styleguide'
import IconButton from '../../Styleguide/IconButton'
import { MarkButton } from '../Mark'
import { ElementButton } from '../Element'
import {
  ButtonI,
  CustomEditor,
  CustomElement,
  ToolbarType
} from '../../../custom-types'
import { config as elConfig, configKeys as elKeys } from '../../elements'
import { config as mConfig, configKeys as mKeys } from '../../marks'
import { useSlate, ReactEditor } from 'slate-react'
import {
  Editor,
  Range,
  Element as SlateElement,
  BasePoint,
  Node,
  Text
} from 'slate'
import { CharCount } from './CharCount'

const styles = {
  fixedToolbar: css({
    display: 'flex',
    width: '100%',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    paddingTop: 10,
    marginTop: 20
  }),
  hoveringToolbar: css({
    padding: '8px 7px 6px',
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    overflow: 'hidden',
    marginTop: -6,
    opacity: 0,
    display: 'flex',
    transition: 'opacity 0.75s'
  }),
  buttonGroup: css({
    display: 'flex'
  })
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

const allowsHoveringToolbar = (
  editor: CustomEditor,
  selection: Range
): boolean => {
  const parentElement = getParentElement(
    editor,
    selection.anchor,
    selection.focus
  )
  return (
    SlateElement.isElement(parentElement) &&
    !!elConfig[parentElement.type].attrs?.formatText
  )
}

const hasVisibleSelection = (editor: CustomEditor, selection: Range): boolean =>
  !Range.isCollapsed(selection) &&
  ReactEditor.isFocused(editor) &&
  Editor.string(editor, selection) !== ''

const showHoveringToolbar = (editor: CustomEditor): boolean => {
  const { selection } = editor
  return (
    !!selection &&
    hasVisibleSelection(editor, selection) &&
    allowsHoveringToolbar(editor, selection)
  )
}

const calcHoverPosition = (
  element: HTMLDivElement,
  container: HTMLDivElement | null
): {
  top?: number
  left?: number
} => {
  const rect = window
    .getSelection()
    ?.getRangeAt(0)
    ?.getBoundingClientRect()
  if (!rect) return {}

  const top = rect.top + window.pageYOffset - element.offsetHeight
  const centered = rect.left - element.offsetWidth / 2 + rect.width / 2
  const left = container
    ? Math.min(
        container.getBoundingClientRect().right - // right edge
          element.getBoundingClientRect().width,
        Math.max(
          container.getBoundingClientRect().left, // left edge
          centered
        )
      )
    : centered

  return {
    top,
    left
  }
}

export const ToolbarButton: React.FC<{
  button: ButtonI
  onClick: () => void
  disabled?: boolean
}> = ({ button, onClick, disabled }) => (
  <IconButton
    fillColorName={disabled ? 'textSoft' : 'text'}
    onMouseDown={(event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      onClick()
    }}
    Icon={button.icon}
    size={button.small ? 12 : 19}
  />
)

const ToolbarButtons: React.FC<{ type: ToolbarType }> = ({ type }) => (
  <>
    {mKeys
      .filter(mKey => mConfig[mKey]?.button?.toolbar === type)
      .map(mKey => (
        <MarkButton key={mKey} mKey={mKey} />
      ))}
    {elKeys
      .filter(elKey => elConfig[elKey]?.button?.toolbar === type)
      .map(elKey => (
        <ElementButton key={elKey} elKey={elKey} />
      ))}
  </>
)

export const FixedToolbar: React.FC = () => {
  const editor = useSlate()
  const [colorScheme] = useColorContext()
  const [hasSelection, setSelection] = useState<boolean>(false)
  useEffect(() => {
    const { selection } = editor
    setSelection(!!selection)
  })
  return (
    <div
      {...styles.fixedToolbar}
      {...colorScheme.set('borderTopColor', hasSelection ? 'text' : 'divider')}
    >
      <Label>
        <CharCount />
      </Label>
      <div {...styles.buttonGroup} style={{ marginLeft: 'auto' }}>
        <ToolbarButtons type='fixed' />
      </div>
    </div>
  )
}

export const Portal: React.FC<{ children: ReactElement }> = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const HoveringToolbar: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>
}> = ({ containerRef }) => {
  const [colorScheme] = useColorContext()
  const ref = useRef<HTMLDivElement>(null)
  const editor = useSlate()

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    if (showHoveringToolbar(editor)) {
      const { top, left } = calcHoverPosition(el, containerRef.current)
      el.style.opacity = '1'
      el.style.width = 'auto'
      el.style.height = 'auto'
      el.style.left = `${left}px`
      el.style.top = `${top}px`
    } else {
      el.removeAttribute('style')
    }
  })

  return (
    <Portal>
      <div
        ref={ref}
        {...colorScheme.set('backgroundColor', 'overlay')}
        {...colorScheme.set('boxShadow', 'overlayShadow')}
        {...styles.hoveringToolbar}
      >
        <ToolbarButtons type='hovering' />
      </div>
    </Portal>
  )
}
