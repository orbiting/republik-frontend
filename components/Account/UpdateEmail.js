import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import {validate as isEmail} from 'email-validator'

import { errorToString } from '../../lib/utils/errors'
import withT from '../../lib/withT'
import { query } from './UpdateMe'

import {
  InlineSpinner, Button, A, Field, Interaction
} from '@project-r/styleguide'

const { P, H2 } = Interaction

const getValue = me => me.email

const CancelLink = ({children, onClick, ...props}) =>
  <A
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
    {...props}
    style={{display: 'block', marginTop: 5, cursor: 'pointer'}}>
    {children}
  </A>

const InlineLoader = ({ children }) => (
  <div style={{textAlign: 'center'}}>
    <InlineSpinner />
    <br />
  </div>)

class UpdateEmail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isEditing: false,
      value: '',
      error: false,
      dirty: false
    }
  }

  updateValue (value, shouldValidate) {
    this.setState(() => ({
      value,
      error: (
        value.trim().length <= 0 &&
        this.props.t('Account/Update/email/empty')
      ) || (
        !isEmail(value) &&
        this.props.t('Account/Update/email/error/invalid')
      ),
      dirty: {
        email: shouldValidate
      }
    }))
  }

  submit () {
    const { value } = this.state
    const { t, me } = this.props
    if (!window.confirm(t('Account/Update/email/confirm', { email: value }))) {
      return
    }

    this.setState(() => ({updating: true}))
    this.props.updateEmail({
      email: value,
      userId: me.id
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
  }

  startEditing () {
    this.setState((state) => ({
      isEditing: true
    }))
  }

  cancelEditing () {
    this.setState({
      isEditing: false
    })
  }

  renderEditButton () {
    const { t } = this.props
    return (
      <A href='#' onClick={e => {
        e.preventDefault()
        this.startEditing()
      }}>
        {t('Account/Update/email/edit')}
      </A>
    )
  }

  renderForm () {
    const { t } = this.props
    const { value, error } = this.state
    return (
      <Fragment>
        <P>{t('Account/Update/email/hint')}</P>
        <br />
        <Field
          name='email'
          type='email'
          label={t('Account/Update/email/form/label')}
          error={error}
          onChange={(event, value, shouldValidate) => {
            event.preventDefault()
            this.updateValue(value, shouldValidate)
          }}
          value={value} />
        <br />
        <Button
          disabled={!!error}
          onClick={event => {
            event.preventDefault()
            this.submit()
          }}>
          {t('Account/Update/email/submit')}
        </Button>
        <CancelLink
          onClick={e => {
            e.preventDefault()
            this.cancelEditing()
          }}
          >
          {t('Account/Update/cancel')}
        </CancelLink>
      </Fragment>
    )
  }

  render () {
    const {
      t,
      me
    } = this.props
    const {
      updating, isEditing
    } = this.state

    const body = (
      updating
      ? (
        <InlineLoader>
          {t('Account/Update/email/updating')}
        </InlineLoader>
      )
      : isEditing
      ? this.renderForm()
      : this.renderEditButton()
    )

    return (
      <div style={{marginBottom: 80}}>
        <H2 style={{marginBottom: 8}}>{t('Account/Update/email/label')}</H2>
        <P>
          {getValue(me)}
        </P>
        <br />
        {body}
      </div>
    )
  }
}

const mutation = gql`
  mutation updateEmail(
    $userId: ID!
    $email: String!
  ) {
    updateEmail(
      userId: $userId
      email: $email
    ) {
      id
    }
  }
`

export default compose(
  graphql(mutation, {
    props: ({mutate}) => ({
      updateEmail: variables => {
        return mutate({
          variables,
          refetchQueries: [{
            query
          }]
        })
      }
    })
  }),
  withT
)(UpdateEmail)
