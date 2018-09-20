import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { formatter as f } from './util'

import {
  NarrowContainer,
  Interaction,
  Label,
  A,
  fontStyles
} from '@project-r/styleguide'
import Frame from '../Frame'
import withT from '../../lib/withT'
import Button from '@project-r/styleguide/lib/components/Button'

import FieldSet from '@project-r/styleguide/lib/components/Form/FieldSet'
import Statement from '../Profile/Statement'
import Credentials from '../Profile/Credentials'
import UpdateMe from '../../components/Account/UpdateMe'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { swissTime } from '../../lib/utils/format'
import { css } from 'glamor'
import ElectionBallotRow from './ElectionBallotRow'
import Loader from '../Loader'
import { Section, Small, Title } from './text'
import Portrait from '../Profile/Portrait'

const {H2, P} = Interaction

const birthdayFormat = '%d.%m.%Y'
const birthdayParse = swissTime.parse(birthdayFormat)

const fields = (t) => ([
  // {
  //   label: 'Geburtsdatum',
  //   name: 'birthday',
  //   mask: '11.11.1111',
  //   maskChar: '_',
  //   validator: (value) => {
  //     const parsedDate = birthdayParse(value)
  //     return (
  //       (
  //         (
  //           value.trim().length &&
  //           (
  //             parsedDate === null ||
  //             parsedDate > (new Date()) ||
  //             parsedDate < (new Date(1798, 3, 12))
  //           ) &&
  //           t('Account/Update/birthday/error/invalid')
  //         )
  //       )
  //     )
  //   }
  // },
  {
    label: 'Interessenbindungen (optional)',
    name: 'disclosures',
    autoSize: true,
    validator: (value) => {
      return value && value.length > 1
    }
  }
])

const styles = {
  previewWrapper: css({
    margin: '20px 0'
  }),
  sectionSmall: css({
    marginTop: 20
  }),
  section: css({
    marginTop: 40
  })
}

const ELECTION_SLUG = 'genossenschaftsrat2018-members'

class ElectionCandidacy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      showErrors: false,
      errors: {},
      dirty: {},
      values: {}
    }

    this.startEditing = () => {
      const {isEditing} = this.state
      const {data: {me}} = this.props
      if (!isEditing) {
        const {statement, birthday, disclosures, credentials} = me
        this.setState({
          isEditing: true,
          values: {
            statement,
            birthday,
            disclosures,
            credential: (credentials.find(c => c.isListed) || {}).description
          }
        })
      }
    }

    this.stopEditing = () => {
      this.setState({isEditing: false})
    }

    this.cancelCandidacy = async () => {
      const {cancelCandidacy} = this.props
      await cancelCandidacy(ELECTION_SLUG)
    }

    this.save = async () => {
      this.stopEditing()
      const {updateMe, submitCandidacy} = this.props
      await updateMe({
        ...this.state.values
      })
        .then(() => submitCandidacy(ELECTION_SLUG))
    }

    this.onChange = fields => {
      this.setState(FieldSet.utils.mergeFields(fields))
    }
  }

  render () {
    const meta = {
      title: 'Für den Genossenschaftsrat der Republik kandidieren',
      description: 'Bestimme über die Zukunft der Republik!'
    }

    const {isEditing, values, dirty, errors} = this.state
    const {url, t} = this.props
    const {data: {me, election, loading, error}} = this.props

    const isCandidate = election && election.candidates.some(c => c.user.id === me.id)

    const candidacyPreview = me && {
      user: me,
      city: me.address ? me.address.city : '',
      yearOfBirth: me.birthday ? new Date(me.birthday).getFullYear() : ''
    }

    return (
      <Frame url={url} meta={meta}>
        <Loader loading={loading} error={error} render={() =>
          <NarrowContainer>
            <Title>
              {f('info/candidacy/title')}
            </Title>
            <P />
            <div>
              <div {...styles.previewWrapper}>
                <H2>Vorschau</H2>
                <div style={{margin: `15px 0`}}>
                  <P>{f('info/candidacy/label')}</P>
                </div>
                <ElectionBallotRow
                  maxVotes={0}
                  expanded
                  candidate={candidacyPreview}
                />
              </div>
              <Section>
                <Small indent={false} text={f('info/candidacy/finePrint')} />
              </Section>
              <UpdateMe style={{marginBottom: 30}} />
              <Section>
                <H2>Kandidatur</H2>
                <div {...styles.sectionSmall} style={{width: 90, height: 90, background: 'black'}}>
                  <Portrait
                    user={me}
                    isEditing={isEditing}
                    isMe={true}
                    onChange={this.onChange}
                    values={values}
                    errors={errors}
                    dirty={dirty} />
                </div>
                <div {...styles.sectionSmall}>
                  {!isEditing &&
                  <Fragment>
                    <Label style={{display: 'block'}}>
                      {t('profile/statement/label')}
                    </Label>
                  </Fragment>
                  }
                  <Statement
                    user={me}
                    isEditing={isEditing}
                    onChange={this.onChange}
                    values={values}
                    errors={errors}
                    dirty={dirty}
                  />
                </div>
                <div {...styles.sectionSmall}>
                  {isEditing ? (
                    <Credentials
                      user={me}
                      isEditing={isEditing}
                      onChange={this.onChange}
                      values={values}
                      errors={errors}
                      dirty={dirty}
                    />
                  ) : (
                    <Fragment>
                      <Label style={{display: 'block'}}>
                        {t('profile/credentials/label')}
                      </Label>
                      <P>{((me.credentials || []).find(c => c.isListed) || {}).description}</P>
                    </Fragment>
                    )
                  }
                </div>
                <div {...styles.sectionSmall}>
                  {isEditing ? (
                    <FieldSet
                      values={values}
                      isEditing={isEditing}
                      errors={errors}
                      dirty={dirty}
                      fields={fields(t)}
                      onChange={this.onChange}
                    />
                  ) : (
                    <Fragment>
                      <Label style={{display: 'block'}}>
                        {t('profile/disclosures/label')}
                      </Label>
                      <P>{me.disclosures}</P>
                    </Fragment>
                  )
                  }
                </div>
                <br />
                {isEditing ? (
                  <div>
                    <Button onClick={this.save}>
                      Änderungen speichern
                    </Button>
                    <div style={{marginTop: 10}}>
                      <A href='#' onClick={(e) => {
                        e.preventDefault()
                        this.stopEditing()
                      }}>
                        {t('profile/edit/cancel')}
                      </A>
                    </div>
                  </div>
                ) : (
                  <A href='#' onClick={(e) => {
                    e.preventDefault()
                    this.startEditing()
                  }}>{t('Account/Update/edit')}</A>
                )
                }
              </Section>
              { isCandidate ? (
                <div>
                  <P>
                    Ihre Kandidatur ist registriert. Vielen Dank für Ihr Engagement!
                  </P>
                </div>
              ) : (
                <Button block big onClick={this.save}>
                    Ja, ich will für den Genossenschaftsrat kandidieren!
                </Button>
              )
              }
            </div>
          </NarrowContainer>
        } />
      </Frame>
    )
  }
}

