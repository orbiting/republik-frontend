import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import AutosizeInput from 'react-textarea-autosize'
import { nest } from 'd3-collection'
import { sum, min } from 'd3-array'
import { timeDay } from 'd3-time'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { format } from 'url'

import withT from '../../lib/withT'
import { chfFormat, timeFormat } from '../../lib/utils/format'
import { Router, Link } from '../../lib/routes'
import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'

import FieldSet, { styles as fieldSetStyles } from '../FieldSet'
import { shouldIgnoreClick } from '../Link/utils'

import {
  A,
  Field,
  Radio,
  Checkbox,
  fontFamilies,
  Interaction,
  Label,
  mediaQueries,
  Editorial,
  fontStyles
} from '@project-r/styleguide'

import ManageMembership from '../Account/Memberships/Manage'

const dayFormat = timeFormat('%d. %B %Y')

const { P } = Interaction

const absolutMinPrice = 100
const calculateMinPrice = (pkg, values, userPrice) => {
  const minPrice = pkg.options.reduce(
    (price, option) => {
      const amount = values[getOptionFieldKey(option)] !== undefined
        ? values[getOptionFieldKey(option)]
        : option.defaultAmount || option.minAmount

      // Price adopts to intervalCount
      const intervalCount =
        values[getOptionFieldKey(option) + '.interval'] ||
        (option.reward && option.reward.defaultIntervalCount) ||
        0

      if (intervalCount > 0) {
        return price + (option.price * intervalCount * amount)
      }

      // Price adopts to amount
      return price + (option.userPrice && userPrice
        ? 0
        : option.price * amount
      )
    },
    0
  )
  if (minPrice > absolutMinPrice) {
    return minPrice
  }
  const groups = pkg.options.filter(option => option.optionGroup)
  if (groups.length) {
    return min(
      groups,
      option => option.userPrice && userPrice
        ? 0
        : option.price
    ) || absolutMinPrice
  }
  return absolutMinPrice
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
  option.optionGroup,
  option.templateId
].filter(Boolean).join('-')

const getOptionValue = (option, values) => {
  const fieldKey = getOptionFieldKey(option)
  return values[fieldKey] === undefined
    ? option.defaultAmount
    : values[fieldKey]
}

const getOptionInterval = (option, values) => {
  const fieldKeyInterval = getOptionFieldKey(option) + '.interval'
  return values[fieldKeyInterval] === undefined
    ? option.reward.defaultIntervalCount
    : values[fieldKeyInterval]
}

const GUTTER = 42
const styles = {
  group: css({
    marginBottom: 10,
    marginTop: 5
  }),
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
  }),
  ul: css({
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 25
  }),
  ulNote: css({
    marginTop: -5,
    marginBottom: 5
  }),
  smallP: css({
    margin: 0,
    ...fontStyles.sansSerifRegular16
  })
}

const SmallP = ({ children, ...props }) => <p {...props} {...styles.smallP}>{children}</p>

