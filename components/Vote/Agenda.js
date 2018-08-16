import React from 'react'
import Done from 'react-icons/lib/md/check-circle'
import {
  A,
  Interaction,
  mediaQueries,
  colors
} from '@project-r/styleguide'
import { css } from 'glamor'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

const styles = {
  list: css({
    position: 'fixed',
    top: HEADER_HEIGHT_MOBILE,
    width: '100%',
    background: '#fff',
    [mediaQueries.lUp]: {
      position: 'fixed',
      left: 20,
      top: HEADER_HEIGHT + 100,
      width: 150
    }
  }),
  section: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: '',
    [mediaQueries.lUp]: {
      flexDirection: 'column'
    }
  }),
  item: css({
    ':after': {
      content: '\\00000a',
      whiteSpace: 'pre'
    }
  })
}

export const Agenda = ({ children }) => (
  <div {...styles.list}>
    <div {...styles.section}>{children}</div>
  </div>
)

export const AgendaSection = ({ title, children }) => (
  <div>
    <div>{title}</div>
    {children}
  </div>
)

export const AgendaItem = ({ done, label, anchor }) => (
  <span {...styles.item}>
    {done ? <Done /> : ''} <A href={`#${anchor}`}>{label}</A>
  </span>
)
