import React from 'react'
import { css } from 'glamor'
import { CustomElement, CustomText } from '../../../custom-types'

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
  const text = element.type.replace(/([A-Z])/g, ' $1').toLowerCase()
  return <span {...styles.inInline} onClick={() => console.log(text)} data-text={text} />
}
