import React from 'react'
import { css } from 'glamor'
import { CustomElement, CustomText } from '../../custom-types'
import { config as elementsConfig } from '../../elements'

const styles = {
  placeholder: css({
    pointerEvents: 'none',
    opacity: 0.333,
    ':empty::after': {
      content: 'attr(data-text)'
    }
  })
}

export const Placeholder: React.FC<{
  element: CustomElement
  leaf: CustomText
}> = ({ element, leaf }) => {
  const elementConfig = elementsConfig[element.type]
  const placeholder =
    leaf.placeholder || element.placeholder || elementConfig.placeholder
  return placeholder ? (
    <span
      {...styles.placeholder}
      contentEditable={false}
      data-text={placeholder}
    />
  ) : null
}
