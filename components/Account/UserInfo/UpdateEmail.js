import React, { useState } from 'react'
import compose from 'lodash/flowRight'
import { css } from 'glamor'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import isEmail from 'validator/lib/isEmail'
import {
  Loader,
  InlineSpinner,
  Button,
  Field,
  Interaction,
  Label,
  useColorContext
} from '@project-r/styleguide'

import { errorToString } from '../../../lib/utils/errors'
import withT from '../../../lib/withT'
import withMe from '../../../lib/apollo/withMe'
import { query } from '../enhancers'

const { P, Emphasis } = Interaction

const styles = {
  spinner: css({
    display: 'flex',
    alignItems: 'center'
  }),
  alertContainer: css({
    padding: 8,
    margin: '16px 0'
  })
}

const InlineLoader = ({ children }) => (
  <div {...styles.spinner}>
    <InlineSpinner size={24} />
    {children}
  </div>
)

const AlertField = ({ children }) => {
  const [colorScheme] = useColorContext()
  return (
    <div
      {...styles.alertContainer}
      {...colorScheme.set('backgroundColor', 'hover')}
    >
      <P {...colorScheme.set('color', 'error')}> {children}</P>
    </div>
  )
}

const UserEmail = ({ t, me, loading, error, updateEmail }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [value, setValue] = useState('')
  const [errorValue, setErrorValue] = useState(false)

  const updateValue = value => {
    setValue(value)
    setErrorValue(
      (value.trim().length <= 0 && t('Account/Update/email/empty')) ||
        (!isEmail(value) && t('Account/Update/email/error/invalid'))
    )
  }

  const submit = () => {
    if (!window.confirm(t('Account/Update/email/confirm', { email: value }))) {
      return
    }
    setIsUpdating(true)
    updateEmail({
      email: value,
      userId: me.id
    })
      .then(() => {
        setIsUpdating(false)
        setIsEditing(false)
      })
      .catch(error => {
        setIsUpdating(false)
        setErrorValue(errorToString(error))
      })
  }

  return (
    <>
      <Emphasis>
        <Label>{t('Account/Update/email/label')}</Label>
      </Emphasis>
      <Loader
        loading={loading || !me}
        error={error}
        render={() => (
          <>
            <P>{me.email || ''}</P>
            {isUpdating ? (
              <InlineLoader>{t('Account/Update/email/updating')}</InlineLoader>
            ) : isEditing ? (
              <>
                <AlertField>{t('Account/Update/email/hint')}</AlertField>
                <Field
                  name='email'
                  type='email'
                  label={t('Account/Update/email/form/label')}
                  error={errorValue}
                  onChange={(e, value, shouldValidate) => {
                    e.preventDefault()
                    updateValue(value, shouldValidate)
                  }}
                  value={value}
                />
                <Button disabled={!!errorValue} onClick={() => submit()}>
                  {t('Account/Update/email/submit')}
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                  {t('Account/Update/cancel')}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                {t('Account/Update/email/edit')}
              </Button>
            )}
          </>
        )}
      />
    </>
  )
}

const mutation = gql`
  mutation updateEmail($userId: ID!, $email: String!) {
    updateEmail(userId: $userId, email: $email) {
      id
    }
  }
`

export default compose(
  graphql(mutation, {
    props: ({ mutate }) => ({
      updateEmail: variables => {
        return mutate({
          variables,
          refetchQueries: [
            {
              query
            }
          ]
        })
      }
    })
  }),
  withT,
  withMe
)(UserEmail)
