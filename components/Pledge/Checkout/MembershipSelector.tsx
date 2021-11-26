import React, { useMemo } from 'react'
import { css } from 'glamor'
import Link from 'next/link'

import {
  mediaQueries,
  plainButtonRule,
  useColorContext,
  useMediaQuery,
  Field,
  fontStyles,
  Editorial,
  Label
} from '@project-r/styleguide'

type RewardType = {
  name: string
  __typename: string
}

type OptionType = {
  id?: string
  label: string
  reward: RewardType
  price: number
  userPrice?: boolean
  minUserPrice?: number
  suggestedPrice?: number
  description?: string
}

type MembershipSelectorTypes = {
  membershipOptions: OptionType[]
  onMembershipSelect: (option: OptionType) => void
  onOwnPriceSelect: (price: number) => void
  selectedMembershipOption: OptionType
}

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 24,
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    }
  }),
  button: css({
    flex: 1,
    padding: 12,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    [mediaQueries.mUp]: {
      flexDirection: 'column'
    },
    ':not(:first-of-type)': {
      marginTop: 4,
      [mediaQueries.mUp]: {
        margin: '0px 0px 0px 4px'
      }
    }
  }),
  label: css({
    paddingRight: 6,
    [mediaQueries.mUp]: {
      paddingRight: 0
    }
  }),
  selectedLabel: css({
    ...fontStyles.sansSerifMedium
  }),
  infocontainer: css({
    padding: '8px 0px 16px 0px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  })
}

const MembershipSelector = ({
  membershipOptions,
  onMembershipSelect,
  onOwnPriceSelect,
  selectedMembershipOption
}: MembershipSelectorTypes) => {
  const [colorScheme] = useColorContext()
  const isDesktop = useMediaQuery(mediaQueries.mUp)
  const buttonStyle = useMemo(
    () =>
      css({
        backgroundColor: colorScheme.getCSSColor('hover'),
        '@media (hover)': {
          ':hover': {
            backgroundColor: colorScheme.getCSSColor('divider')
          }
        }
      }),
    []
  )
  const selectedButtonStyle = useMemo(
    () =>
      css({
        backgroundColor: colorScheme.getCSSColor('text'),
        color: colorScheme.getCSSColor('default')
      }),
    []
  )
  return (
    <>
      <div {...styles.container}>
        {membershipOptions.map((option: OptionType, index) => {
          const selected = option.label === selectedMembershipOption.label
          return (
            <>
              <button
                key={option.id}
                {...plainButtonRule}
                {...styles.button}
                {...(selected ? selectedButtonStyle : buttonStyle)}
                onClick={() => onMembershipSelect(option)}
                style={{ order: index }}
              >
                <span {...styles.label}>{option.label}</span>
                {!option.userPrice && <span>CHF {option.price / 100}</span>}
              </button>
              <div
                {...styles.infocontainer}
                style={{
                  order: isDesktop ? 3 : index,
                  display: selected ? 'inherit' : 'none'
                }}
              >
                {option.userPrice && (
                  <Field
                    label='Betrag in CHF'
                    value={option.suggestedPrice / 100}
                    onChange={onOwnPriceSelect}
                  />
                )}
                <Label>{option.description}</Label>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default MembershipSelector
