import React, { useState } from 'react'
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
  onChange: (item) => void
  t: (string) => void
}

const IMAGE_SIZE = 64

const styles = {
  container: css({
    display: 'flex',
    marginBottom: 16,
    ':first-child': {
      marginTop: 16
    },
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
    marginRight: 16,
    backgroundColor: 'gray'
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
  }),
  description: css({
    ...fontStyles.sansSerifRegular15,
    margin: 0
  })
}

function GoodieOption({ option, onChange, t }: PledgeOptionComponentType) {
  const [goodieAmount, setGoodieAmount] = useState(option.defaultAmount)
  const [colorScheme] = useColorContext()
  const amountArray = Array.from({ length: option.maxAmount + 1 }, (v, i) => i)
  const dropdownItems = amountArray.map(amount => ({
    value: amount,
    text: amount
  }))
  const optionType = option.reward.__typename
  return (
    <>
      <div {...styles.container}>
        <div {...styles.info}>
          {option.reward.__typename === 'Goodie' && (
            <img
              {...styles.goodieImage}
              {...colorScheme.set('backgroundColor', 'hover')}
              src={`${CDN_FRONTEND_BASE_URL}/static/packages/${option.reward.name.toLowerCase()}.png`}
            />
          )}

          <div {...styles.text}>
            <p {...styles.label}>
              <>{`${t(
                `${optionType}/label/${option.reward.name}`
              )}, CHF ${option.price / 100} `}</>
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
            label='Anzahl'
            items={dropdownItems}
            value={goodieAmount}
            onChange={item => {
              console.log(item)
              setGoodieAmount(item.value)
              onChange(item.value)
            }}
          />
        </div>
      </div>
    </>
  )
}

export default GoodieOption
