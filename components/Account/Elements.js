import React from 'react'
import { css, merge } from 'glamor'

import withT from '../../lib/withT'
import { timeFormat } from '../../lib/utils/format'

import {
  colors,
  Interaction,
  Label,
  linkRule,
  fontStyles
} from '@project-r/styleguide'

const styles = {
  item: css({
    padding: 10,
    marginLeft: -10,
    marginRight: -10,
    marginBottom: 30
  }),
  itemHighlighted: css({
    backgroundColor: colors.primaryBg
  }),
  a: merge(linkRule, fontStyles.sansSerifMedium16),
  p: css({
    margin: 0,
    ...fontStyles.sansSerifRegular16
  })
}

const {H3} = Interaction

const hourFormat = timeFormat('%H:%M')
const dayFormat = timeFormat('%d. %B %Y')

export const Item = withT(({t, highlighted, title, createdAt, children}) => (
  <div {...styles.item} {...(highlighted && styles.itemHighlighted)}>
    <H3>
      {title}
    </H3>
    <Label>
      {t('account/item/label', {
        formattedDate: dayFormat(createdAt),
        formattedTime: hourFormat(createdAt)
      })}
    </Label>
    {children}
  </div>
))

export const A = ({children, ...props}) => <a {...props} {...styles.a}>{children}</a>
export const P = ({children, ...props}) => <p {...props} {...styles.p}>{children}</p>
