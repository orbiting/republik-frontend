import React, { useMemo, useState } from 'react'
import { css } from 'glamor'
import {
  mediaQueries,
  plainButtonRule,
  useColorContext,
  useMediaQuery,
  Field,
  Label,
  Interaction,
  fontStyles
} from '@project-r/styleguide'

import FieldSet from '../../FieldSet'
import { getOptionFieldKey, getOptionValue } from '../CustomizePackage'
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

fieldstate = {
  values: {
    'membership-id': 1,
    'a-gooide-id': 1,
    price: 260
  }
}

const MembershipOptions = ({
  options,
  values,
  onOptionChange,
  onPriceChange
}: {
  values: FieldSetValues
  options: OptionType[]
  onOptionChange: (options) => void
  onPriceChange: (value: number) => void
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

  const defaultSuggestion = useMemo(() => {
    return suggestions.find(suggestion => suggestion.favorite === true)
  }, [suggestions])

  const requiresPeriodSelector = options.some(
    option => option.reward?.minPeriods !== option.reward?.maxPeriods
  )

  const requiresAmountSelector = options.some(
    option => option.minAmount !== option.maxAmount
  )

  const [ownPrice, setOwnPrice] = useState<number>()
  const [amount, setAmount] = useState<number>()
  const [period, setPeriod] = useState<number>()
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
        {suggestions.map((suggestion: SuggestionType, index) => {
          const { price, label, description, userPrice, option } = suggestion
          const selected =
            values[getOptionFieldKey(option)]?.suggestionId === suggestion.id ||
            defaultSuggestion?.id === suggestion.id ||
            index === 0
          return (
            <>
              <button
                key={label}
                {...plainButtonRule}
                {...styles.button}
                {...(selected ? buttonStyle.selected : buttonStyle.default)}
                onClick={() => {
                  onOptionChange(
                    FieldSet.utils.fieldsState({
                      field: getOptionFieldKey(option),
                      value: {
                        suggestionId: suggestion.id,
                        price: suggestion.price
                      },
                      error: undefined,
                      dirty: true
                    })
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
                  display: selected ? 'inherit' : 'none'
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
                  value={amount || option.defaultAmount}
                  onChange={(_, value) => {
                    setAmount(parseInt(value.toString()))
                    onOptionChange(
                      FieldSet.utils.fieldsState({
                        field: getOptionFieldKey(option),
                        value: Math.min(
                          Math.max(
                            getOptionValue(option, values),
                            option.minAmount
                          ),
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
                  value={option.reward.defaultPeriods}
                  onChange={value =>
                    onOptionChange(
                      FieldSet.utils.fieldsState({
                        field: getOptionFieldKey(option),
                        value: Math.min(
                          Math.max(
                            getOptionValue(option, values),
                            numMembershipYears.minAmount
                          ),
                          numMembershipYears.maxAmount
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
