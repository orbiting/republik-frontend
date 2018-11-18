import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import AutosizeInput from 'react-textarea-autosize'
import { nest } from 'd3-collection'
import { timeDay } from 'd3-time'

import withT from '../../lib/withT'
import { chfFormat, timeFormat } from '../../lib/utils/format'

import FieldSet, { styles as fieldSetStyles } from '../FieldSet'

import { A, Field, Radio, fontFamilies, Interaction, Label, mediaQueries } from '@project-r/styleguide'

import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'

import { Router } from '../../lib/routes'

import ManageMembership, { ManageActions } from '../Account/Memberships/Manage'
import { P as SmallP } from '../Account/Elements'

const dayFormat = timeFormat('%d. %B %Y')

const { P } = Interaction

const absolutMinPrice = 100
const calculateMinPrice = (pkg, state, userPrice) => {
  return Math.max(pkg.options.reduce(
    (price, option) => price + (option.userPrice && userPrice
      ? 0
      : option.price * (
        state[getOptionFieldKey(option)] !== undefined
          ? state[getOptionFieldKey(option)]
          : option.minAmount
      )
    ),
    0
  ), absolutMinPrice)
}

const getPrice = ({ values, pkg, userPrice }) => {
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

export const getOptionFieldKey = option => [
  option.customization && option.customization.membership && option.customization.membership.id,
  option.templateId
].filter(Boolean).join('-')

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
    const fixedPrice = pkg.name === 'MONTHLY_ABO'

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

      this.setState(() => ({ customPrice: true }))
      onChange(FieldSet.utils.fieldsState({
        field: 'price',
        value: price,
        error,
        dirty: shouldValidate
      }))
    }

    return (
      <div>
        <div style={{ marginTop: 20, marginBottom: 10 }}>
          <span {...styles.packageTitle}>{t(`package/${pkg.name}/title`)}</span>
          {' '}
          <A href='/angebote' onClick={event => {
            event.preventDefault()
            onChange(FieldSet.utils.fieldsState({
              field: 'price',
              value: undefined,
              error: undefined,
              dirty: undefined
            }))
            Router.replaceRoute('pledge', {}, { shallow: true })
          }}>
            {t('package/customize/changePackage')}
          </A>
        </div>
        <P style={{ marginBottom: 10 }}>
          {hasNotebook && hasTotebag && (
            <img {...styles.packageImage}
              src={`${CDN_FRONTEND_BASE_URL}/static/packages/moleskine_totebag.jpg`} />
          )}
          {hasNotebook && !hasTotebag && (
            <img {...styles.packageImage}
              src={`${CDN_FRONTEND_BASE_URL}/static/packages/moleskine.jpg`} />
          )}
          {t.first(
            [
              `package/${crowdfundingName}/${pkg.name}/description`,
              `package/${pkg.name}/description`
            ]
          )}
        </P>
        {
          nest()
            .key(d => d.customization && d.customization.membership
              ? d.customization.membership.id
              : '')
            .entries(configurableOptions)
            .map(({ key: groupId, values: options }) => {
              const selectedGroupOption = groupId && options.find(option => {
                const fieldKey = getOptionFieldKey(option)
                const value = values[fieldKey] === undefined
                  ? option.defaultAmount
                  : values[fieldKey]
                return value
              })
              const customization = (selectedGroupOption || options[0]).customization || {}
              const membership = customization && customization.membership
              const additionalPeriods = customization && customization.additionalPeriods

              const Wrapper = groupId
                ? ({ children }) => <div style={{ marginBottom: 20, marginTop: 5 }}>{children}</div>
                : ({ children }) => <div {...styles.grid}>{children}</div>

              const resetLabel = groupId && t(`option/${pkg.name}/resetGroup`, {}, null)
              const reset = resetLabel && <Fragment>
                <Radio
                  value='0'
                  checked={!selectedGroupOption}
                  onChange={(event) => {
                    onChange(options.reduce((fields, option) => {
                      return FieldSet.utils.mergeField({
                        field: getOptionFieldKey(option),
                        value: '',
                        error: undefined,
                        dirty: false
                      })(fields)
                    }, {}))
                  }}>
                  <span style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginRight: 20
                  }}>
                    {resetLabel}
                  </span>
                </Radio>
                {!selectedGroupOption && membership && <div style={{ marginTop: 10 }}>
                  <ManageActions membership={membership} />
                </div>}
              </Fragment>

              return (
                <Fragment key={groupId}>
                  {membership && <ManageMembership
                    membership={membership}
                    actions={false}
                    margin={false} />}
                  {additionalPeriods && additionalPeriods.length &&
                    <div style={{ marginBottom: 20 }}>
                      <SmallP>
                        <Interaction.Emphasis>
                          {t(`option/${pkg.name}/additionalPeriods/endDate`, {
                            formattedEndDate: dayFormat(new Date(additionalPeriods[additionalPeriods.length - 1].endDate))
                          })}
                        </Interaction.Emphasis>
                      </SmallP>
                      {additionalPeriods.length > 1 && additionalPeriods.map(period => {
                        const beginDate = new Date(period.beginDate)
                        const endDate = new Date(period.endDate)
                        const formattedEndDate = dayFormat(endDate)
                        const days = timeDay.count(beginDate, endDate)

                        const title = t.first([
                          `option/${pkg.name}/additionalPeriods/${period.kind}/title`,
                          `option/${pkg.name}/additionalPeriods/title`
                        ], {
                          formattedEndDate,
                          days
                        })
                        const explanation = t.first([
                          `option/${pkg.name}/additionalPeriods/${period.kind}/explanation`,
                          `option/${pkg.name}/additionalPeriods/explanation`
                        ], {
                          formattedEndDate,
                          days
                        }, '')

                        return (
                          <SmallP key={formattedEndDate}>
                            <Interaction.Emphasis>{title}</Interaction.Emphasis>
                            <br />
                            {explanation && <Label>{explanation}</Label>}
                          </SmallP>
                        )
                      })}
                    </div>
                  }
                  <Wrapper>
                    {
                      options.map((option, i) => {
                        const fieldKey = getOptionFieldKey(option)
                        let value = values[fieldKey] === undefined
                          ? option.defaultAmount
                          : values[fieldKey]
                        const label = t.first([
                          `option/${pkg.name}/${option.reward.name}/label/${value}`,
                          `option/${pkg.name}/${option.reward.name}/label/other`,
                          `option/${pkg.name}/${option.reward.name}/label`,
                          `option/${option.reward.name}/label/${value}`,
                          `option/${option.reward.name}/label/other`,
                          `option/${option.reward.name}/label`
                        ], {
                          count: value
                        })

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

                          let fields = FieldSet.utils.fieldsState({
                            field: fieldKey,
                            value: parsedValue,
                            error,
                            dirty: shouldValidate
                          })
                          if (groupId) {
                            // unselect all other options from group
                            options.filter(other => other !== option).forEach(other => {
                              fields = FieldSet.utils.mergeField({
                                field: getOptionFieldKey(other),
                                value: '',
                                error: undefined,
                                dirty: false
                              })(fields)
                            })
                          }
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
                            this.setState(() => ({ customPrice: false }))
                          }
                          fields.errors.price = priceError(
                            price,
                            minPrice,
                            t
                          )
                          onChange(fields)
                        }

                        if (groupId && option.minAmount === 0 && option.maxAmount === 1) {
                          return <Radio
                            value='1'
                            checked={!!value}
                            onChange={(event) => {
                              onFieldChange(undefined, 1, dirty[fieldKey])
                            }}>
                            <span style={{
                              display: 'inline-block',
                              verticalAlign: 'top',
                              marginRight: 40
                            }}>
                              <Interaction.Emphasis>{label}</Interaction.Emphasis><br />
                              {t.first([
                                `package/${pkg.name}/price`,
                                'package/price'
                              ], {
                                formattedCHF: `CHF ${option.price / 100}`
                              })}
                            </span>
                          </Radio>
                        }

                        return (
                          <div key={option.id} {...styles.span} style={{
                            width: configurableOptions.length === 1 || (configurableOptions.length === 3 && i === 0)
                              ? '100%' : '50%'
                          }}>
                            <div style={{ marginBottom: 20 }}>
                              <Field
                                ref={i === 0 && !groupId ? this.focusRefSetter : undefined}
                                label={label}
                                error={dirty[fieldKey] && errors[fieldKey]}
                                value={value}
                                onInc={value < option.maxAmount && (() => {
                                  onFieldChange(undefined, value + 1, dirty[fieldKey])
                                })}
                                onDec={value > option.minAmount && (() => {
                                  onFieldChange(undefined, value - 1, dirty[fieldKey])
                                })}
                                onChange={onFieldChange}
                              />
                            </div>
                          </div>
                        )
                      })
                    }
                    {reset}
                  </Wrapper>
                </Fragment>
              )
            })
        }
        {!!userPrice && (<div>
          <P>
            {t('package/customize/userPrice/beforeReason')}
          </P>
          <div style={{ marginBottom: 20 }}>
            <Field label={t('package/customize/userPrice/reason/label')}
              ref={this.focusRefSetter}
              error={dirty.reason && errors.reason}
              value={values.reason}
              renderInput={({ ref, ...inputProps }) => (
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
        <div style={{ marginBottom: 20 }}>
          {fixedPrice
            ? <Interaction.P>
              <Label>{t('package/customize/price/label')}</Label><br />
              {price / 100}
            </Interaction.P>
            : <Field label={t('package/customize/price/label')}
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
          }
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
