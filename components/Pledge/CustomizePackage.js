import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { css } from 'glamor'
import AutosizeInput from 'react-textarea-autosize'

import withT from '../../lib/withT'
import { chfFormat } from '../../lib/utils/format'

import FieldSet, { styles as fieldSetStyles } from '../FieldSet'

import {
  Field, A, Interaction,
  fontFamilies,
  mediaQueries
} from '@project-r/styleguide'

import {
  STATIC_BASE_URL
} from '../../lib/constants'

const {P} = Interaction

const absolutMinPrice = 100
const calculateMinPrice = (pkg, state, userPrice) => {
  return Math.max(pkg.options.reduce(
    (price, option) => price + (option.userPrice && userPrice
      ? 0
      : (option.price * (state[option.id] !== undefined ? state[option.id] : option.minAmount))
    ),
    0
  ), absolutMinPrice)
}

const getPrice = ({values, pkg, userPrice}) => {
  if (values.price !== undefined) {
    return values.price
  } else {
    if (userPrice) {
      return ''
    }
    const minPrice = calculateMinPrice(pkg, {}, userPrice)
    if (minPrice === absolutMinPrice) {
      return ''
    }

    return minPrice
  }
}
const priceError = (price, minPrice, t) => {
  if (price < minPrice) {
    return t('package/customize/price/error', {
      formattedCHF: chfFormat(minPrice / 100)
    })
  }
}
const reasonError = (value = '', t) => {
  return value.trim().length === 0 && t('package/customize/userPrice/reason/error')
}

const GUTTER = 42
const styles = {
  grid: css({
    clear: 'both',
    width: `calc(100% + ${GUTTER}px)`,
    margin: `0 -${GUTTER / 2}px`,
    ':after': {
      content: '""',
      display: 'table',
      clear: 'both'
    }
  }),
  span: css({
    float: 'left',
    paddingLeft: `${GUTTER / 2}px`,
    paddingRight: `${GUTTER / 2}px`,
    minHeight: 1,
    width: '50%'
  }),
  title: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 19,
    lineHeight: '28px'
  }),
  packageTitle: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: 21,
    lineHeight: '32px'
  }),
  packageImage: css({
    float: 'right',
    maxWidth: 150,
    maxHeight: 200,
    paddingLeft: 10,
    [mediaQueries.mUp]: {
      paddingLeft: 30
    }
  })
}

