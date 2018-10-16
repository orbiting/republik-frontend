import React, { Component } from 'react'
import AddressForm, { COUNTRIES } from '../Account/AddressForm'
import FieldSet from '../FieldSet'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import {
  Button,
  InlineSpinner,
  colors
} from '@project-r/styleguide'
import ErrorMessage from '../ErrorMessage'
import Loader from '../Loader'
import withT from '../../lib/withT'
import voteT from './voteT'

const DEFAULT_COUNTRY = COUNTRIES[0]

class AddressEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: {},
      dirty: {},
      ...this.deriveStateFromProps(props)
    }

    this.save = async () => {
      const { updateAddress } = props
      const { values } = this.state

      this.setState({ updating: true })

      await updateAddress(values)
        .then(() =>
          this.setState(() => ({
            updating: false,
            error: null
          }))
        )
        .catch((error) => {
          this.setState(() => ({
            updating: false,
            error
          }))
        })
    }
  }

  deriveStateFromProps ({ data }) {
    const { address } = data.me || {}
    const { name, line1, line2, city, postalCode, country = DEFAULT_COUNTRY } = address || {}
    return {
      values: {
        name,
        line1,
        line2,
        city,
        postalCode,
        country
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.me && nextProps.data.me !== this.props.data.me) {
      this.setState(this.deriveStateFromProps(nextProps))
    }
  }

  render () {
    const { data, t, vt } = this.props
    const { values, errors, error, dirty, updating } = this.state
    const isValid = !Object.keys(errors).some(k => Boolean(errors[k]))

    return (
      <Loader loading={data.loading} error={data.error} render={() =>
        <>
          <div>
            <AddressForm
              values={values}
              errors={errors}
              dirty={dirty}
              onChange={(fields) => {
                this.setState(FieldSet.utils.mergeFields(fields))
              }} />
          </div>
          {
            error &&
            <div>
              <ErrorMessage error={error} />
            </div>
          }
          { !isValid &&
            <div style={{ color: colors.error }}>
              { vt('info/candidacy/missingFields') }
              <ul>
                { Object.keys(errors).map(k => !!errors[k] &&
                  <li key={k}>{ errors[k] }</li>) }
              </ul>
            </div>
          }
          <div>
            <Button primary onClick={this.save} disabled={!isValid}>
              {updating
                ? <InlineSpinner size={40} />
                : t('Account/Update/submit')
              }
            </Button>
          </div>
        </>
      } />
    )
  }
}

const updateAddressMutation = gql`mutation updateAddress($address: AddressInput) {
  updateMe(address: $address) {
    id
    address {
      name
      line1
      line2
      postalCode
      city
      country
    }
  }
}`

const query = gql`
  query {
    me {
      id
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
  withT,
  voteT,
  graphql(updateAddressMutation, {
    props: ({ mutate }) => ({
      updateAddress: address => {
        return mutate({
          variables: {
            address
          }
        })
      }
    })
  }),
  graphql(query)
)(AddressEditor)
