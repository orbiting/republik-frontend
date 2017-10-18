import React, {Component} from 'react'
import {gql, graphql} from 'react-apollo'
import {compose} from 'redux'
import {InlineSpinner} from '../Spinner'
import {intersperse} from '../../lib/utils/helpers'
import Loader from '../Loader'
import {errorToString} from '../../lib/utils/errors'
import {swissTime} from '../../lib/utils/format'

import withT from '../../lib/withT'
import AddressForm, {COUNTRIES, fields as addressFields} from './AddressForm'

import {
  FieldSet, Interaction, Label, Button, A, colors
} from '@project-r/styleguide'

const {H2, P} = Interaction

const birthdayFormat = '%d.%m.%Y'
const birthdayParse = swissTime.parse(birthdayFormat)

const fields = (t) => [
  {
    label: t('pledge/contact/firstName/label'),
    name: 'firstName',
    validator: (value) => (
      value.trim().length <= 0 && t('pledge/contact/firstName/error/empty')
    )
  },
  {
    label: t('pledge/contact/lastName/label'),
    name: 'lastName',
    validator: (value) => (
      value.trim().length <= 0 && t('pledge/contact/lastName/error/empty')
    )
  },
  {
    label: t('Account/Update/phone/label'),
    name: 'phoneNumber'
  },
  {
    label: t('Account/Update/birthday/label'),
    name: 'birthday',
    mask: '11.11.1111',
    maskChar: '_',
    validator: (value) => {
      const parsedDate = birthdayParse(value)
      return (
        (
          (
            value.trim().length <= 0 &&
            t('Account/Update/birthday/error/empty')
          ) ||
          (
            (
              parsedDate === null ||
              parsedDate > (new Date()) ||
              parsedDate < (new Date(1798, 3, 12))
            ) &&
            t('Account/Update/birthday/error/invalid')
          )
        )
      )
    }
  }
]

const getValues = (me) => {
  let addressState = {}
  if (me.address) {
    addressState = {
      name: me.address.name || me.name,
      line1: me.address.line1,
      line2: me.address.line2,
      postalCode: me.address.postalCode,
      city: me.address.city,
      country: me.address.country
    }
  } else if (me) {
    addressState.name = [
      me.firstName,
      me.lastName
    ].filter(Boolean).join(' ')
  }

  return {
    firstName: me.firstName || '',
    lastName: me.lastName || '',
    birthday: me.birthday || '',
    ...addressState
  }
}

