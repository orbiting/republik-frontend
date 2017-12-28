import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import { errorToString } from '../../lib/utils/errors'

import {
  InlineSpinner,
  Button,
  linkRule,
  colors
} from '@project-r/styleguide'

const styles = {
  editLink: css({
    display: 'block',
    marginTop: 5
  })
}

const EditLink = ({children, onClick, ...props}) =>
  <a
    href='#'
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
    {...props}
    {...linkRule}
    {...styles.editLink}>
    {children}
  </a>

const Edit = ({me, user, t, state, setState, startEditing, update}) => {
  const {
    isEditing
  } = state
  if (!me || me.id !== user.id) {
    return null
  }
  if (!isEditing) {
    return (
      <Fragment>
        {!user.hasPublicProfile && user.username && <Button block primary onClick={() => {
          update({
            hasPublicProfile: true
          })
        }}>
          {t('profile/edit/publish')}
        </Button>}
        <EditLink onClick={() => {
          startEditing()
        }}>
          {t('profile/edit/start')}
        </EditLink>
      </Fragment>
    )
  }
  if (state.updating) {
    return (
      <Fragment>
        <InlineSpinner />
        <br />
        {t('profile/edit/updating')}
      </Fragment>
    )
  }

  const errorMessages = Object.keys(state.errors)
    .map(key => state.errors[key])
    .filter(Boolean)

  return (
    <Fragment>
      {!!state.showErrors && errorMessages.length > 0 && (
        <div style={{ color: colors.error, marginBottom: 40 }}>
          {t('profile/edit/errors')}
          <br />
          <ul>
            {errorMessages.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {!!state.error && (
        <div style={{ color: colors.error, marginBottom: 40 }}>
          {state.error}
        </div>
      )}
      <div style={{ opacity: errorMessages.length ? 0.5 : 1 }}>
        <Button block primary={!user.hasPublicProfile} onClick={() => {
          if (errorMessages.length) {
            setState(state =>
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
          update({
            ...state.values,
            hasPublicProfile: true
          })
        }}>
          {user.hasPublicProfile
            ? t('profile/edit/save')
            : t('profile/edit/publish')}
        </Button>
      </div>
      {!user.hasPublicProfile && <EditLink onClick={() => {
        update(state.values)
      }}>
        {t('profile/edit/save')}
      </EditLink>}
      {user.hasPublicProfile && <EditLink onClick={() => {
        update({
          hasPublicProfile: false
        })
      }}>
        {t('profile/edit/unpublish')}
      </EditLink>}
      <EditLink onClick={() => {
        setState({
          isEditing: false,
          values: {}
        })
      }}>
        {t('profile/edit/cancel')}
      </EditLink>
    </Fragment>
  )
}

const mutation = gql`
  mutation updateMe(
    $username: String
    $hasPublicProfile: Boolean
    $facebookId: String
    $twitterHandle: String
    $emailAccessRole: AccessRole
    $publicUrl: String
    $biography: String
    $statement: String
    $portrait: String
    $phoneNumber: String
    $phoneNumberNote: String
    $phoneNumberAccessRole: AccessRole
  ) {
    updateMe(
      username: $username
      hasPublicProfile: $hasPublicProfile
      facebookId: $facebookId
      twitterHandle: $twitterHandle
      emailAccessRole: $emailAccessRole
      publicUrl: $publicUrl
      biography: $biography
      statement: $statement
      portrait: $portrait
      phoneNumber: $phoneNumber
      phoneNumberNote: $phoneNumberNote
      phoneNumberAccessRole: $phoneNumberAccessRole
    ) {
      id
      username
      hasPublicProfile
      facebookId
      twitterHandle
      emailAccessRole
      publicUrl
      biography
      statement
      portrait
      phoneNumber
      phoneNumberNote
      phoneNumberAccessRole
    }
  }
`

export default compose(
  graphql(mutation, {
    props: ({ mutate, ownProps: { setState } }) => ({
      update: variables => {
        setState({ updating: true })
        mutate({
          variables
        })
          .then(() => {
            setState(() => ({
              updating: false,
              isEditing: false,
              error: undefined,
              values: {}
            }))
          })
          .catch(error => {
            setState(() => ({
              updating: false,
              error: errorToString(error)
            }))
          })
      }
    })
  }),
  withMe,
  withT
)(Edit)
