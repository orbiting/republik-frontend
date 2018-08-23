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

const { H1, H2, H3, P } = Interaction

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
          <Interaction.Headline>Kandidieren Sie jetzt</Interaction.Headline>
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
              <P>Vorschau Ihrer Kandidatur</P>
              <ElectionBallot candidates={[user]} />
              <Statement
                user={user}
                isEditing={isEditing}
                onChange={this.onChange}
                values={values}
                errors={errors}
                dirty={dirty} 
              />
              <Field label='Geburtsdatum' value={values.birthday} />
              <Label style={{marginTop: -8, display: 'block'}}>
                {t  ('Account/Update/birthday/hint/plain')}
              </Label>
              <Field label='Funktion' />
              <Field label='Postleitzahl' value={values.postalCode} />
              <Field label='Interessenbindung' />
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