import React, { Component, Fragment } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { css, merge } from 'glamor'

import { TESTIMONIAL_IMAGE_SIZE } from '../../constants'

import ErrorMessage from '../../ErrorMessage'
import Portrait from '../../Profile/Portrait'
import Statement from '../../Profile/Statement'
import { ListedCheckbox, PublicCheckbox } from '../../Profile/Settings'
import { mutation } from '../../Profile/Edit'
import UsernameField from '../../Profile/UsernameField'
import Section from '../Section'

import {
  Interaction,
  Button,
  FieldSet,
  InlineSpinner,
  mediaQueries
} from '@project-r/styleguide'

const { P } = Interaction

const PORTRAIT_SIZE_M = TESTIMONIAL_IMAGE_SIZE
const PORTRAIT_SIZE_S = TESTIMONIAL_IMAGE_SIZE * 0.75

const styles = {
  p: css({
    marginBottom: 20
  }),
  field: css({
    marginTop: 10,
    marginBottom: 10
  }),
  checkbox: css({
    marginTop: 40,
    marginBottom: 40
  }),
  portrait: css({
    width: PORTRAIT_SIZE_S,
    height: PORTRAIT_SIZE_S,
    [mediaQueries.mUp]: {
      width: PORTRAIT_SIZE_M,
      height: PORTRAIT_SIZE_M
    }
  }),
  actions: css({
    marginBottom: 20,
    display: 'flex',
    flexWrap: 'wrap',
    position: 'relative',
    '& > div': {
      flexGrow: 1,
      margin: '5px 15px 0 0',
      minWidth: '120px',
      [mediaQueries.mUp]: {
        flexGrow: 0,
        margin: '5px 15px 0 0',
        minWidth: '160px'
      }
    }
  }),
  save: css({
    width: 160,
    textAlign: 'center'
  })
}

export const fragments = {
  user: gql`
    fragment ProfileUser on User {
      id
      firstName
      lastName
      portrait
      statement
      username
      isAdminUnlisted
      isListed
      isEligibleForProfile
      hasPublicProfile
    }
  `
}

class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      values: {},
      errors: {},
      dirty: {}
    }

    this.onChange = fields => {
      this.setState(FieldSet.utils.mergeFields(fields))
    }

    this.onCompleted = () => {
      props.onContinue.apply(null, [props])
    }
  }

  render () {
    const { user, onContinue } = this.props
    const { values, errors, dirty } = this.state

    const mergedValues = Object.assign({}, user, { portrait: undefined }, values)

    return (
      <Section
        heading='Profil'
        showContinue={false}
        isTicked={user && user.hasPublicProfile}
        {...this.props}>
        <P {...styles.p}>Das Profil ist Ihre Visitenkarte bei der Republik.</P>
        <P {...styles.p}>Wir verlinken Ihr Profil zum Beispiel bei Ihren Dialogbeiträgen.</P>
        <div {...merge(styles.portrait)}>
          <Portrait
            user={user}
            isEditing
            isMe
            values={mergedValues}
            errors={errors}
            dirty={dirty}
            onChange={this.onChange} />
        </div>
        <div {...styles.field}>
          <Statement
            user={user}
            isEditing
            isMe
            onChange={this.onChange}
            values={mergedValues}
            errors={errors}
            dirty={dirty} />
        </div>
        <div {...styles.field}>
          <UsernameField
            user={user}
            isEditing
            isMe
            onChange={this.onChange}
            values={mergedValues}
            errors={errors}
            dirty={dirty} />
        </div>
        <div {...styles.checkbox}>
          <ListedCheckbox
            user={user}
            isEditing
            isMe
            onChange={this.onChange}
            values={mergedValues}
            errors={errors}
            dirty={dirty} />
        </div>
        <div {...styles.checkbox}>
          <PublicCheckbox
            user={user}
            isEditing
            isMe
            onChange={this.onChange}
            values={mergedValues}
            errors={errors}
            dirty={dirty} />
        </div>
        <Mutation
          mutation={mutation}
          variables={values}
          onCompleted={this.onCompleted}>
          {(mutate, { loading, error }) => (
            <Fragment>
              <div {...styles.actions}>
                <div {...styles.save}>
                  {loading
                    ? <InlineSpinner />
                    : <Button primary block disabled={loading} onClick={mutate}>speichern</Button>
                  }
                </div>
                <div>
                  <Button block disabled={loading} onClick={onContinue}>später</Button>
                </div>
              </div>
              {!!error && <ErrorMessage error={error} />}
            </Fragment>
          )}
        </Mutation>
      </Section>
    )
  }
}

export default Profile
