import React from 'react'
import { css } from 'glamor'
import { CustomElement, CustomText } from '../../../custom-types'

const styles = {
  placeholder: css({
    pointerEvents: 'none',
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
  const text = element.type
  return (
    <span {...styles.placeholder} contentEditable={false} data-text={text} />
  )
}
