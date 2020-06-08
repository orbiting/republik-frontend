import React from 'react'
import withT from '../../lib/withT'
import { FieldSet, Label, colors } from '@project-r/styleguide'

export const COUNTRIES = ['Schweiz', 'Deutschland', 'Österreich']

export const DEFAULT_COUNTRY = COUNTRIES[0]

export const fields = t => [
  {
    label: t('Account/AddressForm/name/label'),
    name: 'name',
    validator: value => !value && t('Account/AddressForm/name/error/empty'),
    explanation: (
      <Label
        style={{
          marginTop: -10,
          marginBottom: 10,
          display: 'block',
          color: colors.disabled
        }}
      >
        {t('Account/AddressForm/name/explanation')}
      </Label>
    )
  },
  {
    label: t('Account/AddressForm/line1/label'),
    name: 'line1',
    validator: value => !value && t('Account/AddressForm/line1/error/empty')
  },
  {
    label: t('Account/AddressForm/line2/label'),
    name: 'line2'
  },
  {
    label: t('Account/AddressForm/postalCode/label'),
    name: 'postalCode',
    validator: value =>
      !value && t('Account/AddressForm/postalCode/error/empty')
  },
  {
    label: t('Account/AddressForm/city/label'),
    name: 'city',
    validator: value => !value && t('Account/AddressForm/city/error/empty')
  },
  {
    label: t('Account/AddressForm/country/label'),
    name: 'country',
    validator: value => !value && t('Account/AddressForm/country/error/empty')
  }
]

export const isEmptyAddress = (values, me) => {
  const addressString = [
    values.name,
    values.line1,
    values.line2,
    values.postalCode,
    values.city,
    values.country
  ]
    .join('')
    .trim()
  const emptyAddressString = [me.name, DEFAULT_COUNTRY].join('').trim()

  return addressString === emptyAddressString
}

const Form = ({ t, values, errors, dirty, onChange }) => (
  <FieldSet
    values={values}
    errors={errors}
    dirty={dirty}
    fields={fields(t)}
    onChange={onChange}
  />
)

export default withT(Form)
