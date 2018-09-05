import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Interaction, Field } from '@project-r/styleguide'

import withT from '../../lib/withT'

export const getFieldsError = (t, required, fields) =>
  required
    .map(
      requiredField => validateField(
        t,
        requiredField,
        fields[requiredField] && fields[requiredField].value
      )
    )
    .filter(Boolean)
    .join(', ')

export const validateField = (t, field, value) => {
  if (!value || value.trim().length < 1) {
    return t(`pledge/fields/error/${field}/missing`)
  }

  return false
}

const Fields = withT(({t, fields, onChange, required}) => {
  return (
    <Fragment>
      <Interaction.P>{t('pledge/fields/explanation')}</Interaction.P>
      {required.map(field => {
        const data = (fields[field] && fields[field]) || {}
        const value = data.value || ''
        const error = data.error || false

        return (
          <Field
            key={`field-${field}`}
            name={field}
            label={t(`pledge/fields/label/${field}`)}
            error={error}
            onChange={onChange}
            value={value} />
        )
      })}
    </Fragment>
  )
})

Fields.propTypes = {
  onChange: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  required: PropTypes.arrayOf(PropTypes.string.isRequired)
}

export default Fields