class UpdateMe extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      showErrors: false,
      values: {
        country: COUNTRIES[0]
      },
      errors: {},
      dirty: {}
    }
  }
  startEditing () {
    const {me} = this.props
    this.setState((state) => ({
      isEditing: true,
      values: {
        ...state.values,
        ...getValues(me)
      }
    }))
  }
  autoEdit () {
    if (this.props.me && !this.checked) {
      this.checked = true
      const {t} = this.props

      const errors = FieldSet.utils.getErrors(
        fields(t).concat(addressFields(t)),
        getValues(this.props.me)
      )

      const errorMessages = Object.keys(errors)
        .map(key => errors[key])
        .filter(Boolean)
      errorMessages.length && this.startEditing()
    }
  }
  componentDidMount () {
    this.autoEdit()
  }
  componentDidUpdate () {
    this.autoEdit()
  }
  render () {
    const {t, me, loading, error} = this.props
    const {
      values, dirty, errors,
      updating, isEditing
    } = this.state

    const errorMessages = Object.keys(errors)
      .map(key => errors[key])
      .filter(Boolean)

    return (
      <Loader loading={loading} error={error} render={() => (
        <div>
          {!isEditing ? (
            <div>
              <H2 style={{marginBottom: 30}}>{t('Account/Update/title')}</H2>
              <P>
                {intersperse(
                  [
                    me.name,
                    me.phoneNumber
                  ].filter(Boolean),
                  (_, i) => <br key={i} />
                )}
              </P>
              <P>
                <Label key='birthday'>{t('Account/Update/birthday/label')}</Label><br />
                {me.birthday}
              </P>
              <P>
                <Label>{t('Account/Update/address/label')}</Label><br />
              </P>
              <P>
                {!!me.address && intersperse(
                  [
                    me.address.name,
                    me.address.line1,
                    me.address.line2,
                    `${me.address.postalCode} ${me.address.city}`,
                    me.address.country
                  ].filter(Boolean),
                  (_, i) => <br key={i} />
                )}
              </P>
              <br />
              <A href='#' onClick={(e) => {
                e.preventDefault()
                this.startEditing()
              }}>{t('Account/Update/edit')}</A>
            </div>
          ) : (
            <div>
              <H2>{t('Account/Update/title')}</H2>
              <br />
              <FieldSet
                values={values}
                errors={errors}
                dirty={dirty}
                onChange={(fields) => {
                  this.setState(FieldSet.utils.mergeFields(fields))
                }}
                fields={fields(t)} />
              <Label style={{marginTop: -8, display: 'block'}}>
                {t('Account/Update/birthday/hint')}
              </Label>
              <br /><br />
              <br />
              <AddressForm
                values={values}
                errors={errors}
                dirty={dirty}
                onChange={(fields) => {
                  this.setState(FieldSet.utils.mergeFields(fields))
                }} />
              <br />
              <br />
              <br />
              {updating ? (
                <div style={{textAlign: 'center'}}>
                  <InlineSpinner />
                  <br />
                  {t('Account/Update/updating')}
                </div>
              ) : (
                <div>
                  {!!this.state.showErrors && errorMessages.length > 0 && (
                    <div style={{color: colors.error, marginBottom: 40}}>
                      {t('pledge/submit/error/title')}<br />
                      <ul>
                        {errorMessages.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!!this.state.error && (
                    <div style={{color: colors.error, marginBottom: 40}}>
                      {this.state.error}
                    </div>
                  )}
                  <div style={{opacity: errorMessages.length ? 0.5 : 1}}>
                    <Button onClick={() => {
                      if (errorMessages.length) {
                        this.setState((state) => Object.keys(state.errors).reduce(
                          (nextState, key) => {
                            nextState.dirty[key] = true
                            return nextState
                          },
                          {
                            showErrors: true,
                            dirty: {}
                          }
                        ))
                        return
                      }
                      this.setState(() => ({updating: true}))
                      this.props.update({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phoneNumber: values.phoneNumber,
                        birthday: values.birthday,
                        address: {
                          name: values.name,
                          line1: values.line1,
                          line2: values.line2,
                          postalCode: values.postalCode,
                          city: values.city,
                          country: values.country
                        }
                      }).then(() => {
                        this.setState(() => ({
                          updating: false,
                          isEditing: false
                        }))
                      }).catch((error) => {
                        this.setState(() => ({
                          updating: false,
                          error: errorToString(error)
                        }))
                      })
                    }}>{t('Account/Update/submit')}</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )} />
    )
  }
}

const mutation = gql`mutation updateMe($birthday: Date!, $firstName: String!, $lastName: String!, $phoneNumber: String, $address: AddressInput!) {
  updateMe(birthday: $birthday, firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, address: $address) {
    id
  }
}`
export const query = gql`
  query myAddress {
    me {
      id
      name
      firstName
      lastName
      phoneNumber
      email
      birthday
      address {
        name
        line1
        line2
        postalCode
        city
        country
      }
    }
  }
`

export default compose(
  graphql(mutation, {
    props: ({mutate}) => ({
      update: variables => mutate({
        variables,
        refetchQueries: [{
          query
        }]
      })
    })
  }),
  graphql(query, {
    props: ({data}) => ({
      loading: data.loading,
      error: data.error,
      me: data.loading ? undefined : data.me
    })
  }),
  withT
)(UpdateMe)