const submitCandidacy = gql`mutation submitCandidacy($slug: String!) {
  submitCandidacy(slug: $slug) {
    id
    user {
      id
    }
  }
}`

const cancelCandidacy = gql`mutation submitCandidacy($slug: String!) {
  cancelCandidacy(slug: $slug) {
    candidates {
      id
    }
  }
}`

const updateMe = gql`mutation updateMe($birthday: Date, $statement: String, $disclosures: String) {
  updateMe(birthday: $birthday, statement: $statement, disclosures: $disclosures) {
    id
  }
}`

const publishCredential = gql`
  mutation publishCredential($description: String) {
    publishCredential(description: $description) {
      isListed
      description
    }
  }

`

const query = gql`
  query {
    election(slug: "${ELECTION_SLUG}") {
      candidates {
        user {
          id
        }
        recommendation
      }
    }
    me {
      id
      username
      firstName
      lastName
      updatedAt
      name
      email
      emailAccessRole
      phoneNumber
      phoneNumberNote
      phoneNumberAccessRole
      portrait
      hasPublicProfile
      isEligibleForProfile
      statement
      biography
      disclosures
      birthday
      address {
        line1
        line2
        postalCode
        city
        country
      }
      credentials {
        isListed
        description
      }
      publicUrl
    }
  }
`

export default compose(
  withT,
  graphql(query),
  graphql(publishCredential, {
    props: ({mutate}) => ({
      publishCredential: description => {
        return mutate({
          variables: {
            description
          }
        })
      }
    })
  }),
  graphql(updateMe, {
    props: ({mutate, ownProps: {publishCredential, data: {me}}}) => ({
      updateMe: async variables => {
        // setState({ updating: true })
        const credential = (me.credentials || []).find(c => c.isListed) || {}
        if (variables.credential !== credential.description) {
          await publishCredential(variables.credential || null)
        }

        mutate({
          variables,
          refetchQueries: [{
            query
          }]
        })
      }
    })
  }),
  graphql(submitCandidacy, {
    props: ({mutate}) => ({
      submitCandidacy: slug => {
        return mutate({
          variables: {
            slug
          },
          refetchQueries: [{
            query
          }]
        })
      }
    })
  }),
  graphql(cancelCandidacy, {
    props: ({mutate}) => ({
      cancelCandidacy: slug => {
        return mutate({
          variables: {
            slug
          },
          refetchQueries: [{
            query
          }]
        })
      }
    })
  })
)(ElectionCandidacy)
