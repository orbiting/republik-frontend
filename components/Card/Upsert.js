import React, { useState } from 'react'
import { withRouter } from 'next/router'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import AutosizeInput from 'react-textarea-autosize'

import { Loader, Interaction, Button, Field, mediaQueries, colors } from '@project-r/styleguide'

import ErrorMessage from '../ErrorMessage'
import Portrait from '../Profile/Portrait'
import { styles as fieldSetStyles } from '../FieldSet'

const { H1, H2, H3, P } = Interaction

const styles = {
  portrait: css({
    minWidth: 300,
    width: 600 / 2,
    height: 800 / 2,
    [mediaQueries.mUp]: {
      minWidth: 300,
      width: 600 / 2,
      height: 800 / 2
    }
  }),
  errorMessages: css({
    color: colors.error,
    marginTop: 40
  })
}

const Upsert = ({ router, data }) => {
  const { loading, error } = data

  const [portrait] = useState({ values: {} })
  const [statement] = useState({ value: '' })
  // const [showErrors] = useState(false)
  const [serverError] = useState(false)

  if (loading || error) {
    return <Loader loading={loading} error={error} />
  }

  const { me } = data
  if (!me || me.cards.nodes.length === 0) {
    return (
      <>
        <H2>Diese Seite ist Kandidatinnen und Kandidaten der Parlamentswahlen vorbehalten.</H2>
        <P>
          Ihrem Konto ist keine Wahltindär-Karte hinterlegt. Falls Sie sich für eine Kandidatur in
          den Nationalrat oder Ständerat angemeldet haben, können Ihre Wahltindär-Karte über
          den speziellen Link in der Begrüssungs-E-Mail übernehmen.
        </P>
        <P>
          Bei Schwierigkeiten, wenden Sie sich an kontakt@republik.ch
        </P>
      </>
    )
  }

  const { name, cards } = me
  const [ card ] = cards.nodes
  const { party, councilOfStates, nationalCouncil, occupation, yearOfBirth } = card.payload
  const { listName, listPlaces, listNumbers } = nationalCouncil

  const handlePortrait = () => {}

  return (
    <>
      {router.query.thank ? (
        <>
          <H1>Ihre Wahltindär-Karte ist parat 🔥</H1>
          <P>
            Wir freuen uns, Sie an Bord unseres Wahltindär-Projektes begrüssen zu dürfen und sind
            in besonderem Masse begeistert, dass Sie sich die Zeit dafür genommen haben. Auf dieser Seite
            können Sie Angaben ändern oder weitere Informationen hinzufügen.
          </P>
        </>
      ) : (
        <>
          <H1>Wahltindär (Upsert-Seite)</H1>
          <P>
            Ein toller, einleitender Satz. Mit ein bisschen Erklär-Dingens, dass auf dieser
            Seite eine Wahltindär-Karte angepasst und übernommen werden kann.
          </P>
        </>
      )}

      <H2>Ihre Wahltindär-Karte</H2>

      <div style={{ display: 'flex', marginBottom: 40, marginTop: 40 }}>
        <div {...styles.portrait}>
          <Portrait
            user={me}
            isEditing
            isMe
            values={portrait.values}
            errors={portrait.errors}
            onChange={handlePortrait} />
        </div>
        <div style={{ marginLeft: 40 }}>
          <H3>{name}, {party}</H3>
          <P>{occupation}, geboren {yearOfBirth}</P>
          {nationalCouncil.candidacy && (
            <>
              <H3>Nationalratskandidatur</H3>
              <P>Liste: «{listName}»</P>
              <P>Listenplätze: {
                listNumbers.length > 0
                  ? listNumbers.join(', ')
                  : listPlaces.join(', ')
              }</P>
            </>
          )}
          {councilOfStates.candidacy && (
            <>
              <H3>Ständeratskandidatur</H3>
            </>
          )}
        </div>
      </div>

      <Field
        label={'Ihr Statement'}
        renderInput={({ ref, ...inputProps }) => (
          <AutosizeInput
            {...inputProps}
            {...fieldSetStyles.autoSize}
            inputRef={ref} />
        )}
        value={statement.value}
        error={statement.dirty && statement.error}
        dirty={statement.dirty}
        onChange={() => {}} />

      {/* {showErrors && errorMessages.length > 0 && (
        <div {...styles.errorMessages}>
          Fehler<br />
          <ul>
            {errorMessages.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )} */}

      <Button
        primary
        type='submit'
        onClick={() => {}}
        /* disabled={showErrors && errorMessages.length > 0} */>Speichern</Button>

      {serverError && <ErrorMessage error={serverError} />}
    </>
  )
}

const ME_CARD = gql`
  query upsertCardForm {
    me {
      id
      name
      isUserOfCurrentSession
      portrait(properties:{width:600 height:800 bw:false})
      cards(first: 1) {
        nodes {
          id
          payload
          group {
            id
            name
          }
        }
      }
    }
  }
`

const withMeCard = graphql(ME_CARD)

const UPSERT_CARD = gql`
  mutation upsertCard(
    $id: ID!
    $portrait: String
    $statement: String!
    $email: String!
  ) {
    upsertCard(
      id: $id
      portrait: $portrait
      statement: $statement
      email: $email
    ) {
      id
    }
  }
`

const withUpsertCard = graphql(
  UPSERT_CARD,
  {
    props: ({ mutate }) => ({
      claimCard: ({ id, portrait, statement, email }) => mutate({
        variables: { id, portrait, statement, email }
      })
    })
  }
)

export default compose(withRouter, withMeCard, withUpsertCard)(Upsert)
