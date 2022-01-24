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
  fontStyles,
  Checkbox
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
  disabled: css({
    opacity: 0.5,
    cursor: 'default'
  }),
  button: css({
    flex: 1,
    padding: 12,
    textAlign: 'left',
    flexWrap: 'wrap',
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
  buttonDisabled: css({
    cursor: 'default'
  }),
  label: css(Interaction.fontRule, {
    margin: 0,
    wordBreak: 'break-all',
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
  giftMembershipOptions,
  values,
  onChange,
  onPriceChange,
  goodiePrice
}: {
  values: FieldSetValues
  errors: Record<string, any>
  giftMembershipOptions: OptionType[]
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

  const [colorScheme] = useColorContext()
  const isDesktop = useMediaQuery(mediaQueries.mUp)
  const [selectionDisabled, setSelectionDisabled] = useState(false)

  const buttonStyle = useMemo(
    () => ({
      default: css({
        backgroundColor: colorScheme.getCSSColor('hover'),
        '@media (hover)': !selectionDisabled && {
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
    [colorScheme, selectionDisabled]
  )

  const selectedSuggestion = suggestions
    .filter(
      suggestion =>
        suggestion.price <= values.price - goodiePrice &&
        getOptionValue(suggestion.option, values) >= 1
    )
    .sort((a, b) => descending(a.price, b.price))[0]

  const hasGiftMemberships = giftMembershipOptions.length > 0
  console.log(options)
  return (
    <>
      <div
        {...styles.suggestionsContainer}
        {...(selectionDisabled && styles.disabled)}
      >
        {suggestions.map((suggestion: SuggestionType, index) => {
          const { price, label, description, userPrice, option } = suggestion

          const isSelected = selectedSuggestion === suggestion
          // option.additionalPeriods is only true on PROLONG, which is where we don't need a period or amount selector
          const requiresPeriodSelector =
            !option.additionalPeriods &&
            option.reward?.minPeriods !== option.reward?.maxPeriods

          const requiresAmountSelector =
            !option.additionalPeriods && option.minAmount !== option.maxAmount
          return (
            <>
              {/* only render buttons if there are more than one suggestions */}
              {suggestions.length > 1 && (
                <button
                  disabled={selectionDisabled}
                  key={label}
                  {...plainButtonRule}
                  {...styles.button}
                  {...(isSelected ? buttonStyle.selected : buttonStyle.default)}
                  {...(selectionDisabled && styles.buttonDisabled)}
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
                        CHF {price / 100}
                      </>
                    )}
                  </p>
                </button>
              )}
              <div
                {...styles.infocontainer}
                style={{
                  order: !isDesktop && index,
                  display: isSelected ? 'inherit' : 'none'
                }}
              >
                {userPrice && (
                  <Field
                    disabled={selectionDisabled}
                    label='Betrag in CHF'
                    value={values.price || price}
                    renderInput={props => (
                      <input inputMode='numeric' {...props} />
                    )}
                    onChange={onPriceChange}
                  />
                )}

                {requiresPeriodSelector || requiresAmountSelector ? (
                  <div {...styles.fieldContainer}>
                    {requiresPeriodSelector && (
                      <Field
                        label={'Anzahl Geschenkmitgliedschaften'}
                        value={getOptionValue(option, values)}
                        disabled={selectionDisabled}
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
                    {requiresAmountSelector && (
                      <Field
                        label={'Anzahl Monate'}
                        disabled={selectionDisabled}
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
                  </div>
                ) : null}
                <p {...styles.label}>{description}</p>
              </div>
            </>
          )
        })}
      </div>
      {hasGiftMemberships && (
        <Checkbox
          checked={selectionDisabled}
          onChange={() => {
            setSelectionDisabled(!selectionDisabled)
          }}
        >
          nur Geschenkmitgliedschaften verlängern
        </Checkbox>
      )}
    </>
  )
}

export default MembershipOptions