class CustomizePackage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.focusRefSetter = (ref) => {
      this.focusRef = ref
    }
  }
  calculateNextPrice (nextFields) {
    const {
      pkg, values, userPrice,
      t
    } = this.props

    const minPrice = calculateMinPrice(
      pkg,
      {
        ...values,
        ...nextFields.values
      },
      userPrice
    )
    let price = values.price
    if (
      !this.state.customPrice || minPrice > price
    ) {
      price = minPrice !== absolutMinPrice
        ? minPrice
        : ''
      if (this.state.customPrice) {
        this.setState({ customPrice: false })
      }
      return FieldSet.utils.mergeField({
        field: 'price',
        value: price,
        error: priceError(
          price,
          minPrice,
          t
        ),
        dirty: false
      })(nextFields)
    }
    return FieldSet.utils.mergeField({
      error: priceError(
        price,
        minPrice,
        t
      )
    })(nextFields)
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
  resetPrice () {
    this.props.onChange(FieldSet.utils.fieldsState({
      field: 'price',
      value: undefined,
      error: undefined,
      dirty: undefined
    }))
  }
  resetUserPrice () {
    const { router } = this.props
    const params = { ...router.query }
    delete params.userPrice
    Router.replaceRoute('pledge', params, { shallow: true })
  }
  componentWillUnmount () {
    this.resetPrice()
  }
  render () {
    const {
      t, pkg, userPrice, customMe, router,
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
    const regularMinPrice = calculateMinPrice(pkg, values, false)
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
      const error = priceError(price, minPrice, t)

      if (userPrice && price >= regularMinPrice) {
        this.resetUserPrice()
      }

      this.setState({ customPrice: true })
      onChange(FieldSet.utils.fieldsState({
        field: 'price',
        value: price,
        error,
        dirty: shouldValidate
      }))
    }

    const bonusValue = sum(
      pkg.options
        .filter(option => (
          option.additionalPeriods &&
          option.additionalPeriods.find(period => period.kind === 'BONUS')
        ))
        .map(option => {
          const value = getOptionValue(option, values)
          if (!value) {
            return 0
          }
          const bonusDays = option.additionalPeriods
            .filter(period => period.kind === 'BONUS')
            .reduce(
              (days, period) => days + timeDay.count(
                new Date(period.beginDate), new Date(period.endDate)
              ),
              0
            )
          const regularDays = option.additionalPeriods
            .filter(period => period.kind === 'REGULAR')
            .reduce(
              (days, period) => days + timeDay.count(
                new Date(period.beginDate), new Date(period.endDate)
              ),
              0
            )
          return Math.ceil((option.price / regularDays * bonusDays) / 100) * 100 * value
        })
    )
    const payMoreSuggestions = pkg.name === 'DONATE' ? [] : [
      userPrice && { value: regularMinPrice, key: 'normal' },
      !userPrice && price >= minPrice && bonusValue &&
        { value: minPrice + bonusValue, key: 'bonus' },
      !userPrice && price >= minPrice &&
        { value: minPrice * 1.5, key: '1.5' }
    ].filter(Boolean)
    const offerUserPrice = (
      !userPrice &&
      pkg.name === 'PROLONG' &&
      pkg.options.every(option => {
        return !getOptionValue(option, values) || option.userPrice
      })
    )
    const ownMembershipOption = pkg.options
      .find(option => (
        option.membership &&
        option.membership.user.id === (customMe && customMe.id)
      ))
    const offerCancelMembership = ownMembershipOption && ownMembershipOption.membership

    const optionGroups = nest()
      .key(d => d.optionGroup
        ? d.optionGroup
        : '')
      .entries(configurableOptions)
      .map(({ key: group, values: options }) => {
        const selectedGroupOption = group && options.find(option => {
          return getOptionValue(option, values)
        })
        const baseOption = selectedGroupOption || options[0]
        const { membership, additionalPeriods } = baseOption
        const checkboxGroup = (
          group && options.length === 1 &&
          baseOption.minAmount === 0 &&
          baseOption.maxAmount === 1
        )
        const isAboGive = membership && membership.user.id !== (customMe && customMe.id)

        return {
          group,
          checkboxGroup,
          options,
          selectedGroupOption,
          membership,
          isAboGive,
          additionalPeriods
        }
      })
    const multipleThings = configurableOptions.length && (
      optionGroups.length > 1 ||
      !optionGroups[0].group
    )

    return (
      <div>
        <div style={{ marginTop: 20, marginBottom: 10 }}>
          <span {...styles.packageTitle}>{t(`package/${pkg.name}/title`)}</span>
          {' '}
          <A href='/angebote' onClick={event => {
            event.preventDefault()
            this.resetPrice()
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
          optionGroups.map(({
            group,
            checkboxGroup,
            options,
            selectedGroupOption,
            membership,
            isAboGive,
            additionalPeriods
          }, i) => {
            const reset = group && optionGroups.length > 1 && !checkboxGroup && <Fragment>
              <span style={{
                display: 'inline-block',
                whiteSpace: 'nowrap'
              }}>
                <Radio
                  value='0'
                  checked={!selectedGroupOption}
                  onChange={(event) => {
                    if (userPrice) {
                      this.resetUserPrice()
                    }
                    onChange(this.calculateNextPrice(
                      options.reduce((fields, option) => {
                        return FieldSet.utils.mergeField({
                          field: getOptionFieldKey(option),
                          value: 0,
                          error: undefined,
                          dirty: false
                        })(fields)
                      }, {})
                    ))
                  }}>
                  <span style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginRight: 20,
                    whiteSpace: 'nowrap'
                  }}>
                    {t(`option/${pkg.name}/resetGroup`, {}, null)}
                  </span>
                </Radio>
              </span>
            </Fragment>

            const nextGroup = optionGroups[i + 1]
            const prevGroup = optionGroups[i - 1]

            return (
              <Fragment key={group}>
                {isAboGive && (!prevGroup || !prevGroup.isAboGive) && <P style={{ marginTop: 30 }}>
                  {t('package/customize/group/aboGive')}
                </P>}
                {membership && <ManageMembership
                  title={
                    isAboGive ? t(
                      `memberships/title/${membership.type.name}/give`,
                      {
                        name: membership.user.name,
                        sequenceNumber: membership.sequenceNumber
                      }
                    ) : undefined
                  }
                  membership={membership}
                  actions={false}
                  compact />}
                <div {...styles[group ? 'group' : 'grid']}>
                  {
                    options.map((option, i) => {
                      const fieldKey = getOptionFieldKey(option)
                      const value = getOptionValue(option, values)
                      const label = t.first([
                        ...(isAboGive ? [
                          `option/${pkg.name}/${option.reward.name}/label/give`,
                          `option/${option.reward.name}/label/give`
                        ] : []),
                        `option/${pkg.name}/${option.reward.name}/label/${value}`,
                        `option/${pkg.name}/${option.reward.name}/label/other`,
                        `option/${pkg.name}/${option.reward.name}/label`,
                        `option/${option.reward.name}/label/${value}`,
                        `option/${option.reward.name}/label/other`,
                        `option/${option.reward.name}/label`
                      ], {
                        count: value
                      })

                      const fieldKeyInterval = getOptionFieldKey(option) + '.interval'
                      const intervalCount = getOptionInterval(option, values)
                      const interval = option.reward.interval
                      const labelInterval = t.first([
                        `option/${pkg.name}/${option.reward.name}/interval/${interval}/label/${value}`,
                        `option/${pkg.name}/${option.reward.name}/interval/${interval}/label/other`,
                        `option/${pkg.name}/${option.reward.name}/interval/${interval}/label`,
                        `option//${option.reward.name}/interval/${interval}/label/${value}`,
                        `option/${option.reward.name}/interval/${interval}/label/other`,
                        `option/${option.reward.name}/interval/${interval}/label`
                      ])

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
                        if (group) {
                          // unselect all other options from group
                          options.filter(other => other !== option).forEach(other => {
                            fields = FieldSet.utils.mergeField({
                              field: getOptionFieldKey(other),
                              value: 0,
                              error: undefined,
                              dirty: false
                            })(fields)
                          })
                        }
                        if (parsedValue && userPrice && !option.userPrice) {
                          this.resetUserPrice()
                        }
                        onChange(this.calculateNextPrice(fields))
                      }

                      const onFieldIntervalChange = (_, interval, shouldValidate) => {
                        let error
                        const parsedInterval = String(interval).length
                          ? parseInt(interval, 10) || 0
                          : ''

                        if (parsedInterval > option.reward.maxIntervalCount) {
                          error = t('package/customize/option/error/max', {
                            label: labelInterval,
                            maxAmount: option.reward.maxIntervalCount
                          })
                        }
                        if (parsedInterval < option.reward.minIntervalCount) {
                          error = t('package/customize/option/error/min', {
                            label: labelInterval,
                            minAmount: option.reward.minIntervalCount
                          })
                        }

                        // @TODO: Better error message. Describes if interval
                        // is not a valid step.
                        // @TODO: A invalid interval breaks inc/dec fn on
                        // input field. Maybe find a proper abstraction here.
                        const times = parsedInterval / option.reward.intervalStepCount

                        if (
                          option.reward.intervalStepCount * times !==
                          option.reward.intervalStepCount * Math.round(times)
                        ) {
                          const potentialValue = option.reward.intervalStepCount * Math.ceil(times)

                          const suggestedValue =
                            potentialValue <= option.reward.maxIntervalCount
                              ? potentialValue
                              : option.reward.maxIntervalCount

                          error = t('package/customize/option/error/step', {
                            label: labelInterval,
                            suggestedValue
                          })
                        }

                        let fields = FieldSet.utils.fieldsState({
                          field: fieldKeyInterval,
                          value: parsedInterval,
                          error,
                          dirty: shouldValidate
                        })
                        /*
                        if (group) {
                          // unselect all other options from group
                          options.filter(other => other !== option).forEach(other => {
                            fields = FieldSet.utils.mergeField({
                              field: getOptionFieldKey(other),
                              value: 0,
                              error: undefined,
                              dirty: false
                            })(fields)
                          })
                        } */
                        if (parsedInterval && userPrice && !option.userPrice) {
                          this.resetUserPrice()
                        }
                        onChange(this.calculateNextPrice(fields))
                      }

                      if (group && option.minAmount === 0 && option.maxAmount === 1) {
                        const children = (
                          <span style={{
                            display: 'inline-block',
                            verticalAlign: 'top',
                            marginRight: 20,
                            marginTop: checkboxGroup ? -2 : 0
                          }}>
                            <Interaction.Emphasis>{label}</Interaction.Emphasis><br />
                            {t.first([
                              isAboGive && `package/${pkg.name}/price/give`,
                              `package/${pkg.name}/price`,
                              'package/price'
                            ].filter(Boolean), {
                              formattedCHF: chfFormat(option.price / 100)
                            })}
                          </span>
                        )
                        if (checkboxGroup) {
                          return <Checkbox
                            key={option.id}
                            checked={!!value}
                            onChange={(_, checked) => {
                              onFieldChange(undefined, +checked, dirty[fieldKey])
                            }}>
                            {children}
                          </Checkbox>
                        }
                        return <Fragment key={option.id}>
                          <span style={{
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            marginBottom: 10
                          }}>
                            <Radio
                              value='1'
                              checked={!!value}
                              onChange={(event) => {
                                onFieldChange(undefined, 1, dirty[fieldKey])
                              }}>
                              {children}
                            </Radio>
                          </span>{' '}
                        </Fragment>
                      }

                      return (
                        <div key={option.id} {...styles.span} style={{
                          width: configurableOptions.length === 1 || (configurableOptions.length === 3 && i === 0)
                            ? '100%' : '50%'
                        }}>
                          <div style={{ marginBottom: 20 }}>
                            <Field
                              ref={i === 0 && !group ? this.focusRefSetter : undefined}
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
                            {
                              option.reward.maxIntervalCount - option.reward.minIntervalCount > 0 &&
                              <Fragment>
                                <Field
                                  label={labelInterval}
                                  error={dirty[fieldKeyInterval] && errors[fieldKeyInterval]}
                                  value={intervalCount}
                                  onInc={intervalCount < option.reward.maxIntervalCount && (() => {
                                    onFieldIntervalChange(undefined, intervalCount + option.reward.intervalStepCount, dirty[fieldKeyInterval])
                                  })}
                                  onDec={intervalCount > option.reward.minIntervalCount && (() => {
                                    onFieldIntervalChange(undefined, intervalCount - option.reward.intervalStepCount, dirty[fieldKeyInterval])
                                  })}
                                  onChange={onFieldIntervalChange}
                                />
                                { intervalCount >= option.reward.maxIntervalCount &&
                                  <P>{
                                    t.elements(
                                      `option/${option.reward.name}/interval/notice/reachedMaxIntervalCount`,
                                      { link: <Link key='xx' route='pledge' params={{ package: 'ABO_GIVE' }} passHref>{t('package/ABO_GIVE/title')}</Link> }
                                    )
                                  }</P>
                                }
                              </Fragment>
                            }
                          </div>
                        </div>
                      )
                    })
                  }
                  {reset}
                </div>
                {additionalPeriods && !!additionalPeriods.length && !!selectedGroupOption && <div style={{ marginBottom: 20 }}>
                  {additionalPeriods
                    .filter((period, i) => period.kind !== 'REGULAR' || i > 0)
                    .map(period => {
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
                          {title}
                          {explanation && <Fragment>
                            <Label style={{ display: 'block' }}>{explanation}</Label>
                          </Fragment>}
                        </SmallP>
                      )
                    })
                  }
                  <SmallP>
                    <Interaction.Emphasis>
                      {t(`option/${pkg.name}/additionalPeriods/endDate`, {
                        formattedEndDate: dayFormat(new Date(additionalPeriods[additionalPeriods.length - 1].endDate))
                      })}
                    </Interaction.Emphasis>
                  </SmallP>
                  {isAboGive && <SmallP>
                    {t(`option/${pkg.name}/additionalPeriods/give`, {
                      name: membership.user.name
                    })}
                  </SmallP>}
                </div>}
                {isAboGive && (!nextGroup || !nextGroup.isAboGive) && <div style={{ height: 30 }} />}
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
            : <Field label={t(`package/customize/price/label${multipleThings ? '/total' : ''}`)}
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
          {!fixedPrice && <div {...styles.smallP}>
            {payMoreSuggestions.length > 0 && <Fragment>
              <Interaction.Emphasis>
                {t('package/customize/price/payMore')}
              </Interaction.Emphasis>
              <ul {...styles.ul}>
                {payMoreSuggestions.map(({ value, key }) => {
                  const label = t.elements(`package/customize/price/payMore/${key}`, {
                    formattedCHF: chfFormat(value / 100)
                  })
                  if (price >= value) {
                    return <li key={key}>{label}</li>
                  }
                  return <li key={key}>
                    <Editorial.A href='#' onClick={(e) => {
                      e.preventDefault()
                      onPriceChange(undefined, value / 100, true)
                      if (userPrice) {
                        this.resetUserPrice()
                      }
                    }}>
                      {label}
                    </Editorial.A>
                  </li>
                })}
              </ul>
              {price >= payMoreSuggestions[payMoreSuggestions.length - 1].value && <div {...styles.ulNote}>
                <Interaction.Emphasis>
                  {t('package/customize/price/payMore/thx')}
                </Interaction.Emphasis>
              </div>}
            </Fragment>}
            {offerUserPrice &&
              <Fragment>
                <Editorial.A
                  href={format({
                    pathname: '/angebote',
                    query: { ...router.query, userPrice: 1 }
                  })}
                  onClick={(e) => {
                    if (shouldIgnoreClick(e)) {
                      return
                    }
                    e.preventDefault()
                    this.resetPrice()

                    const selectedUserPriceOption = pkg.options.find(option => {
                      return getOptionValue(option, values) && option.userPrice
                    })
                    if (!selectedUserPriceOption) {
                      const firstUserPriceOption = pkg.options.find(option => {
                        return option.userPrice
                      })
                      onChange(FieldSet.utils.fieldsState({
                        field: getOptionFieldKey(firstUserPriceOption),
                        value: firstUserPriceOption.maxAmount
                      }))
                    }

                    Router.replaceRoute(
                      'pledge',
                      { ...router.query, userPrice: 1 },
                      { shallow: true }
                    ).then(() => {
                      if (this.focusRef && this.focusRef.input) {
                        this.focusRef.input.focus()
                      }
                    })
                  }}>
                  {t('package/customize/price/payLess')}
                </Editorial.A>
                <br />
              </Fragment>
            }
            {offerCancelMembership &&
              <Fragment>
                <Link route='cancel' params={{ membershipId: offerCancelMembership.id }} passHref>
                  <Editorial.A>
                    {t.first([
                      `memberships/${offerCancelMembership.type.name}/manage/cancel/link`,
                      'memberships/manage/cancel/link'
                    ])}
                  </Editorial.A>
                </Link>
              </Fragment>
            }
          </div>}
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
  me: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  userPrice: PropTypes.bool,
  pkg: PropTypes.shape({
    options: PropTypes.array.isRequired
  }).isRequired
}

export default compose(
  withRouter,
  withT
)(CustomizePackage)
