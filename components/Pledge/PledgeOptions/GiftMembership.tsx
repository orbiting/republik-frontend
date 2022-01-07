import React from 'react'
import { css } from 'glamor'
import {
  Checkbox,
  mediaQueries,
  fontStyles,
  Interaction,
  useColorContext
} from '@project-r/styleguide'
import { OptionType } from './MembershipOptions'

const styles = {
  container: css({
    display: 'flex',
    margin: '16px 0',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    }
  }),
  label: css(Interaction.fontRule, {
    flexGrow: 1,
    marginRight: 0,
    ...fontStyles.sansSerifRegular15,
    [mediaQueries.mUp]: {
      marginRight: 16,
      ...fontStyles.sansSerifRegular17
    },
    margin: 0
  }),
  selection: css({
    minWidth: 100,
    marginLeft: 16,
    [mediaQueries.mUp]: {
      marginLeft: 0
    }
  })
}

const GiftMembership = ({
  option,
  t
}: {
  option: OptionType
  t: (string) => string
}) => {
  const suggestion = option.suggestions[0]
  return (
    <div {...styles.container}>
      <p {...styles.label}>
        <strong>
          {t(`Goodie/label/${option.reward.name}`)}
          {`, CHF ${suggestion.price / 100}`}
        </strong>
        <br />
        {t(`Goodie/description/${option.reward.name}`)}
      </p>
      <div {...styles.selection}>
        <Checkbox
          label={t('Goodie/dropdown/label')}
          items={dropdownItems}
          value={String(value)}
          onChange={item => {
            onChange(+item.value)
          }}
        />
      </div>
    </div>
  )
}

export default GiftMembership
