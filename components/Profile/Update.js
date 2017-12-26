import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { isWebUri } from 'valid-url'
import Loader from '../Loader'
import PointerList from './PointerList'
import { errorToString } from '../../lib/utils/errors'

import withT from '../../lib/withT'

import {
  Checkbox,
  FieldSet,
  InlineSpinner,
  RawHtml,
  Button,
  A,
  colors
} from '@project-r/styleguide'

import UsernameField, { toUsername } from './UsernameField'

const fields = t => [
  {
    label: t('Account/ProfileForm/facebookId/label'),
    name: 'facebookId'
  },
  {
    label: t('Account/ProfileForm/twitterHandle/label'),
    name: 'twitterHandle'
  },
  {
    label: t('Account/ProfileForm/publicUrl/label'),
    name: 'publicUrl',
    validator: (value) => (
      (
        !!value &&
        !isWebUri(value) &&
        t('Account/ProfileForm/publicUrl/error')
      )
    )
  }
]

const getValues = me => {
  return {
    username: toUsername(me.username || me.name),
    facebookId: me.facebookId || '',
    twitterHandle: me.twitterHandle || '',
    emailAccessRole: me.emailAccessRole,
    publicUrl: me.publicUrl || '',
    hasPublicProfile: me.hasPublicProfile
  }
}

class Update extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      showErrors: false,
      values: {},
      errors: {},
      dirty: {}
    }
  }
  startEditing () {
    const { me } = this.props
    this.setState(state => ({
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
      const { t } = this.props

      const errors = FieldSet.utils.getErrors(
        fields(t),
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
    const { t, me, loading, error, style } = this.props
    const { values, dirty, errors, updating, isEditing } = this.state

    const errorMessages = Object.keys(errors)
      .map(key => errors[key])
      .filter(Boolean)

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => (
          <div style={style}>
            {!isEditing ? (
              <div>
                <PointerList user={me} />
                <br />
                <A
                  href='#'
                  onClick={e => {
                    e.preventDefault()
                    this.startEditing()
                  }}
                >
                  {t('Account/Update/edit')}
                </A>
              </div>
            ) : (
              <div>
                <UsernameField
                  value={values.username}
                  onChange={(_, value) => {
                    this.setState(({values}) => ({
                      values: {...values, username: value}
                    }))
                  }}
                  />
                <Checkbox
                  checked={values.hasPublicProfile}
                  onChange={(_, checked) => {
                    this.setState(() => ({
                      values: { ...values, hasPublicProfile: checked }
                    }))
                  }}
                >
                  <RawHtml
                    dangerouslySetInnerHTML={{
                      __html: t('Account/ProfileForm/hasPublicProfile/label')
                    }}
                  />
                </Checkbox>
                <FieldSet
                  values={values}
                  errors={errors}
                  dirty={dirty}
                  onChange={fields => {
                    this.setState(FieldSet.utils.mergeFields(fields))
                  }}
                  fields={fields(t)}
                />

                <br />
                <br />
                <br />
                {updating ? (
                  <div style={{ textAlign: 'center' }}>
                    <InlineSpinner />
                    <br />
                    {t('Account/Update/updating')}
                  </div>
                ) : (
                  <div>
                    {!!this.state.showErrors &&
                    errorMessages.length > 0 && (
                      <div style={{ color: colors.error, marginBottom: 40 }}>
                        {t('Account/submit/error/title')}
                        <br />
                        <ul>
                          {errorMessages.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!!this.state.error && (
                      <div style={{ color: colors.error, marginBottom: 40 }}>
                        {this.state.error}
                      </div>
                    )}
                    <div style={{ opacity: errorMessages.length ? 0.5 : 1 }}>
                      <Button
                        onClick={() => {
                          if (errorMessages.length) {
                            this.setState(state =>
                              Object.keys(state.errors).reduce(
                                (nextState, key) => {
                                  nextState.dirty[key] = true
                                  return nextState
                                },
                                {
                                  showErrors: true,
                                  dirty: {}
                                }
                              )
                            )
                            return
                          }
                          this.setState(() => ({ updating: true }))
                          this.props
                            .update({
                              facebookId: values.facebookId,
                              twitterHandle: values.twitterHandle,
                              publicUrl: values.publicUrl,
                              emailAccessRole: values.emailAccessRole,
                              hasPublicProfile: values.hasPublicProfile
                            })
                            .then(() => {
                              this.setState(() => ({
                                updating: false,
                                isEditing: false
                              }))
                            })
                            .catch(error => {
                              this.setState(() => ({
                                updating: false,
                                error: errorToString(error)
                              }))
                            })
                        }}
                      >
                        {t('Account/Update/submit')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      />
    )
  }
}

const mutation = gql`
  mutation updateMe(
    $username: String
    $hasPublicProfile: Boolean
    $facebookId: String
    $twitterHandle: String
    $emailAccessRole: AccessRole
    $publicUrl: String
  ) {
    updateMe(
      username: $username
      hasPublicProfile: $hasPublicProfile
      facebookId: $facebookId
      twitterHandle: $twitterHandle
      emailAccessRole: $emailAccessRole
      publicUrl: $publicUrl
    ) {
      id
    }
  }
`
const query = gql`
  query myProfile {
    me {
      id
      username
      email
      facebookId
      twitterHandle
      publicUrl
      emailAccessRole
      hasPublicProfile
    }
  }
`

export default compose(
  graphql(mutation, {
    props: ({ mutate }) => ({
      update: variables =>
        mutate({
          variables,
          refetchQueries: [
            {
              query
            }
          ]
        })
    })
  }),
  graphql(query, {
    props: ({ data }) => ({
      loading: data.loading,
      error: data.error,
      me: data.loading ? undefined : data.me
    })
  }),
  withT
)(Update)
