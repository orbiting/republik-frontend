import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { formatter as f } from './util'
import { errorToString } from '../../lib/utils/errors'


import {
  NarrowContainer,
  Interaction,
  Label,
  A,
  fontStyles,
  colors,
  Spinner,
  InlineSpinner,
} from '@project-r/styleguide'
import Frame from '../Frame'
import withT from '../../lib/withT'
import Button from '@project-r/styleguide/lib/components/Button'

import FieldSet from '@project-r/styleguide/lib/components/Form/FieldSet'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { swissTime } from '../../lib/utils/format'
import { css } from 'glamor'
import ElectionBallotRow from './ElectionBallotRow'
import Loader from '../Loader'
import { Section, Small, Title } from './text'
import Portrait from '../Profile/Portrait'
import { COUNTRIES } from '../Account/AddressForm'

const {H2, P} = Interaction

const birthdayFormat = '%d.%m.%Y'
const birthdayParse = swissTime.parse(birthdayFormat)

export const ELECTION_SLUG = 'genossenschaftsrat2018-members'
const DEFAULT_COUNTRY = COUNTRIES[0]

export const addressFields = (t) => [
  {
    label: t('Account/AddressForm/line1/label'),
    name: 'line1',
    validator: (value) => (
      (
        !value &&
        t('Account/AddressForm/line1/error/empty')
      )
    )
  },
  {
    label: t('Account/AddressForm/line2/label'),
    name: 'line2'
  },
  {
    label: t('Account/AddressForm/postalCode/label'),
    name: 'postalCode',
    validator: (value) => (
      (
        !value &&
        t('Account/AddressForm/postalCode/error/empty')
      )
    )
  },
  {
    label: t('Account/AddressForm/city/label'),
    name: 'city',
    validator: (value) => (
      (
        !value &&
        t('Account/AddressForm/city/error/empty')
      )
    )
  },
  {
    label: t('Account/AddressForm/country/label'),
    name: 'country',
    validator: (value) => (
      (
        !value &&
        t('Account/AddressForm/country/error/empty')
      )
    )
  }
]

const fields = (t) => ([
  {
    label: 'Statement (Ihre Motivation)',
    name: 'statement',
    autoSize: true,
    validator: value =>
      (!value && 'Statement fehlt')
      || (value.trim().length >= 140 && t('profile/statement/tooLong'))
  },
  {
    label: 'Geburtsdatum',
    name: 'birthday',
    mask: '11.11.1111',
    maskChar: '_',
    validator: (value) => {
      const parsedDate = birthdayParse(value)
      return (
        (
          parsedDate === null ||
          parsedDate > (new Date()) ||
          parsedDate < (new Date(1798, 3, 12))
        ) &&
        t('Account/Update/birthday/error/invalid')
      )
    }
  },
  {
    label: 'Funktion (Tätigkeit, Beruf, Amt)',
    name: 'credential',
    validator: (value) => {
      return (
        ((!value || value === '') & 'Funktion fehlt')
        || (value.trim().length >= 40 && t('profile/credentials/errors/tooLong'))
      )
    }
  },
  {
    label: 'Interessenbindungen (optional)',
    name: 'disclosures',
    autoSize: true,
  },
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
  }),
  error: css({
    color: colors.error
  }),
}

const SpinnerOverlay = ({children, show}) =>
  <div style={{position: 'relative'}}>
    {children}
    { show &&
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#fff',
        opacity: 0.5
      }}>
        <Spinner />
      </div>
    }
  </div>

