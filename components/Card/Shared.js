import React from 'react'
import { css } from 'glamor'

import {
  Interaction
} from '@project-r/styleguide'

const styles = {
  p: css(Interaction.fontRule, {
    margin: '0 0 5px',
    fontSize: 15,
    lineHeight: '22px',
    '& small': {
      display: 'block',
      fontSize: 10,
      lineHeight: '16px'
    }
  }),
  ul: css({
    margin: 0,
    marginTop: -3,
    paddingLeft: 20,
    fontSize: 15,
    lineHeight: '22px'
  })
}

export const Paragraph = ({ children }) => <p {...styles.p}>{children}</p>
export const UL = ({ children }) => <ul {...styles.ul}>{children}</ul>
