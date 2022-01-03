import React, { useMemo, useState } from 'react'
import { css } from 'glamor'

import {
  mediaQueries,
  plainButtonRule,
  useColorContext,
  useMediaQuery,
  Field,
  fontStyles,
  Label
} from '@project-r/styleguide'

type RewardType = {
  name: string
  __typename: string
}

type SuggestionType = {
  price: number
  label: string
  description: string
  userPrice: boolean
  favorite?: boolean
}

type OptionType = {
  id?: string
  name: string
  reward: RewardType
  suggestions: SuggestionType[]
}

type Package = {
  name: string
  suggestedTotal?: number
  options: OptionType[]
}

type MembershipSelectorTypes = {
  pkg: Package
  onSuggestionSelect: (suggestion: SuggestionType) => void
  onOwnPriceSelect: (price: number) => void
  selectedSuggestion: SuggestionType
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
  onSuggestionSelect
}: MembershipSelectorTypes) => {
  const suggestions = useMemo(() => {
    const options = []
    pkg.options.forEach(option => options.push(...option.suggestions))
    return options
  }, [pkg])

  const favorite = useMemo(() => {
    return suggestions.find(v => v.favorite === true)
  }, [pkg])

  const [selectedSuggestion, setSelectedSuggestion] = useState(
    favorite || pkg.options[0].suggestions[0] || {}
  )
  const [ownPrice, setOwnPrice] = useState()

  const [colorScheme] = useColorContext()
  const isDesktop = useMediaQuery(mediaQueries.mUp)

  const buttonStyle = useMemo(
    () => ({
      default: css({
        backgroundColor: colorScheme.getCSSColor('hover'),
        '@media (hover)': {
          ':hover': {
            backgroundColor: colorScheme.getCSSColor('divider')
          }
        }
      }),
      selected: css({
        backgroundColor: colorScheme.getCSSColor('text'),
        color: colorScheme.getCSSColor('default')
      })
    }),
    []
  )

  return (
    <>
      <div {...styles.container}>
        {suggestions.map((suggestion: SuggestionType, index) => {
          const { price, label, description, userPrice } = suggestion
          const selected = label === selectedSuggestion.label
          return (
            <>
              <button
                key={label}
                {...plainButtonRule}
                {...styles.button}
                {...(selected ? buttonStyle.selected : buttonStyle.default)}
                onClick={() => {
                  setSelectedSuggestion(suggestion)
                  onSuggestionSelect(suggestion)
                }}
                style={{ order: index }}
              >
                <span {...styles.label}>{label}</span>
                {!userPrice && <span>CHF {price / 100}</span>}
              </button>
              <div
                {...styles.infocontainer}
                style={{
                  order: !isDesktop && index,
                  display: selected ? 'inherit' : 'none'
                }}
              >
                {userPrice && (
                  <Field
                    label='Betrag in CHF'
                    value={ownPrice || price}
                    onChange={(_, value) => {
                      suggestion.price = value
                      setSelectedSuggestion(suggestion)
                      setOwnPrice(value)
                      onSuggestionSelect(suggestion)
                    }}
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