class CustomizePackage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.focusRefSetter = (ref) => {
      this.focusRef = ref
    }
  }
  componentDidMount () {
    if (this.focusRef && this.focusRef.input) {
      this.focusRef.input.focus()
    }

    const {
      onChange,
      pkg, values, userPrice,
      t
    } = this.props

    const price = getPrice(this.props)
    const minPrice = calculateMinPrice(
      pkg,
      values,
      userPrice
    )
    onChange({
      values: {
        price
      },
      errors: {
        price: priceError(price, minPrice, t),
        reason: userPrice && reasonError(values.reason, t)
      }
    })
  }
  render () {
    const {
      t, pkg, userPrice,
      crowdfundingName,
      values, errors, dirty,
      onChange
    } = this.props

    const price = getPrice(this.props)
    const configurableOptions = pkg.options
      .filter(option => (
        option.minAmount !== option.maxAmount
      ))

    const minPrice = calculateMinPrice(pkg, values, userPrice)

    const hasNotebook = !!pkg.options.find(option => (
      option.reward && option.reward.name === 'NOTEBOOK'
    ))
    const hasTotebag = !!pkg.options.find(option => (
      option.reward && option.reward.name === 'TOTEBAG'
    ))

    const onPriceChange = (_, value, shouldValidate) => {
      const price = String(value).length
        ? (Math.round(parseInt(value, 10)) * 100) || 0
        : 0
      const minPrice = calculateMinPrice(pkg, values, userPrice)
      const error = priceError(price, minPrice, t)

      this.setState(() => ({customPrice: true}))
      onChange(FieldSet.utils.fieldsState({
        field: 'price',
        value: price,
        error,
        dirty: shouldValidate
      }))
    }

    return (
      <div>
        <div {...styles.title}>
          {pkg.name === 'DONATE' ? <span>&nbsp;</span> : t('package/title')}
        </div>
        <div style={{marginBottom: 10}}>
          <span {...styles.packageTitle}>{t(`package/${pkg.name}/title`)}</span>
          {' '}
          <A href='/pledge' onClick={event => {
            event.preventDefault()
            onChange({
              values: {
                price: undefined
              }
            })
            Router.replace('/pledge', '/pledge', {shallow: true})
          }}>
            {t('package/customize/changePackage')}
          </A>
        </div>
        <P style={{marginBottom: 10}}>
          {hasNotebook && hasTotebag && (
            <img {...styles.packageImage}
              src={`${STATIC_BASE_URL}/static/packages/moleskine_totebag.jpg`} />
          )}
          {hasNotebook && !hasTotebag && (
            <img {...styles.packageImage}
              src={`${STATIC_BASE_URL}/static/packages/moleskine.jpg`} />
          )}
          {t.first(
            [
              `package/${crowdfundingName}/${pkg.name}/description`,
              `package/${pkg.name}/description`
            ]
          )}
        </P>
        <div {...styles.grid}>
          {
            configurableOptions.map((option, i) => {
              const value = values[option.id] === undefined ? option.defaultAmount : values[option.id]
              const label = t.pluralize(`option/${option.reward.name}/label`, {
                count: value
              }, t(`option/${option.reward.name}/label`))

              const onFieldChange = (_, value, shouldValidate) => {
                let error
                const parsedValue = String(value).length
                  ? parseInt(value, 10) || 0
                  : ''
                if (parsedValue > option.maxAmount) {
                  error = t('package/customize/option/error/max', {
                    label,
                    maxAmount: option.maxAmount
                  })
                }
                if (parsedValue < option.minAmount) {
                  error = t('package/customize/option/error/min', {
                    label,
                    minAmount: option.minAmount
                  })
                }

                const fields = FieldSet.utils.fieldsState({
                  field: option.id,
                  value: parsedValue,
                  error,
                  dirty: shouldValidate
                })
                const minPrice = calculateMinPrice(
                  pkg,
                  {
                    ...values,
                    ...fields.values
                  },
                  userPrice
                )
                let price = values.price
                if (
                  minPrice !== absolutMinPrice &&
                  (!this.state.customPrice || minPrice > values.price)
                ) {
                  fields.values.price = price = minPrice
                  this.setState(() => ({customPrice: false}))
                }
                fields.errors.price = priceError(
                  price,
                  minPrice,
                  t
                )
                onChange(fields)
              }

              return (
                <div key={option.id} {...styles.span} style={{
                  width: configurableOptions.length === 1 || (configurableOptions.length === 3 && i === 0)
                    ? '100%' : '50%'
                }}>
                  <div style={{marginBottom: 20}}>
                    <Field
                      ref={i === 0 ? this.focusRefSetter : undefined}
                      label={label}
                      error={dirty[option.id] && errors[option.id]}
                      value={value}
                      onInc={value < option.maxAmount && (() => {
                        onFieldChange(undefined, value + 1, dirty[option.id])
                      })}
                      onDec={value > option.minAmount && (() => {
                        onFieldChange(undefined, value - 1, dirty[option.id])
                      })}
                      onChange={onFieldChange}
                      />
                  </div>
                </div>
              )
            })
          }
        </div>
        {!!userPrice && (<div>
          <P>
            {t('package/customize/userPrice/beforeReason')}
          </P>
          <div style={{marginBottom: 20}}>
            <Field label={t('package/customize/userPrice/reason/label')}
              ref={this.focusRefSetter}
              error={dirty.reason && errors.reason}
              value={values.reason}
              renderInput={({ref, ...inputProps}) => (
                <AutosizeInput
                  {...inputProps}
                  {...fieldSetStyles.autoSize}
                  inputRef={ref} />
              )}
              onChange={(_, value, shouldValidate) => {
                onChange(FieldSet.utils.fieldsState({
                  field: 'reason',
                  value,
                  error: reasonError(value, t),
                  dirty: shouldValidate
                }))
              }}
              />
          </div>
          <P>
            {t('package/customize/userPrice/beforePrice')}
          </P>
        </div>)}
        <div style={{marginBottom: 20}}>
          <Field label={t('package/customize/price/label')}
            ref={(configurableOptions.length || userPrice)
              ? undefined : this.focusRefSetter}
            error={dirty.price && errors.price}
            value={price / 100}
            onDec={price - 1000 >= minPrice && (() => {
              onPriceChange(undefined, (price - 1000) / 100, dirty.price)
            })}
            onInc={() => {
              onPriceChange(undefined, (price + 1000) / 100, dirty.price)
            }}
            onChange={onPriceChange} />
        </div>
      </div>
    )
  }
}

CustomizePackage.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  dirty: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  userPrice: PropTypes.bool,
  pkg: PropTypes.shape({
    options: PropTypes.array.isRequired
  }).isRequired
}

export default withT(CustomizePackage)
