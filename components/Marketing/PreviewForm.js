import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import withMe from '../../lib/apollo/withMe'
import { withSignIn } from '../Auth/SignIn'
import withT from '../../lib/withT'
import ErrorMessage from '../ErrorMessage'
import FieldSet from '../FieldSet'
import Loader from '../Loader'
import Poller from '../Auth/Poller'
import { validate as isEmail } from 'email-validator'
import { Button, Field, Interaction, RawHtml } from '@project-r/styleguide'

class PreviewForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      success: undefined,
      values: {},
      errors: {},
      dirty: {},
      serverError: undefined
    }
  }

  handleEmail (value, shouldValidate) {
    const {t} = this.props
    this.setState(
      FieldSet.utils.mergeField({
        field: 'email',
        value,
        error:
          (value.trim().length <= 0 &&
            t('marketing/preview/email/error/empty')) ||
          (!isEmail(value) && t('marketing/preview/email/error/invalid')),
        dirty: shouldValidate
      })
    )
  }

  requestPreview () {
    const { me } = this.props
    const { values } = this.state

    this.setState(() => ({
      loading: true
    }))

    const catchError = error => {
      this.setState(() => ({
        loading: false,
        serverError: error
      }))
    }

    if (!me) {
      this.props
        .signIn(values.email)
        .then(({ data }) => {
          this.setState(() => ({
            polling: true,
            phrase: data.signIn.phrase
          }))
        })
        .catch(catchError)
      return
    }

    this.props
      .requestPreview(me.email)
      .then(({data}) => {
        this.setState(() => ({
          loading: false,
          success: data.requestPreview.success
        }))
      })
      .catch(catchError)
  }

  render () {
    const { t, me } = this.props
    const {
      loading,
      values,
      dirty,
      errors,
      serverError,
      polling,
      success,
      phrase
    } = this.state

    if (polling) {
      return (
        <div>
          <RawHtml
            type={Interaction.P}
            dangerouslySetInnerHTML={{
              __html: t('signIn/polling', {
                phrase,
                email: values.email
              })
            }}
          />
          <Poller
            onSuccess={() => {
              this.setState(() => ({
                polling: false,
                success: true
              }))
              this.requestPreview()
            }}
          />
        </div>
      )
    }

    if (loading) {
      return <Loader loading />
    }

    if (success) {
      return <Interaction.P>{t('marketing/preview/success')}</Interaction.P>
    }

    if (me) {
      return (
        <Fragment>
          <Interaction.P>{t('marketing/preview/text')}</Interaction.P>
          <div style={{ marginTop: 20 }}>
            <Button
              onClick={() => {
                this.requestPreview()
              }}
            >
              {t('marketing/preview/button/label')}
            </Button>
          </div>
          {!!serverError && <ErrorMessage error={serverError} />}
        </Fragment>
      )
    }

    return (
      <Fragment>
        <Interaction.P>{t('marketing/preview/text')}</Interaction.P>
        <Field
          name='email'
          type='email'
          label={t('marketing/preview/email/label')}
          error={dirty && errors.email}
          onChange={(_, value, shouldValidate) => {
            this.handleEmail(value, shouldValidate)
          }}
          value={values.email}
        />
        <Button
          onClick={() => {
            if (errors.email) {
              this.setState(() => ({
                dirty: true
              }))
              return
            }
            this.requestPreview()
          }}
        >
          {t('marketing/preview/button/label')}
        </Button>
        {!!serverError && <ErrorMessage error={serverError} />}
      </Fragment>
    )
  }
}

const requestPreview = gql`
  mutation requestPreview {
    requestPreview {
      success
    }
  }
`

export default compose(
  graphql(requestPreview, {
    props: ({ mutate }) => ({
      requestPreview: () =>
        mutate()
    })
  }),
  withSignIn,
  withMe,
  withT
)(PreviewForm)
