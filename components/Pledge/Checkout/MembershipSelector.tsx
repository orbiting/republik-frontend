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

type VariantType = {
  price: number
  label: string
  description: string
  ownPrice: boolean
  suggested?: boolean
}

type OptionType = {
  id?: string
  name: string
  reward: RewardType
  variants: VariantType[]
}

type Package = {
  name: string
  suggestedTotal?: number
  options: OptionType[]
}

type MembershipSelectorTypes = {
  pkg: Package
  onVariantSelect: (variant: VariantType) => void
  onOwnPriceSelect: (price: number) => void
  selectedVariant: VariantType
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
    width: '100%',
    order: 9
  })
}

const MembershipSelector = ({
  pkg,
  onVariantSelect,
  onOwnPriceSelect,
  selectedVariant
}: MembershipSelectorTypes) => {
  const [colorScheme] = useColorContext()
  const isDesktop = useMediaQuery(mediaQueries.mUp)

  const membershipVariants = useMemo(() => {
    // necessary for PROLONG, which has both BENEFACTOR and ABO options
    const options = []
    pkg.options.forEach(option => options.push(...option.variants))
    return options
  }, [pkg])

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
        {membershipVariants.map((variant: VariantType, index) => {
          const { price, label, description, ownPrice } = variant
          const selected = label === selectedVariant.label
          return (
            <>
              <button
                key={label}
                {...plainButtonRule}
                {...styles.button}
                {...(selected ? selectedButtonStyle : buttonStyle)}
                onClick={() => onVariantSelect(variant)}
                style={{ order: index }}
              >
                <span {...styles.label}>{label}</span>
                {!ownPrice && <span>CHF {price / 100}</span>}
              </button>
              <div
                {...styles.infocontainer}
                style={{
                  order: !isDesktop && index,
                  display: selected ? 'inherit' : 'none'
                }}
              >
                {ownPrice && (
                  <Field
                    label='Betrag in CHF'
                    value={price / 100}
                    onChange={onOwnPriceSelect}
                  />
                )}
                <Label>{description}</Label>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default MembershipSelector
