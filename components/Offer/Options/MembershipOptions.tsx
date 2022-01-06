import React, { useMemo, useState } from 'react'
import { css } from 'glamor'

import {
  mediaQueries,
  plainButtonRule,
  useColorContext,
  useMediaQuery,
  Field,
  Label
} from '@project-r/styleguide'

type RewardType = {
  name: string
  __typename: string
  minPeriods: number
  maxPeriods: number
  defaultPeriods: number
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
  minAmount?: number
  maxAmount?: number
  defaultAmount?: number
  suggestions: SuggestionType[]
}

type Package = {
  name: string
  suggestedTotal?: number
  options: OptionType[]
}

type MembershipSelectorTypes = {
  pkg: Package
  onSuggestionSelect: ({
    suggestion: SuggestionType,
    selectedPrice: number
  }) => void
  onOwnPriceSelect: (price: number) => void
  selectedSuggestion: SuggestionType
}

const styles = {
  suggestionsContainer: css({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
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
  infocontainer: css({
    padding: '8px 0px 16px 0px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    order: 9
  }),
  fieldContainer: css({
    display: 'flex',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      gap: 24
    }
  })
}

const MembershipSelector = ({
  pkg,
  onSuggestionSelect
}: MembershipSelectorTypes) => {
  const options = useMemo(() => {
    return pkg.options.filter(option => option.reward?.__typename !== 'Goodie')
  }, [pkg])

  const suggetions = useMemo(() => {
    return options.map(option => option.suggestions)
  }, [options]).flat()

  const favoriteSuggestion = useMemo(() => {
    return suggetions.find(suggestion => suggestion.favorite === true)
  }, [suggetions])

  const requiresPeriodSelector = options.some(
    option => option.reward?.minPeriods !== option.reward?.maxPeriods
  )

  const requiresAmountSelector = options.some(
    option => option.minAmount !== option.maxAmount
  )

  const [selectedSuggestion, setSelectedSuggestion] = useState(
    favoriteSuggestion || pkg.options[0].suggestions[0]
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
      <div {...styles.suggestionsContainer}>
        {suggetions.map((suggestion: SuggestionType, index) => {
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
                  onSuggestionSelect({
                    suggestion,
                    selectedPrice: suggestion.price
                  })
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
                    value={(ownPrice && ownPrice / 100) || price / 100}
                    renderInput={props => (
                      <input inputMode='numeric' {...props} />
                    )}
                    onChange={(_, value) => {
                      setSelectedSuggestion(suggestion)
                      setOwnPrice(value * 100)
                      onSuggestionSelect({
                        suggestion,
                        selectedPrice: value * 100
                      })
                    }}
                  />
                )}
                <Label>{description}</Label>
              </div>
            </>
          )
        })}
      </div>
      {requiresPeriodSelector || requiresAmountSelector ? (
        <div {...styles.fieldContainer}>
          {options.map(option => (
            <>
              {option.minAmount !== option.maxAmount && (
                <Field
                  label={'Anzahl Geschenitgliedschaften'}
                  value={option.defaultAmount}
                  renderInput={props => (
                    <input inputMode='numeric' {...props} />
                  )}
                />
              )}
              {option.reward?.minPeriods !== option.reward?.maxPeriods && (
                <Field
                  label={'Anzahl Monate'}
                  value={option.reward.defaultPeriods}
                  renderInput={props => (
                    <input inputMode='numeric' {...props} />
                  )}
                />
              )}
            </>
          ))}
        </div>
      ) : null}
    </>
  )
}

export default MembershipSelector
