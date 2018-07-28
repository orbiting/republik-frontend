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
import isEmail from 'validator/lib/isEmail'

import { DEFAULT_TOKEN_TYPE } from '../constants'

import {
  Button,
  Field,
  Interaction,
  RawHtml,
  linkRule,
  InlineSpinner
} from '@project-r/styleguide'

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

  requestPreview (newTokenType) {
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
        .signIn({
          email: values.email,
          context: 'preview',
          tokenType: newTokenType
        })
        .then(({ data }) => {
          console.log(data)
          this.setState(() => ({
            polling: true,
            loading: false,
            phrase: data.signIn.phrase,
            tokenType: data.signIn.tokenType,
            alternativeFirstFactors: data.signIn.alternativeFirstFactors
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
      phrase, tokenType, alternativeFirstFactors
    } = this.state

    if (polling) {
      const suffix = tokenType !== DEFAULT_TOKEN_TYPE ? `/${tokenType}` : ''
      const alternativeFirstFactor = alternativeFirstFactors[0]
      return (
        <div>
          <RawHtml
            type={Interaction.P}
            dangerouslySetInnerHTML={{
              __html: t(`signIn/polling/short${suffix}`, {
                phrase,
                email: values.email
              })
            }}
          />
          {alternativeFirstFactor && (
            <div>
              <br />
              <a {...linkRule}
                key='switch'
                style={{cursor: 'pointer'}}
                onClick={(e) => {
                  e.preventDefault()
                  this.requestPreview(alternativeFirstFactor)
                }}
              >{t('signIn/polling/switch', {tokenType: t(`signIn/polling/${alternativeFirstFactor}/label`)})}</a>
              {loading && (<InlineSpinner size={26}/>)}
            </div>
          )}
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
