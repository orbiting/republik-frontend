import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { Transforms, Element as SlateElement } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { css } from 'glamor'
import { Field, useColorContext } from '@project-r/styleguide'
import { hasAncestor } from '../../Styleguide/Callout'
import { config as elementsConfig } from '../../elements'
import { CustomElement } from '../../../custom-types'

const styles = {
  boxWrapper: css({
    position: 'absolute',
    display: 'block',
    width: '100%',
    zIndex: 10,
    marginTop: 5
  }),
  box: css({
    padding: 10,
    display: 'block'
  }),
  arrow: css({
    position: 'absolute',
    top: 30,
    width: 2,
    height: 20,
    left: '50%',
    zIndex: 10
  })
}

export const EditableElement: React.FC<{
  element: CustomElement
  children: ReactElement
}> = ({ element, children }) => {
  const [isEdit, edit] = useState(false)
  const editRef = React.useRef<HTMLDivElement | HTMLSpanElement>(null)

  const handleClick = (event: MouseEvent) => {
    if (!hasAncestor(event.target, node => node === editRef.current)) {
      edit(false)
    }
  }

  React.useEffect(() => {
    if (!isEdit) return
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [isEdit])

  const elementConfig = elementsConfig[element.type]
  if (!elementConfig || !elementConfig.attrs?.editUi) {
    return <>{children}</>
  }

  const EditableContent = (
    <>
      {children}
      {isEdit && <EditBox element={element} />}
    </>
  )

  return React.createElement(
    elementConfig.attrs?.isInline ? 'span' : 'div',
    {
      contentEditable: !isEdit,
      onDoubleClick: (event: MouseEvent) => {
        event.preventDefault()
        edit(true)
      },
      ref: editRef
    },
    EditableContent
  )
}

const EditField: React.FC<{
  storedValue: any
  label: string
  update: (v: any) => void
}> = ({ storedValue, update, label }) => {
  const [value, setValue] = useState(storedValue)
  useEffect(() => setValue(storedValue), [storedValue])
  return (
    <Field
      value={value}
      onChange={(e: ChangeEvent, changedValue: any): void =>
        setValue(changedValue)
      }
      renderInput={(props: any) => (
        <input
          {...props}
          onBlur={() => {
            update(value)
          }}
        />
      )}
      label={label}
    />
  )
}

export const EditBox: React.FC<{
  element: CustomElement
}> = ({ element }) => {
  const [colorScheme] = useColorContext()
  const editor = useSlate()
  const elementKeys: (keyof CustomElement)[] = Object.keys(
    element
  ) as (keyof CustomElement)[]
  const editableKeys = elementKeys.filter(
    key => key !== 'children' && key !== 'type'
  )
  if (!editableKeys.length) {
    return null
  }
  return (
    <span
      {...styles.boxWrapper}
      {...colorScheme.set('backgroundColor', 'overlay')}
      {...colorScheme.set('boxShadow', 'overlayShadow')}
    >
      <span {...styles.box}>
        {editableKeys.map(k => (
          <EditField
            key={k}
            storedValue={element[k]}
            update={(changedValue: any): void => {
              const path = ReactEditor.findPath(editor, element)
              const newProperties: Partial<SlateElement> = {
                [k]: changedValue
              }
              Transforms.setNodes(editor, newProperties, { at: path })
            }}
            label={k}
          />
        ))}
      </span>
    </span>
  )
}
