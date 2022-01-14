import React, { useMemo, useState } from 'react'
import { css } from 'glamor'
import { descending } from 'd3-array'
import {
  mediaQueries,
  plainButtonRule,
  useColorContext,
  useMediaQuery,
  Field,
  Interaction,
  fontStyles
} from '@project-r/styleguide'

import FieldSet from '../../FieldSet'
import {
  getOptionFieldKey,
  getOptionPeriodsFieldKey,
  getOptionValue
} from '../CustomizePackage'
import {
  OptionType,
  SuggestionType,
  FieldSetValues
} from './PledgeOptionsTypes'

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
  label: css(Interaction.fontRule, {
    margin: 0,
    paddingRight: 6,
    ...fontStyles.sansSerifRegular15,
    lineHeight: '18px',
    [mediaQueries.mUp]: {
      paddingRight: 0,
      ...fontStyles.sansSerifRegular16,
      lineHeight: '22px'
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

const MembershipOptions = ({
  options,
  values,
  onChange,
  onPriceChange,
  goodiePrice
}: {
  values: FieldSetValues
  errors: Record<string, any>
  options: OptionType[]
  onChange: (options) => void
  onPriceChange: (event: Event, value: number, shouldValidate: boolean) => void
  goodiePrice: number
}) => {
  const suggestions = useMemo(() => {
    return options.map(option => {
      // append the option to each suggestion object to pass to fieldset
      const suggestionsWithOption = option.suggestions.map(suggestion => ({
        ...suggestion,
        option
      }))
      return suggestionsWithOption
    })
  }, [options]).flat()

  const requiresPeriodSelector = options.some(
    option => option.reward?.minPeriods !== option.reward?.maxPeriods
  )

  const requiresAmountSelector = options.some(
    option => option.minAmount !== option.maxAmount
  )
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
    [colorScheme]
  )

  const selectedSuggestion = suggestions
    .filter(
      suggestion =>
        suggestion.price <= values.price - goodiePrice &&
        getOptionValue(suggestion.option, values) >= 1
    )
    .sort((a, b) => descending(a.price, b.price))[0]

  return (
    <>
      <div {...styles.suggestionsContainer}>
        {suggestions.map((suggestion: SuggestionType, index) => {
          const { price, label, description, userPrice, option } = suggestion

          const isSelected = selectedSuggestion === suggestion

          return (
            <>
              <button
                key={label}
                {...plainButtonRule}
                {...styles.button}
                {...(isSelected ? buttonStyle.selected : buttonStyle.default)}
                onClick={() => {
                  onChange(
                    FieldSet.utils.fieldsState({
                      field: getOptionFieldKey(option),
                      value: 1,
                      error: undefined,
                      dirty: true
                    })
                  )
                  onPriceChange(
                    undefined,
                    (values.price -
                      selectedSuggestion.price +
                      suggestion.price) /
                      100,
                    true
                  )
                }}
                style={{ order: index }}
              >
                <p {...styles.label}>
                  <span>{label}</span>
                  {!userPrice && (
                    <>
                      <br />
                      <span>CHF {price / 100}</span>
                    </>
                  )}
                </p>
              </button>
              <div
                {...styles.infocontainer}
                style={{
                  order: !isDesktop && index,
                  display: isSelected ? 'inherit' : 'none'
                }}
              >
                {userPrice && (
                  <Field
                    label='Betrag in CHF'
                    value={values.customPrice || price}
                    renderInput={props => (
                      <input inputMode='numeric' {...props} />
                    )}
                    onDec={
                      price - 1000 >= minPrice &&
                      (() => {
                        onPriceChange(
                          undefined,
                          (price - 1000) / 100,
                          dirty.price
                        )
                      })
                    }
                    onInc={() => {
                      onPriceChange(
                        undefined,
                        (price + 1000) / 100,
                        dirty.price
                      )
                    }}
                    onChange={onPriceChange}
                  />
                )}
                <p {...styles.label}>{description}</p>
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
                  label={'Anzahl Geschenkmitgliedschaften'}
                  value={getOptionValue(option, values)}
                  onChange={(_, value) => {
                    onChange(
                      FieldSet.utils.fieldsState({
                        field: getOptionFieldKey(option),
                        value: Math.min(
                          Math.max(+value, option.minAmount),
                          option.maxAmount
                        ),
                        error: undefined,
                        dirty: true
                      })
                    )
                  }}
                  renderInput={props => (
                    <input inputMode='numeric' {...props} />
                  )}
                />
              )}
              {option.reward?.minPeriods !== option.reward?.maxPeriods && (
                <Field
                  label={'Anzahl Monate'}
                  value={
                    values[getOptionPeriodsFieldKey(option)] === undefined
                      ? option.reward.defaultPeriods
                      : values[getOptionPeriodsFieldKey(option)]
                  }
                  onChange={(_, value) =>
                    onChange(
                      FieldSet.utils.fieldsState({
                        field: getOptionPeriodsFieldKey(option),
                        value: Math.min(
                          Math.max(+value, option.reward.minPeriods),
                          option.reward.maxPeriods
                        ),
                        error: undefined,
                        dirty: true
                      })
                    )
                  }
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

export default MembershipOptions
