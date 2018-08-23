import React from 'react'
import PropTypes from 'prop-types'

import {
  Container,
  NarrowContainer,
  Interaction,
  Checkbox,
  mediaQueries,
  Field,
  Label,
  A
} from '@project-r/styleguide'
import Frame from '../Frame';
import withT from '../../lib/withT';
import Button from '@project-r/styleguide/lib/components/Button';
import ElectionBallot from './ElectionBallot';
import withMe from '../../lib/apollo/withMe';
import FieldSet from '@project-r/styleguide/lib/components/Form/FieldSet';
import Statement from '../Profile/Statement';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo'
import { swissTime } from '../../lib/utils/format';
import { css } from 'glamor';

const { H1, H2, H3, P } = Interaction

const birthdayFormat = '%d.%m.%Y'
const birthdayParse = swissTime.parse(birthdayFormat)

const fields = (t) => ([
  {
    label: 'Geburtsdatum',
    name: 'birthday',
    mask: '11.11.1111',
    maskChar: '_',
    validator: (value) => {
      const parsedDate = birthdayParse(value)
      return (
        (
          (
            value.trim().length &&
            (
              parsedDate === null ||
              parsedDate > (new Date()) ||
              parsedDate < (new Date(1798, 3, 12))
            ) &&
            t('Account/Update/birthday/error/invalid')
          )
        )
      )
    }
  },
  {
    label: 'Postleitzahl',
    name: 'postCode',
    mask: '1111',
    maskChar: '_',
  },
])

const styles = {
  previewWrapper: css({
    margin: '20px 0',
  }),
}

class ElectionCandidacy extends React.Component {

  state = {
    isCandidate: false,
    isEditing: false,
    showErrors: false,
    values: {},
    errors: {},
    dirty: {}
  }

  isMe = () => {
    const { me, data: { user } } = this.props
    return me && me.id === user.id
  }
  
  startCandidacy = () => {
    this.setState({
      isCandidate: true,
    }, this.startEditing)
  }

  startEditing = () => {
    const { isEditing } = this.state
    if (!isEditing && this.isMe()) {
      const { data: { user } } = this.props
      const { statement, birthday, address: { postalCode } } = user
      this.setState({
        isEditing: true,
        values: {
          statement,
          birthday,
          postalCode
        }
      })
    }
  }

  stopEditing = () => {
    this.setState({isEditing: false})
  }

  onChange = fields => {
    this.startEditing()
    this.setState(FieldSet.utils.mergeFields(fields))
  }
  
  render() {

    const meta = {
      title: 'Für den Genossenschaftsrat der Republik kandidieren',
      description: 'Bestimme über die Zukunft der Republik!'
    }

    const { isCandidate, isEditing, values, dirty, errors } = this.state
    const { url, me, t } = this.props
    const { data: { user } } = this.props

    const LOREM = 
      <P>
        Ihr naht euch wieder, schwankende Gestalten! Die früh sich einst dem trüben
        Blick gezeigt. Versuch’ ich wohl euch diesmal fest zu halten? Fühl’ ich
        mein Herz noch jenem Wahn geneigt? Ihr drängt euch zu! nun gut, so mögt ihr
        walten.
      </P>

    return (
      <Frame url={url} meta={meta}>
        <NarrowContainer>
          <Interaction.Headline>
            Kandidieren Sie jetzt
          </Interaction.Headline>
          {LOREM}
          <P>
            { !isCandidate &&
              <Button block big onClick={this.startCandidacy}>
                Ja, ich will für den Genossenschaftsrat kandidieren!
              </Button>  
            }
          </P>
          { isCandidate &&
            <div>
              <div {...styles.previewWrapper}>
                <H2>Vorschau</H2>
                <P>So erscheint Ihre Kandidatur auf dem Wahlformular</P>
                <ElectionBallot candidates={[user]} expandAll />
              </div>
              <H2>Details</H2>
              <Statement
                user={user}
                isEditing={isEditing}
                onChange={this.onChange}
                values={values}
                errors={errors}
                dirty={dirty} 
              />
              <FieldSet
                values={values}
                isEditing={isEditing}
                errors={errors}
                dirty={dirty}
                fields={fields(t)}
                onChange={this.onChange}
              />
              <Field label='Funktion' />
              <Field label='Interessenbindung (optional)' />
              { isEditing 
                ? (
                  <Button onClick={this.stopEditing}>
                    Änderungen speichern
                  </Button>    
                )
                : (
                  <Button onClick={this.startEditing}>
                    Kandidatur bearbeiten
                  </Button>    
                )
              }
            </div>
          }
        </NarrowContainer>
      </Frame>
    )
  }
}

const getUser = gql`
  query getUser($slug: String!) {
    user(slug: $slug) {
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
      birthday
      address {
        postalCode
      }
      credentials {
        isListed
        description
        verified
      }
      publicUrl
    }
  }
`

export default compose(
  withT,
  withMe,
  graphql(getUser, {
    options: ({me}) => ({
      variables: {
        slug: me.id
      }
    }),
  })
)(ElectionCandidacy)