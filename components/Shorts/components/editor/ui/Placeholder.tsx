import React from 'react'
import { css } from 'glamor'
import { CustomElement, CustomText } from '../../../custom-types'
import { Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

const styles = {
  block: css({
    position: 'absolute',
    top: '0px',
    left: '0px',
    pointerEvents: 'none',
    opacity: 0.333
  }),
  inInline: css({
    cursor: 'text',
    opacity: 0.333,
    ':empty::after': {
      content: 'attr(data-text)'
    }
  })
}

// TODO: set the cursor on the slate element on click + hide placeholder
export const Placeholder: React.FC<{
  element: CustomElement
  leaf: CustomText
}> = ({ element, leaf }) => {
  const editor = useSlate()
  const path = ReactEditor.findPath(editor, element)
  const text = element.type.replace(/([A-Z])/g, ' $1').toLowerCase()
  return (
    <span
      {...styles.inInline}
      onClick={() => {
        // console.log(path)
        Transforms.select(editor, path)
      }}
      data-text={text}
    />
  )
}
