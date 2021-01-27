import React, { Fragment } from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'
import { timeFormat } from '../../lib/utils/format'

import {
  Interaction,
  Label,
  fontStyles,
  useColorContext
} from '@project-r/styleguide'

const styles = {
  item: css({
    padding: 10,
    marginLeft: -10,
    marginRight: -10,
    marginBottom: 30
  }),
  p: css({
    margin: 0,
    ...fontStyles.sansSerifRegular16
  })
}

const { H3 } = Interaction

const hourFormat = timeFormat('%H:%M')
const dayFormat = timeFormat('%d. %B %Y')

export const Item = withT(
  ({ t, highlighted, title, createdAt, children, compact }) => {
    const [colorScheme] = useColorContext()
    return (
      <div
        {...styles.item}
        {...colorScheme.set(
          'backgroundColor',
          highlighted ? 'alert' : 'default'
        )}
        style={{ marginBottom: compact ? 0 : undefined }}
      >
        <H3>{title}</H3>
        {!compact && (
          <Fragment>
            <Label>
              {t('account/item/label', {
                formattedDate: dayFormat(createdAt),
                formattedTime: hourFormat(createdAt)
              })}
            </Label>
            <br />
          </Fragment>
        )}
        {children}
      </div>
    )
  }
)

export const P = ({ children, ...props }) => (
  <p {...props} {...styles.p}>
    {children}
  </p>
)

export const Hint = ({ t, tKey }) => {
  const [colorScheme] = useColorContext()
  return (
    <Label
      style={{
        marginTop: -10,
        marginBottom: 10,
        display: 'block',
        color: colorScheme.getCSSColor('disabled')
      }}
    >
      {t(tKey)}
    </Label>
  )
}
