import React from 'react'
import { css } from 'glamor'
import {
  Dropdown,
  mediaQueries,
  fontStyles,
  RawHtml,
  Label,
  useColorContext
} from '@project-r/styleguide'
import { PledgeOptionType } from './GoodieOptions'
import { CDN_FRONTEND_BASE_URL } from '../../../lib/constants'

type PledgeOptionComponentType = {
  option: PledgeOptionType
  value: number
  onChange: (item) => void
  t: (string) => void
}

const IMAGE_SIZE = 64

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
  info: css({
    display: 'flex',
    flexDirection: 'row'
  }),
  selection: css({
    minWidth: 100,
    marginLeft: IMAGE_SIZE + 16,
    [mediaQueries.mUp]: {
      marginLeft: 0
    }
  }),
  goodieImage: css({
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 16
  }),
  text: css({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginRight: 0,
    [mediaQueries.mUp]: {
      marginRight: 16
    }
  }),
  label: css({
    ...fontStyles.sansSerifMedium19,
    margin: 0
  })
}

function GoodieOption({
  value,
  option,
  onChange,
  t
}: PledgeOptionComponentType) {
  const [colorScheme] = useColorContext()
  const amounts = Array.from(
    { length: option.maxAmount - option.minAmount + 1 },
    (_, index) => index + option.minAmount
  )
  const dropdownItems = amounts.map(amount => ({
    value: amount,
    text: amount
  }))
  const optionType = option.reward.__typename
  return (
    <>
      <div {...styles.container}>
        <div {...styles.info}>
          <img
            {...styles.goodieImage}
            {...colorScheme.set('backgroundColor', 'hover')}
            src={`${CDN_FRONTEND_BASE_URL}/static/packages/${option.reward.name.toLowerCase()}.png`}
          />

          <div {...styles.text}>
            <p {...styles.label}>
              {t(`${optionType}/label/${option.reward.name}`)}
              {`, CHF ${option.price / 100}`}
            </p>
            <RawHtml
              type={Label}
              error={false}
              dangerouslySetInnerHTML={{
                __html: t(`${optionType}/description/${option.reward.name}`)
              }}
            />
          </div>
        </div>
        <div {...styles.selection}>
          <Dropdown
            label={t(`${optionType}/dropdown/lable`)}
            items={dropdownItems}
            value={value}
            onChange={item => {
              onChange(item.value)
            }}
          />
        </div>
      </div>
    </>
  )
}

export default GoodieOption
