import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import ErrorMessage from '../ErrorMessage'
import Loader from '../Loader'
import withT from '../../lib/withT'
import { InlineSpinner, Radio } from '@project-r/styleguide'

const DEFAULT_TOKEN_TYPE = 'EMAIL_TOKEN'
const SUPPORTED_TOKEN_TYPES = [DEFAULT_TOKEN_TYPE, 'APP']

const styles = {
  headline: css({
    margin: '80px 0 30px 0'
  }),
  spinnerWrapper: css({
    display: 'inline-block',
    height: 0,
    marginLeft: 15,
    verticalAlign: 'middle',
    '& > span': {
      display: 'inline'
    }
  }),
  fieldset: css({
    border: 0,
    padding: 0,
    margin: '20px 0 0 0'
  })
}

class AuthSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mutating: false,
      serverError: null
    }

    this.catchServerError = error => {
      this.setState(() => ({
        mutating: false,
        serverError: error
      }))
    }
  }

  render () {
    const { t, me, loading, error, updatePreferredFirstFactor } = this.props

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          const { enabledFirstFactors, preferredFirstFactor } = me
          const selectedFirstFactor = preferredFirstFactor || DEFAULT_TOKEN_TYPE
          const { mutating, serverError } = this.state

          return (
            <Fragment>
              <fieldset {...styles.fieldset}>
                <legend>
                  {t('account/authSettings/firstfactor/label')}{' '}
                  {mutating && (
                    <span {...styles.spinnerWrapper}>
                      <InlineSpinner size={24} />
                    </span>
                  )}
                </legend>
                {SUPPORTED_TOKEN_TYPES.map((tokenType) => (
                  <p key={tokenType}>
                    <Radio
                      checked={tokenType === selectedFirstFactor}
                      disabled={enabledFirstFactors.indexOf(tokenType) === -1 || mutating}
                      onChange={(_, checked) => {
                        this.setState(state => ({
                          mutating: true
                        }))
                        const finish = () => {
                          this.setState(state => ({
                            mutating: false
                          }))
                        }
                        updatePreferredFirstFactor({
                          tokenType
                        })
                          .then(finish)
                          .catch(this.catchServerError)
                      }}
                    >
                      {t(`account/authSettings/firstfactor/${tokenType}/label`)}
                    </Radio>
                  </p>
                ))}
              </fieldset>
              {serverError && <ErrorMessage error={serverError} />}
            </Fragment>
          )
        }}
      />
    )
  }
}

const mutation = gql`
  mutation preferredFirstFactor(
    $tokenType: SignInTokenType
  ) {
    preferredFirstFactor(tokenType: $tokenType) {
      id
      enabledFirstFactors
      preferredFirstFactor
    }
  }
`

const query = gql`
  query myAuthSettings {
    me {
      id
      enabledFirstFactors
      preferredFirstFactor
    }
  }
`

export default compose(
  graphql(mutation, {
    props: ({ mutate }) => ({
      updatePreferredFirstFactor: ({ tokenType }) =>
        mutate({
          variables: {
            tokenType
          }
        })
    })
  }),
  graphql(query, {
    props: ({ data, errors }) => ({
      data,
      loading: data.loading || !data.me,
      error: data.error,
      me: data.loading ? undefined : data.me
    })
  }),
  withT
)(AuthSettings)
