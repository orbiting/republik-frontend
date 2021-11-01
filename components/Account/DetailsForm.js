import React from 'react'
import { colors, Interaction, Loader } from '@project-r/styleguide'
import AddressForm from './AddressForm'
import FieldSet from '../FieldSet'
import withT from '../../lib/withT'
import compose from 'lodash/flowRight'

const { H2, P } = Interaction

const fields = t => [
  {
    label: t('Account/Update/phone/label/alt'),
    name: 'phoneNumber'
  }
]

export default compose(withT)(
  ({
    t,
    data,
    values,
    errors,
    dirty,
    onChange,
    errorMessages,
    showErrors,
    style
  }) => {
    const { loading, error } = data
    const me = loading ? undefined : data.me

    return (
      <Loader
        loading={loading || !me}
        error={error}
        render={() => {
          const meFields = fields(t)

          return (
            <div style={style}>
              <H2 style={{ marginBottom: 30 }}>
                {t('Account/Update/details/title')}
              </H2>
              <div>
                <br />
                <FieldSet
                  values={values}
                  errors={errors}
                  dirty={dirty}
                  onChange={onChange}
                  fields={meFields}
                />
                <br />
                <br />
                <br />
                <AddressForm
                  values={values}
                  errors={errors}
                  dirty={dirty}
                  onChange={onChange}
                />
                <br />
                <br />
                <br />
                {showErrors && errorMessages.length > 0 && (
                  <div
                    style={{
                      color: colors.error,
                      marginBottom: 40
                    }}
                  >
                    {t('pledge/submit/error/title')}
                    <br />
                    <ul>
                      {errorMessages.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        }}
      />
    )
  }
)