class ElectionCandidacy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: props.url.query.hasOwnProperty('edit') || false,
      showErrors: true,
      errors: {},
      dirty: {},
      ...this.deriveStateFromProps(props)
    }

    this.startEditing = () => {
      this.setState({isEditing: true})
    }

    this.stopEditing = () => {
      this.setState({isEditing: false})
    }

    this.save = () => {

      const {updateCandidacy} = this.props
      const { values } = this.state

      updateCandidacy({
        slug: ELECTION_SLUG,
        statement: values.statement,
        credential: values.credential,
        disclosures: values.disclosures,
        birthday: values.birthday && values.birthday.length
          ? values.birthday.trim()
          : null,
        address: {
            name: values.name,
            line1: values.line1,
            line2: values.line2,
            postalCode: values.postalCode,
            city: values.city,
            country: values.country
          }
      }).then(() => {
        this.setState(() => ({
          isEditing: false
        }), () => window.scrollTo(0, 0))
      }).catch((error) => {
        this.setState(() => ({
          error: errorToString(error)
        }))
      })

    }

    this.onChange = fields => {
      this.setState(FieldSet.utils.mergeFields(fields))
    }

  }

  deriveStateFromProps ({data}) {
    const {name, statement, birthday, disclosures, credentials, address} = data.me || {}
    const {line1, line2, city, postalCode, country = DEFAULT_COUNTRY} = address || {}
    return {
      values: {
        name,
        statement,
        birthday,
        disclosures,
        credentials,
        line1,
        line2,
        city,
        postalCode,
        country,
        credential: (credentials&& credentials.find(c => c.isListed) || {}).description
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.me !== this.props.me) {
      this.setState(this.deriveStateFromProps(nextProps))
    }
  }

  render () {
    const meta = {
      title: 'Für den Genossenschaftsrat der Republik kandidieren',
      description: 'Bestimme über die Zukunft der Republik!'
    }

    const {values, errors, error, dirty, isEditing} = this.state
    const {url, t} = this.props
    const {data: {me, election, loading}} = this.props

    const showProgress = loading

    const candidate = election && election.candidates.find(c => c.user.id === me.id)

    const candidacyPreview = me && {
      user: me,
      city: me.address ? me.address.city : '',
      yearOfBirth: me.birthday ? new Date(me.birthday).getFullYear() : '',
      recommendation: candidate ? candidate.recommendation : undefined,
    }

    const isValid = !Object.values(errors).some(Boolean)

    return (
      <Frame url={url} meta={meta}>
        <Loader loading={loading} error={error} render={() =>
          <NarrowContainer>
            <Title>
              {candidate
                ? f('info/candidacy/title2')
                : f('info/candidacy/title')
              }
            </Title>
            <P/>
            <div>
              <div {...styles.previewWrapper}>
                <H2>Vorschau</H2>
                <div style={{margin: `15px 0`}}>
                  <P>{f('info/candidacy/label')}</P>
                </div>
                <SpinnerOverlay show={showProgress}>
                  <ElectionBallotRow
                    maxVotes={0}
                    expanded
                    candidate={candidacyPreview}
                  />
                </SpinnerOverlay>
              </div>
              {
                (!!candidate && !isEditing) ? (
                  <Fragment>
                    <div {...styles.sectionSmall}>
                      <P>
                        Ihre Kandidatur ist registriert. Vielen Dank für Ihr Engagement!
                      </P>
                    </div>
                    <div {...styles.sectionSmall}>
                      <A href='#' onClick={(e) => {
                        e.preventDefault()
                        this.startEditing()
                      }}>
                        Kandidatur bearbeiten
                      </A>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Section>
                      <H2>Adresse</H2>
                      <div {...styles.sectionSmall}>
                        <FieldSet
                          values={values}
                          errors={errors}
                          dirty={dirty}
                          fields={addressFields(t)}
                          onChange={this.onChange}
                          isEditing={true}
                        />
                      </div>
                    </Section>
                    <Section>
                      <H2>Kandidatur</H2>
                      <div {...styles.sectionSmall} style={{width: 104, height: 104, background: 'black'}}>
                        <Portrait
                          user={me}
                          isEditing={true}
                          isMe={true}
                          onChange={this.onChange}
                          values={values}
                          errors={errors}
                          dirty={dirty}/>
                      </div>
                      <div {...styles.sectionSmall}>
                        <FieldSet
                          values={values}
                          isEditing={isEditing}
                          errors={errors}
                          dirty={dirty}
                          fields={fields(t)}
                          onChange={this.onChange}
                        />
                      </div>
                    </Section>
                    {this.state.error &&
                    <div {...styles.sectionSmall} {...styles.error}>
                      {this.state.error}
                    </div>
                    }
                    {!isValid &&
                    <div {...styles.sectionSmall}>
                      <div {...styles.error}>
                        Bitte füllen Sie alle obligatorischen Felder aus:
                        <ul>
                          {Object.entries(errors).map(([k, v]) => !!v && <li>{v}</li>)}
                        </ul>
                      </div>
                    </div>
                    }
                    <div {...styles.sectionSmall}>
                      {!candidate &&
                      <Button primary block big onClick={this.save} disabled={!isValid}>
                        Kandidatur abschicken
                      </Button>
                      }
                      {isEditing && !showProgress &&
                      <Button onClick={this.save} disabled={!isValid}>
                        Änderungen speichern
                      </Button>
                      }
                      <Section>
                        <Small indent={false} text={f('info/candidacy/finePrint')}/>
                      </Section>
                    </div>
                  </Fragment>
                )
              }
            </div>
          </NarrowContainer>
        } />
      </Frame>
    )
  }
}

const cancelCandidacy = gql`mutation submitCandidacy($slug: String!) {
  cancelCandidacy(slug: $slug) {
    candidates {
      id
    }
  }
}`

const updateCandidacy = gql`mutation updateCandidacy($slug:String!, $birthday: Date, $statement: String, $disclosures: String, $address: AddressInput) {
  submitCandidacy(slug: $slug) {
    id
    user {
      id
    }
  }
  updateMe(birthday: $birthday, statement: $statement, disclosures: $disclosures, address: $address) {
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
  query init {
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
  graphql(query, {
    options: {
      notifyOnNetworkStatusChange: true,
    },
  }),
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
  graphql(updateCandidacy, {
    props: ({mutate, ownProps: {publishCredential, data: {me}}}) => ({
      updateCandidacy: async (variables) => {
        // setState({ updating: true })
        const credential = (me.credentials || []).find(c => c.isListed) || {}
        if (variables.credential !== credential.description) {
          await publishCredential(variables.credential || null)
        }

        mutate({
          variables,
          refetchQueries: ['init']
        })
      }
    })
  }),
  graphql(cancelCandidacy, {
    options: {
      notifyOnNetworkStatusChange: true,
    },
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
