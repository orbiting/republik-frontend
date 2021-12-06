import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import AutosizeInput from 'react-textarea-autosize'
import { nest } from 'd3-collection'
import { sum, min, ascending } from 'd3-array'
import { timeDay } from 'd3-time'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'
import { format } from 'url'
import GoodieOptions from './PledgeOptions/GoodieOptions'

import withT from '../../lib/withT'
import { chfFormat, timeFormat } from '../../lib/utils/format'

import FieldSet, { styles as fieldSetStyles } from '../FieldSet'
import { shouldIgnoreClick } from '../../lib/utils/link'

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
  fontStyles,
  RawHtml
} from '@project-r/styleguide'

import ManageMembership from '../Account/Memberships/Manage'
import Link from 'next/link'

const dayFormat = timeFormat('%d. %B %Y')

const { P } = Interaction

const absolutMinPrice = 100
const calculateMinPrice = (pkg, values, userPrice) => {
  const minPrice = pkg.options.reduce((price, option) => {
    const amountValue = values[getOptionFieldKey(option)]
    const amount =
      amountValue !== undefined
        ? amountValue
        : option.defaultAmount || option.minAmount

    // Price adopts to periods
    const periodsValue = values[getOptionPeriodsFieldKey(option)]
    const periodsDefaultValue =
      option.reward &&
      (option.reward.defaultPeriods || option.reward.minPeriods)
    const multiplier =
      periodsValue !== undefined
        ? periodsValue
        : periodsDefaultValue !== undefined
        ? periodsDefaultValue
        : 1

    // Price adopts to amount
    return (
      price +
      (option.userPrice && userPrice ? 0 : option.price * amount * multiplier)
    )
  }, 0)
  if (minPrice > absolutMinPrice) {
    return minPrice
  }
  const groups = pkg.options.filter(option => option.optionGroup)
  if (groups.length) {
    return (
      min(groups, option =>
        option.userPrice && userPrice ? 0 : option.price
      ) || absolutMinPrice
    )
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
    const minPrice = calculateMinPrice(pkg, values, userPrice)
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
  return (
    value.trim().length === 0 && t('package/customize/userPrice/reason/error')
  )
}

export const getOptionFieldKey = option =>
  [option.optionGroup, option.templateId].filter(Boolean).join('-')

export const getOptionPeriodsFieldKey = option =>
  `${getOptionFieldKey(option)}-periods`

const getOptionValue = (option, values) => {
  const fieldKey = getOptionFieldKey(option)
  return values[fieldKey] === undefined
    ? option.defaultAmount
    : values[fieldKey]
}

const GUTTER = 20
const styles = {
  group: css({
    marginBottom: 10,
    marginTop: 5
  }),
  grid: css({
    clear: 'both',
    width: `calc(100% + ${GUTTER}px)`,
    margin: `0 -${GUTTER / 2}px`,
    [mediaQueries.mUp]: {
      width: `calc(100% + ${GUTTER * 2}px)`,
      margin: `0 -${GUTTER}px`
    },
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
    [mediaQueries.mUp]: {
      paddingLeft: `${GUTTER}px`,
      paddingRight: `${GUTTER}px`
    },
    minHeight: 1,
    width: '50%'
  }),
  title: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 19,
    lineHeight: '28px'
  }),
  packageImage: css({
    float: 'right',
    maxWidth: 150,
    maxHeight: 170,
    paddingLeft: 10,
    [mediaQueries.mUp]: {
      paddingLeft: 30
    }
  }),
  ul: css({
    marginTop: 0,
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

const SmallP = ({ children, ...props }) => (
  <p {...props} {...styles.smallP}>
    {children}
  </p>
)

class CustomizePackage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.focusRefSetter = ref => {
      this.focusRef = ref
    }
  }
  calculateNextPrice(nextFields) {
    const { pkg, values, userPrice, t } = this.props

    const minPrice = calculateMinPrice(
      pkg,
      {
        ...values,
        ...nextFields.values
      },
      userPrice
    )

    let price = values.price

    if (!this.state.customPrice || minPrice > price) {
      price = minPrice !== absolutMinPrice ? minPrice : ''
      if (this.state.customPrice) {
        this.setState({ customPrice: false })
      }
      return FieldSet.utils.mergeField({
        field: 'price',
        value: price,
        error: priceError(price, minPrice, t),
        dirty: false
      })(nextFields)
    }
    return FieldSet.utils.mergeField({
      error: priceError(price, minPrice, t)
    })(nextFields)
  }
  componentDidMount() {
    if (this.focusRef && this.focusRef.focus) {
      this.focusRef.focus()
      if (this.focusRef.value) {
        this.focusRef.selectionStart = this.focusRef.selectionEnd = this.focusRef.value.length
      }
    }

    const { onChange, pkg, values, userPrice, t } = this.props

    const price = getPrice(this.props)
    const minPrice = calculateMinPrice(pkg, values, userPrice)
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
  componentDidUpdate() {
    const { onChange, pkg, values, userPrice, t } = this.props

    if (values.price === undefined) {
      const price = getPrice(this.props)
      const minPrice = calculateMinPrice(pkg, values, userPrice)
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
  }
  resetPrice() {
    this.props.onChange(
      FieldSet.utils.fieldsState({
        field: 'price',
        value: undefined,
        error: undefined,
        dirty: undefined
      })
    )
  }
  resetUserPrice() {
    const { router } = this.props
    const query = { ...router.query }
    delete query.userPrice
    router.replace({ pathname: 'pledge', query }, undefined, { shallow: true })
  }
  componentWillUnmount() {
    this.resetPrice()
  }
  render() {
    const {
      t,
      pkg,
      userPrice,
      customMe,
      ownMembership,
      router,
      crowdfundingName,
      values,
      errors,
      dirty,
      onChange
    } = this.props

    const { query } = router

    const accessGrantedOnly = query.filter === 'pot'

    const price = getPrice(this.props)
    const configurableFields = pkg.options.reduce((fields, option) => {
      if (option.minAmount !== option.maxAmount) {
        fields.push({
          option,
          key: getOptionFieldKey(option),
          min: option.minAmount,
          max: option.maxAmount,
          default: option.defaultAmount
        })
      }
      if (
        option.reward &&
        option.reward.__typename === 'MembershipType' &&
        option.reward.minPeriods !== undefined &&
        option.reward.maxPeriods !== undefined &&
        option.reward.minPeriods - option.reward.maxPeriods !== 0
      ) {
        fields.push({
          option,
          key: getOptionPeriodsFieldKey(option),
          min: option.reward.minPeriods,
          max: option.reward.maxPeriods,
          default: option.reward.defaultPeriods,
          interval: option.reward.interval
        })
      }
      return fields
    }, [])

    const minPrice = calculateMinPrice(pkg, values, userPrice)
    const regularMinPrice = calculateMinPrice(pkg, values, false)
    const fixedPrice = pkg.name === 'MONTHLY_ABO'

    const onPriceChange = (_, value, shouldValidate) => {
      const price = String(value).length
        ? Math.round(parseInt(value, 10)) * 100 || 0
        : 0
      const error = priceError(price, minPrice, t)

      if (userPrice && price >= regularMinPrice) {
        this.resetUserPrice()
      }

      this.setState({ customPrice: true })
      onChange(
        FieldSet.utils.fieldsState({
          field: 'price',
          value: price,
          error,
          dirty: shouldValidate
        })
      )
    }

    const bonusValue = sum(
      pkg.options
        .filter(
          option =>
            option.additionalPeriods &&
            option.additionalPeriods.find(period => period.kind === 'BONUS')
        )
        .map(option => {
          const value = getOptionValue(option, values)
          if (!value) {
            return 0
          }
          const bonusDays = option.additionalPeriods
            .filter(period => period.kind === 'BONUS')
            .reduce(
              (days, period) =>
                days +
                timeDay.count(
                  new Date(period.beginDate),
                  new Date(period.endDate)
                ),
              0
            )
          const regularDays = option.additionalPeriods
            .filter(period => period.kind === 'REGULAR')
            .reduce(
              (days, period) =>
                days +
                timeDay.count(
                  new Date(period.beginDate),
                  new Date(period.endDate)
                ),
              0
            )
          return (
            Math.ceil(((option.price / regularDays) * bonusDays) / 100) *
            100 *
            value
          )
        })
    )
    const payMoreSuggestions =
      pkg.name === 'DONATE_POT'
        ? [
            { value: 6000, key: 'threemonth' },
            { value: 12000, key: 'halfayear' },
            { value: 24000, key: 'ayear' }
          ]
        : pkg.name === 'DONATE' ||
          pkg.name === 'ABO_GIVE_MONTHS' ||
          pkg.name === 'ABO_GIVE'
        ? []
        : [
            userPrice && { value: regularMinPrice, key: 'normal' },
            !userPrice &&
              price >= minPrice &&
              bonusValue && { value: minPrice + bonusValue, key: 'bonus' },
            !userPrice &&
              price >= minPrice && { value: minPrice * 1.5, key: '1.5' },
            !userPrice && price >= minPrice && { value: minPrice * 2, key: '2' }
          ].filter(Boolean)
    const payMoreReached = payMoreSuggestions
      .filter(({ value }) => price >= value)
      .pop()
    const offerUserPrice =
      !userPrice &&
      !payMoreReached &&
      pkg.name === 'PROLONG' &&
      pkg.options.every(option => {
        return (
          !getOptionValue(option, values) || option.userPrice || !option.price
        )
      })

    const optionGroups = nest()
      .key(d =>
        d.option.optionGroup
          ? d.option.optionGroup
          : [d.option.reward.__typename, d.option.accessGranted]
              .filter(Boolean)
              .join()
      )
      .entries(configurableFields)
      .map(({ key: groupKey, values: fields }) => {
        const options = fields
          .map(field => field.option)
          .filter((o, i, a) => a.indexOf(o) === i)
        const group = options[0].optionGroup
        const selectedGroupOption =
          group &&
          options.find(option => {
            return getOptionValue(option, values)
          })
        const baseOption = selectedGroupOption || options[0]
        const { membership, additionalPeriods } = baseOption
        const checkboxGroup =
          group &&
          fields.length === 1 &&
          baseOption.minAmount === 0 &&
          baseOption.maxAmount === 1
        const isAboGive =
          membership && membership.user.id !== (customMe && customMe.id)

        return {
          group,
          groupKey,
          checkboxGroup,
          options,
          fields,
          selectedGroupOption,
          membership,
          groupWithAccessGranted: options.some(o => o.accessGranted),
          isAboGive,
          isGoodies: groupKey === 'Goodie',
          additionalPeriods
        }
      })

    const multipleThings =
      configurableFields.length &&
      (optionGroups.length > 1 || !optionGroups[0].group)

    const descriptionKeys = [
      ownMembership &&
        `package/${crowdfundingName}/${pkg.name}/${ownMembership.type.name}/description`,
      ownMembership &&
        `package/${pkg.name}/${ownMembership.type.name}/description`,
      accessGrantedOnly && `package/${pkg.name}/accessGrantedOnly/description`,
      `package/${crowdfundingName}/${pkg.name}/description`,
      `package/${pkg.name}/description`
    ].filter(Boolean)
    const description = t.first(descriptionKeys)

    const queryWithoutFilter = { ...query }
    delete queryWithoutFilter.filter

    return (
      <div>
        <div style={{ marginTop: 20, marginBottom: 10 }}>
          <Interaction.H2 style={{ marginBottom: 10 }}>
            {t.first(
              [
                ownMembership &&
                  `package/${pkg.name}/${ownMembership.type.name}/pageTitle`,
                ownMembership &&
                  new Date(ownMembership.graceEndDate) < new Date() &&
                  `package/${pkg.name}/reactivate/pageTitle`,
                accessGrantedOnly &&
                  `package/${pkg.name}/accessGrantedOnly/title`,
                `package/${pkg.name}/pageTitle`,
                `package/${pkg.name}/title`
              ].filter(Boolean)
            )}
          </Interaction.H2>
          <Link
            href={{
              pathname: '/angebote',
              query:
                pkg.group && pkg.group !== 'ME'
                  ? { group: pkg.group }
                  : undefined
            }}
            shallow
            passHref
          >
            <A>{t('package/customize/changePackage')}</A>
          </Link>
        </div>
        {description.split('\n\n').map((text, i) => (
          <P style={{ marginBottom: 10 }} key={i}>
            {/* {i === 0 && !goodiesDescription && goodiesImage} */}
            {text.indexOf('<') !== -1 ? (
              <RawHtml dangerouslySetInnerHTML={{ __html: text }} />
            ) : (
              text
            )}
          </P>
        ))}
        {pkg.name === 'ABO_GIVE' && accessGrantedOnly && (
          <div {...styles.smallP} style={{ marginTop: -5, marginBottom: 15 }}>
            <Editorial.A
              href={format({
                pathname: '/angebote',
                query: accessGrantedOnly
                  ? queryWithoutFilter
                  : { ...query, filter: 'pot' }
              })}
              onClick={e => {
                if (shouldIgnoreClick(e)) {
                  return
                }
                e.preventDefault()

                const fullPackages = this.props.packages.find(
                  p => p.name === pkg.name
                )
                if (fullPackages) {
                  fullPackages.options.forEach(optionFull => {
                    const optionFiltered = pkg.options.find(
                      d =>
                        d.reward &&
                        d.reward.__typename === optionFull.reward.__typename &&
                        d.reward.name === optionFull.reward.name
                    )
                    if (!optionFiltered) {
                      return
                    }
                    onChange(
                      FieldSet.utils.fieldsState({
                        field: getOptionFieldKey(optionFull),
                        value: Math.min(
                          Math.max(
                            getOptionValue(optionFiltered, values),
                            optionFull.minAmount
                          ),
                          optionFull.maxAmount
                        ),
                        error: undefined,
                        dirty: true
                      })
                    )
                  })
                }

                router
                  .push(
                    {
                      pathname: '/angebote',
                      query: accessGrantedOnly
                        ? queryWithoutFilter
                        : { ...query, filter: 'pot' }
                    },
                    undefined,
                    {
                      shallow: true
                    }
                  )
                  .then(() => {
                    this.resetPrice()
                  })
              }}
            >
              {t(
                `package/customize/ABO_GIVE/${
                  accessGrantedOnly ? 'rm' : 'add'
                }AccessGrantedOnly`
              )}
            </Editorial.A>{' '}
            {accessGrantedOnly && (
              <Editorial.A
                href={format({
                  pathname: '/angebote',
                  query: { package: 'DONATE_POT' }
                })}
                onClick={e => {
                  if (shouldIgnoreClick(e)) {
                    return
                  }
                  e.preventDefault()
                  router.push(
                    { pathname: '/angebote', query: { package: 'DONATE_POT' } },
                    undefined,
                    {
                      shallow: true
                    }
                  )
                }}
              >
                {t('package/customize/ABO_GIVE/donate')}
              </Editorial.A>
            )}
          </div>
        )}

        {optionGroups
          // FILTER OUT GOODIES
          .filter(group => group.groupKey !== 'Goodie')
          .map(
            (
              {
                group,
                groupKey,
                checkboxGroup,
                fields,
                options,
                selectedGroupOption,
                membership,
                groupWithAccessGranted,
                isAboGive,
                isGoodies,
                additionalPeriods
              },
              gi
            ) => {
              const reset = group && optionGroups && !checkboxGroup && (
                <Fragment>
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Radio
                      value='0'
                      checked={!selectedGroupOption}
                      onChange={() => {
                        if (userPrice) {
                          this.resetUserPrice()
                        }
                        onChange(
                          this.calculateNextPrice(
                            options.reduce((fields, option) => {
                              return FieldSet.utils.mergeField({
                                field: getOptionFieldKey(option),
                                value: 0,
                                error: undefined,
                                dirty: false
                              })(fields)
                            }, {})
                          )
                        )
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'top',
                          marginRight: 20,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {t(`option/${pkg.name}/resetGroup`, {}, null)}
                      </span>
                    </Radio>
                  </span>
                </Fragment>
              )

              const nextGroup = optionGroups[gi + 1]
              const prevGroup = optionGroups[gi - 1]

              return (
                <Fragment key={groupKey}>
                  {isAboGive && (!prevGroup || !prevGroup.isAboGive) && (
                    <P style={{ marginTop: 30 }}>
                      {t('package/customize/group/aboGive')}
                    </P>
                  )}
                  {membership && (
                    <ManageMembership
                      title={
                        isAboGive
                          ? t(
                              `memberships/title/${membership.type.name}/give`,
                              {
                                name: membership.claimerName,
                                sequenceNumber: membership.sequenceNumber
                              }
                            )
                          : undefined
                      }
                      membership={membership}
                      actions={false}
                      compact
                    />
                  )}
                  <div {...styles[group ? 'group' : 'grid']}>
                    {fields.map((field, i) => {
                      const option = field.option
                      const fieldKey = field.key
                      const elementKey = [option.id, fieldKey].join('-')
                      const value =
                        values[fieldKey] === undefined
                          ? field.default
                          : values[fieldKey]

                      const isBooleanOption = field.min === 0 && field.max === 1
                      const isCheckboxOption =
                        checkboxGroup || (isGoodies && isBooleanOption)

                      // always use singular for goodie checkbox
                      const labelValue = isCheckboxOption ? 1 : value
                      const label = t.first(
                        [
                          ...(isAboGive
                            ? [
                                `option/${pkg.name}/${option.reward.name}/label/give`,
                                `option/${option.reward.name}/label/give`
                              ]
                            : []),
                          ...(option.accessGranted
                            ? [
                                `option/${pkg.name}/${option.reward.name}/accessGranted/label/${labelValue}`,
                                `option/${pkg.name}/${option.reward.name}/accessGranted/label/other`,
                                `option/${pkg.name}/${option.reward.name}/accessGranted/label`,
                                `option/${option.reward.name}/accessGranted/label/${labelValue}`,
                                `option/${option.reward.name}/accessGranted/label/other`,
                                `option/${option.reward.name}/accessGranted/label`
                              ]
                            : []),
                          ...(field.interval
                            ? [
                                `option/${pkg.name}/${option.reward.name}/interval/${field.interval}/label/${labelValue}`,
                                `option/${pkg.name}/${option.reward.name}/interval/${field.interval}/label/other`,
                                `option/${pkg.name}/${option.reward.name}/interval/${field.interval}/label`,
                                `option/${option.reward.name}/interval/${field.interval}/label/${labelValue}`,
                                `option/${option.reward.name}/interval/${field.interval}/label/other`,
                                `option/${option.reward.name}/interval/${field.interval}/label`
                              ]
                            : []),
                          `option/${pkg.name}/${option.reward.name}/label/${labelValue}`,
                          `option/${pkg.name}/${option.reward.name}/label/other`,
                          `option/${pkg.name}/${option.reward.name}/label`,
                          `option/${option.reward.name}/label/${labelValue}`,
                          `option/${option.reward.name}/label/other`,
                          `option/${option.reward.name}/label`
                        ],
                        {
                          count: value
                        }
                      )

                      const onFieldChange = (_, value, shouldValidate) => {
                        let error
                        const parsedValue = String(value).length
                          ? parseInt(value, 10) || 0
                          : ''

                        if (parsedValue > field.max) {
                          error = t('package/customize/option/error/max', {
                            label,
                            maxAmount: field.max
                          })
                        }
                        if (parsedValue < field.min) {
                          error = t('package/customize/option/error/min', {
                            label,
                            minAmount: field.min
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
                          options
                            .filter(other => other !== option)
                            .forEach(other => {
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

                      if (isBooleanOption && (group || isCheckboxOption)) {
                        const children = (
                          <span
                            style={{
                              display: 'inline-block',
                              verticalAlign: 'top',
                              marginRight: 20,
                              marginTop: isCheckboxOption ? -2 : 0
                            }}
                          >
                            <Interaction.Emphasis>{label}</Interaction.Emphasis>
                            <br />
                            {t.first(
                              [
                                option.price === 0 && 'package/price/free',
                                isGoodies && 'package/price/goodie',
                                isAboGive && `package/${pkg.name}/price/give`,
                                `package/${pkg.name}/price`,
                                'package/price'
                              ].filter(Boolean),
                              {
                                formattedCHF: chfFormat(option.price / 100)
                              }
                            )}
                          </span>
                        )
                        if (isCheckboxOption) {
                          const checkboxElement = (
                            <Checkbox
                              key={elementKey}
                              checked={!!value}
                              onChange={(_, checked) => {
                                onFieldChange(
                                  undefined,
                                  +checked,
                                  dirty[fieldKey]
                                )
                              }}
                            >
                              {children}
                            </Checkbox>
                          )

                          if (!group) {
                            return (
                              <div
                                key={elementKey}
                                {...styles.span}
                                {...styles.group}
                                style={{
                                  width: '100%'
                                }}
                              >
                                {checkboxElement}
                              </div>
                            )
                          }

                          return checkboxElement
                        }
                        return (
                          <Fragment key={elementKey}>
                            <span
                              style={{
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                                marginBottom: 10
                              }}
                            >
                              <Radio
                                value='1'
                                checked={!!value}
                                onChange={() => {
                                  onFieldChange(undefined, 1, dirty[fieldKey])
                                }}
                              >
                                {children}
                              </Radio>
                            </span>{' '}
                          </Fragment>
                        )
                      }

                      return (
                        <div
                          key={elementKey}
                          {...styles.span}
                          style={{
                            width:
                              fields.length === 1 ||
                              (fields.length === 3 && i === 0)
                                ? '100%'
                                : '50%'
                          }}
                        >
                          <div>
                            <Field
                              ref={
                                i === 0 && !group && gi === 0
                                  ? this.focusRefSetter
                                  : undefined
                              }
                              label={label}
                              error={dirty[fieldKey] && errors[fieldKey]}
                              value={value || ''}
                              onInc={
                                value < field.max &&
                                (() => {
                                  onFieldChange(
                                    undefined,
                                    value + 1,
                                    dirty[fieldKey]
                                  )
                                })
                              }
                              onDec={
                                value > field.min &&
                                (() => {
                                  onFieldChange(
                                    undefined,
                                    value - 1,
                                    dirty[fieldKey]
                                  )
                                })
                              }
                              onChange={onFieldChange}
                            />
                          </div>
                        </div>
                      )
                    })}
                    {reset}
                  </div>
                  {additionalPeriods &&
                    !!additionalPeriods.length &&
                    !!selectedGroupOption && (
                      <div style={{ marginBottom: 20 }}>
                        {additionalPeriods
                          .filter(
                            (period, i) => period.kind !== 'REGULAR' || i > 0
                          )
                          .map(period => {
                            const beginDate = new Date(period.beginDate)
                            const endDate = new Date(period.endDate)
                            const formattedEndDate = dayFormat(endDate)
                            const days = timeDay.count(beginDate, endDate)

                            const title = t.first(
                              [
                                `option/${pkg.name}/additionalPeriods/${period.kind}/title`,
                                `option/${pkg.name}/additionalPeriods/title`
                              ],
                              {
                                formattedEndDate,
                                days
                              }
                            )
                            const explanation = t.first(
                              [
                                `option/${pkg.name}/additionalPeriods/${period.kind}/explanation`,
                                `option/${pkg.name}/additionalPeriods/explanation`
                              ],
                              {
                                formattedEndDate,
                                days
                              },
                              ''
                            )

                            return (
                              <SmallP key={formattedEndDate}>
                                {title}
                                {explanation && (
                                  <Fragment>
                                    <Label style={{ display: 'block' }}>
                                      {explanation}
                                    </Label>
                                  </Fragment>
                                )}
                              </SmallP>
                            )
                          })}
                        <SmallP>
                          <Interaction.Emphasis>
                            {t(`option/${pkg.name}/additionalPeriods/endDate`, {
                              formattedEndDate: dayFormat(
                                new Date(
                                  additionalPeriods[
                                    additionalPeriods.length - 1
                                  ].endDate
                                )
                              )
                            })}
                          </Interaction.Emphasis>
                        </SmallP>
                        {isAboGive && (
                          <SmallP>
                            {t(`option/${pkg.name}/additionalPeriods/give`, {
                              name: membership.claimerName
                            })}
                          </SmallP>
                        )}
                      </div>
                    )}
                  {isAboGive && (!nextGroup || !nextGroup.isAboGive) && (
                    <div style={{ height: 30 }} />
                  )}
                  {groupWithAccessGranted && accessGrantedOnly && (
                    <div style={{ marginBottom: 20 }}>
                      <P>{t('package/customize/messageToClaimers/before')}</P>
                      <Field
                        label={t('package/customize/messageToClaimers/label')}
                        value={values.messageToClaimers}
                        renderInput={({ ref, ...inputProps }) => (
                          <AutosizeInput
                            {...inputProps}
                            {...fieldSetStyles.autoSize}
                            inputRef={ref}
                          />
                        )}
                        onChange={(_, value, shouldValidate) => {
                          onChange(
                            FieldSet.utils.fieldsState({
                              field: 'messageToClaimers',
                              value,
                              dirty: shouldValidate
                            })
                          )
                        }}
                      />
                      <RawHtml
                        type={Label}
                        dangerouslySetInnerHTML={{
                          __html: t('package/customize/messageToClaimers/note')
                        }}
                      />
                    </div>
                  )}
                </Fragment>
              )
            }
          )}
        {/* RENDER GOODIES HERE */}
        <GoodieOptions
          t={t}
          onChange={fields => {
            onChange(this.calculateNextPrice(fields))
          }}
          fields={optionGroups.filter(group => !!group.isGoodies)[0]?.fields}
        />
        {!!userPrice && (
          <div>
            <P>{t('package/customize/userPrice/beforeReason')}</P>
            <div style={{ marginBottom: 20 }}>
              <Field
                label={t('package/customize/userPrice/reason/label')}
                ref={this.focusRefSetter}
                error={dirty.reason && errors.reason}
                value={values.reason}
                renderInput={({ ref, ...inputProps }) => (
                  <AutosizeInput
                    {...inputProps}
                    {...fieldSetStyles.autoSize}
                    inputRef={ref}
                  />
                )}
                onChange={(_, value, shouldValidate) => {
                  onChange(
                    FieldSet.utils.fieldsState({
                      field: 'reason',
                      value,
                      error: reasonError(value, t),
                      dirty: shouldValidate
                    })
                  )
                }}
              />
            </div>
            <P>{t('package/customize/userPrice/beforePrice')}</P>
          </div>
        )}
        <div style={{ marginBottom: 20 }}>
          {fixedPrice ? (
            <Interaction.P>
              <Label>{t('package/customize/price/label')}</Label>
              <br />
              {price / 100}
            </Interaction.P>
          ) : (
            <Field
              label={t(
                `package/customize/price/label${multipleThings ? '/total' : ''}`
              )}
              ref={
                configurableFields.length || userPrice
                  ? undefined
                  : this.focusRefSetter
              }
              error={dirty.price && errors.price}
              value={price ? price / 100 : ''}
              onDec={
                price - 1000 >= minPrice &&
                (() => {
                  onPriceChange(undefined, (price - 1000) / 100, dirty.price)
                })
              }
              onInc={() => {
                onPriceChange(undefined, (price + 1000) / 100, dirty.price)
              }}
              onChange={onPriceChange}
            />
          )}
          {!fixedPrice && (
            <div {...styles.smallP}>
              {payMoreSuggestions.length > 0 && (
                <Fragment>
                  <Interaction.Emphasis>
                    {t.first([
                      `package/customize/price/payMore/${pkg.name}`,
                      'package/customize/price/payMore'
                    ])}
                  </Interaction.Emphasis>
                  <ul {...styles.ul}>
                    {payMoreSuggestions.map(({ value, key }) => {
                      const label = t.elements(
                        `package/customize/price/payMore/${key}`,
                        {
                          formattedCHF: chfFormat(value / 100)
                        }
                      )
                      if (price >= value) {
                        return <li key={key}>{label}</li>
                      }
                      return (
                        <li key={key}>
                          <Editorial.A
                            href='#'
                            onClick={e => {
                              e.preventDefault()
                              onPriceChange(undefined, value / 100, true)
                              if (userPrice) {
                                this.resetUserPrice()
                              }
                            }}
                          >
                            {label}
                          </Editorial.A>
                        </li>
                      )
                    })}
                  </ul>
                  {!!payMoreReached && (
                    <div {...styles.ulNote}>
                      <Interaction.Emphasis>
                        {t.first([
                          `package/customize/price/payMore/thx/${payMoreReached.key}`,
                          'package/customize/price/payMore/thx'
                        ])}
                      </Interaction.Emphasis>
                    </div>
                  )}
                </Fragment>
              )}
              {pkg.name === 'ABO_GIVE_MONTHS' && (
                <Fragment>
                  <Interaction.Emphasis>
                    {t.first([
                      `package/customize/price/payMore/${pkg.name}`,
                      'package/customize/price/payMore'
                    ])}
                  </Interaction.Emphasis>
                  <ul {...styles.ul}>
                    <li>
                      <Editorial.A
                        href={format({
                          pathname: '/angebote',
                          query: { package: 'ABO_GIVE' }
                        })}
                        onClick={e => {
                          if (shouldIgnoreClick(e)) {
                            return
                          }
                          e.preventDefault()

                          const aboGive = this.props.packages.find(
                            p => p.name === 'ABO_GIVE'
                          )
                          if (aboGive) {
                            const numMembershipMonths = pkg.options.find(
                              o =>
                                o.reward &&
                                o.reward.__typename === 'MembershipType'
                            )
                            const numMembershipYears = aboGive.options.find(
                              o =>
                                o.reward &&
                                o.reward.__typename === 'MembershipType'
                            )
                            if (numMembershipMonths && numMembershipYears) {
                              onChange(
                                FieldSet.utils.fieldsState({
                                  field: getOptionFieldKey(numMembershipYears),
                                  value: Math.min(
                                    Math.max(
                                      getOptionValue(
                                        numMembershipMonths,
                                        values
                                      ),
                                      numMembershipYears.minAmount
                                    ),
                                    numMembershipYears.maxAmount
                                  ),
                                  error: undefined,
                                  dirty: true
                                })
                              )
                            }

                            aboGive.options
                              .filter(
                                o =>
                                  o.reward && o.reward.__typename === 'Goodie'
                              )
                              .forEach(oYears => {
                                const oMonths = pkg.options.find(
                                  d =>
                                    d.reward &&
                                    d.reward.__typename ===
                                      oYears.reward.__typename &&
                                    d.reward.name === oYears.reward.name
                                )
                                if (!oMonths) {
                                  return
                                }
                                onChange(
                                  FieldSet.utils.fieldsState({
                                    field: getOptionFieldKey(oYears),
                                    value: Math.min(
                                      Math.max(
                                        getOptionValue(oMonths, values),
                                        oYears.minAmount
                                      ),
                                      oYears.maxAmount
                                    ),
                                    error: undefined,
                                    dirty: true
                                  })
                                )
                              })
                          }

                          router
                            .push(
                              {
                                pathname: '/angebote',
                                query: { package: 'ABO_GIVE' }
                              },
                              undefined,
                              { shallow: true }
                            )
                            .then(() => {
                              this.resetPrice()
                            })
                        }}
                      >
                        {t.pluralize(
                          'package/customize/ABO_GIVE_MONTHS/years',
                          {
                            count: getOptionValue(
                              pkg.options.find(
                                option =>
                                  option.reward &&
                                  option.reward.__typename === 'MembershipType'
                              ),
                              values
                            )
                          }
                        )}
                      </Editorial.A>
                    </li>
                  </ul>
                </Fragment>
              )}
              {payMoreReached && (
                <Fragment>
                  <Editorial.A
                    href={format({
                      pathname: '/angebote',
                      query: { ...query, price: undefined }
                    })}
                    onClick={e => {
                      if (shouldIgnoreClick(e)) {
                        return
                      }
                      e.preventDefault()
                      onPriceChange(undefined, minPrice / 100, true)

                      router
                        .replace(
                          {
                            pathname: '/angebote',
                            query: { ...query, price: undefined }
                          },
                          undefined,
                          { shallow: true }
                        )
                        .then(() => {
                          if (this.focusRef && this.focusRef.input) {
                            this.focusRef.focus()
                          }
                        })
                    }}
                  >
                    {t.first([
                      `package/customize/price/payRegular/${pkg.name}`,
                      'package/customize/price/payRegular'
                    ])}
                  </Editorial.A>
                  <br />
                </Fragment>
              )}
              {offerUserPrice && (
                <Fragment>
                  <Editorial.A
                    href={format({
                      pathname: '/angebote',
                      query: { ...query, price: undefined, userPrice: 1 }
                    })}
                    onClick={e => {
                      if (shouldIgnoreClick(e)) {
                        return
                      }
                      e.preventDefault()

                      const selectedUserPriceOption = pkg.options.find(
                        option => {
                          return (
                            getOptionValue(option, values) && option.userPrice
                          )
                        }
                      )
                      if (!selectedUserPriceOption) {
                        const firstUserPriceOption = pkg.options.find(
                          option => {
                            return option.userPrice
                          }
                        )
                        onChange(
                          FieldSet.utils.fieldsState({
                            field: getOptionFieldKey(firstUserPriceOption),
                            value: firstUserPriceOption.maxAmount
                          })
                        )
                      }

                      router
                        .replace(
                          {
                            pathname: '/angebote',
                            query: { ...query, price: undefined, userPrice: 1 }
                          },
                          undefined,
                          { shallow: true }
                        )
                        .then(() => {
                          this.resetPrice()
                          if (this.focusRef && this.focusRef.input) {
                            this.focusRef.focus()
                          }
                        })
                    }}
                  >
                    {t('package/customize/price/payLess')}
                  </Editorial.A>
                  <br />
                </Fragment>
              )}
            </div>
          )}
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

export default compose(withRouter, withT)(CustomizePackage)
