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

import { OptionType, SuggestionType } from './PledgeOptionsTypes'

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
  labelSelected: css(Interaction.fontRule, {
    ...fontStyles.sansSerifMedium15,
    lineHeight: '18px',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium16,
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
  onChange
}: {
  options: OptionType[]
  onChange: (options) => void
}) => {
  const suggetions = useMemo(() => {
    return options.map(option => option.suggestions)
  }, [options]).flat()

  const defaultSuggestion = useMemo(() => {
    return suggetions.find(suggestion => suggestion.favorite === true)
  }, [suggetions])

  const requiresPeriodSelector = options.some(
    option => option.reward?.minPeriods !== option.reward?.maxPeriods
  )

  const requiresAmountSelector = options.some(
    option => option.minAmount !== option.maxAmount
  )

  const [selectedSuggestion, setSelectedSuggestion] = useState(
    defaultSuggestion || options[0].suggestions[0]
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
                  onChange({
                    suggestion,
                    selectedPrice: suggestion.price
                  })
                }}
                style={{ order: index }}
              >
                <p {...styles.label}>
                  <span {...(selected && styles.labelSelected)}>{label}</span>
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
                    value={(ownPrice && ownPrice / 100) || price / 100}
                    renderInput={props => (
                      <input inputMode='numeric' {...props} />
                    )}
                    onChange={(_, value) => {
                      setSelectedSuggestion(suggestion)
                      setOwnPrice(value * 100)
                      onChange({
                        suggestion,
                        selectedPrice: value * 100
                      })
                    }}
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

export default MembershipOptions
