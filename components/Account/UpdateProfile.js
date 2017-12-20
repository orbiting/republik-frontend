import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { isWebUri } from 'valid-url'
import Loader from '../Loader'
import PointerList from '../Profile/PointerList'
import { Link } from '../../lib/routes'
import { errorToString } from '../../lib/utils/errors'

import withT from '../../lib/withT'

import {
  Checkbox,
  FieldSet,
  InlineSpinner,
  Interaction,
  RawHtml,
  Button,
  A,
  colors,
  linkRule
} from '@project-r/styleguide'

const { H2 } = Interaction

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
    facebookId: me.facebookId || '',
    twitterHandle: me.twitterHandle || '',
    isEmailPublic: !!me.isEmailPublic,
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
      values: {
        // country: COUNTRIES[0]
      },
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
                <H2 style={{ marginBottom: 30 }}>
                  {t(
                    me.hasPublicProfile
                      ? 'Account/UpdateProfile/title'
                      : 'Account/UpdateProfile/titlePrivate'
                  )}
                </H2>

                {!me.hasPublicProfile && (
                  <div>
                    <PointerList user={me} />
                    <br />
                  </div>
                )}
                <Link route='profile' params={{slug: me.id}}>
                  <a {...linkRule}>
                    {t('Account/Update/viewLive')}
                  </a>
                </Link>
                {' – '}
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
                <H2>{t('Account/UpdateProfile/title')}</H2>
                <br />
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
                      __html: t('Account/ProfileForm/isPrivate/label')
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
                <Checkbox
                  checked={this.state.values.isEmailPublic}
                  onChange={(_, checked) => {
                    this.setState(() => ({
                      values: { ...values, isEmailPublic: checked }
                    }))
                  }}
                >
                  <RawHtml
                    dangerouslySetInnerHTML={{
                      __html: t('Account/ProfileForm/isEmailPublic/label')
                    }}
                  />
                </Checkbox>
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
                              isEmailPublic: values.isEmailPublic,
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
    $hasPublicProfile: Boolean
    $facebookId: String!
    $twitterHandle: String!
    $isEmailPublic: Boolean
    $publicUrl: String
  ) {
    updateMe(
      hasPublicProfile: $hasPublicProfile
      facebookId: $facebookId
      twitterHandle: $twitterHandle
      isEmailPublic: $isEmailPublic
      publicUrl: $publicUrl
    ) {
      id
    }
  }
`
export const query = gql`
  query myPublicUser {
    me {
      id
      email
      facebookId
      twitterHandle
      publicUrl
      isEmailPublic
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
