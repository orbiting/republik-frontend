import React from 'react'
import { css, useMemo } from 'glamor'
import {
  InlineSpinner,
  Checkbox,
  mediaQueries,
  Interaction,
  Label,
  fontStyles,
  useColorContext
} from '@project-r/styleguide'
import NewsletterIcon from './NewsletterIcon'

const ICON_SIZE = 32
const GAP_SIZE = 24

const styles = {
  row: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 24,
    gap: GAP_SIZE,
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    ':not(:last-child)': {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid'
    }
  }),
  iconTextCol: css({
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    gap: GAP_SIZE
  }),
  description: css({
    ...fontStyles.sansSerifRegular16,
    margin: '4px 0 8px 0'
  }),
  frequency: css({
    ...fontStyles.sansSerifMedium14
  }),
  spinnerWrapper: css({
    width: 24,
    display: 'inline-block',
    height: 0,
    marginLeft: 15,
    verticalAlign: 'middle',
    '& > span': {
      display: 'inline'
    }
  }),
  checkbox: css({
    marginLeft: ICON_SIZE + GAP_SIZE,
    [mediaQueries.mUp]: {
      width: 110,
      paddingTop: 4
    }
  })
}

const NewsletterItem = ({
  onChange,
  subscribed,
  mutating,
  name,
  t,
  status
}) => {
  const [colorScheme] = useColorContext()

  return (
    <div {...styles.row} {...colorScheme.set('borderColor', 'divider')}>
      <div {...styles.iconTextCol}>
        <NewsletterIcon name={name} size={32} />
        <div style={{ flex: 1 }}>
          <Interaction.H3>
            {t(`account/newsletterSubscriptions/${name}/label`)}
          </Interaction.H3>
          <p {...styles.description}>
            {t(`account/newsletterSubscriptions/${name}/description`)}
          </p>
          <Label
            {...styles.frequency}
            {...colorScheme.set('color', 'textSoft')}
          >
            {t(`account/newsletterSubscriptions/${name}/frequency`)}
          </Label>
        </div>
      </div>
      <div {...styles.checkbox}>
        <Checkbox
          checked={subscribed}
          disabled={mutating || status === 'unsubscribed'}
          onChange={onChange}
        >
          <span>
            {t(
              `account/newsletterSubscriptions/onlyName/${
                subscribed ? 'subscribed' : 'subscribe'
              }`
            )}
            <span {...styles.spinnerWrapper}>
              {mutating && <InlineSpinner size={24} />}
            </span>
          </span>
        </Checkbox>
      </div>
    </div>
  )
}

export default NewsletterItem
