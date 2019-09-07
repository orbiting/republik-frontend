import React, { useState, useEffect } from 'react'
import { withRouter } from 'next/router'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import AutosizeInput from 'react-textarea-autosize'

import { Loader, Interaction, InlineSpinner, Button, A, Field, mediaQueries, colors } from '@project-r/styleguide'

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
  }),
  button: css({
    marginTop: 40,
    width: 170,
    textAlign: 'center'
  })
}

const maybeCard = (data, apply) => {
  return data.me &&
    data.me.cards.nodes.length > 0 &&
    data.me.cards.nodes[0] &&
    apply(data.me.cards.nodes[0])
}

const initialVestedInterests = (data) => {
  const records =
    maybeCard(data, card => card.payload.vestedInterestsRepublik) ||
    maybeCard(data, card => card.payload.vestedInterestsSmartvote) ||
    []

  return records.map((vestedInterest, index) => ({ id: `vestedInterest${index}`, ...vestedInterest }))
}

const Update = (props) => {
  const { router, data } = props

  const [portrait, setPortrait] = useState({ values: {} })
  const [statement, setStatement] = useState({ value: maybeCard(data, card => card.payload.statement) })
  const [budget, setBudget] = useState(() => ({ value: maybeCard(data, card => card.payload.campaignBudget) }))
  const [budgetComment, setBudgetComment] = useState(() => ({ value: maybeCard(data, card => card.payload.campaignBudgetComment) }))
  const [vestedInterests, setVestedInterests] = useState(() => ({ value: initialVestedInterests(data) }))
  const [showErrors, setShowErrors] = useState(false)
  const [serverError, setServerError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [autoUpdateCard, setAutoUpdateCard] = useState(false)

  useEffect(() => {
    if (autoUpdateCard) {
      setShowErrors(true)

      if (errorMessages.length === 0) {
        setLoading(true)

        props.updateCard({
          id: card.id,
          portrait: portrait.values.portrait,
          statement: statement.value,
          payload: {
            campaignBudget: budget.value,
            campaignBudgetComment: budgetComment.value,
            vestedInterestsRepublik: vestedInterests.value
          }
        })
          .then(() => {
            // Success...
            console.log('Success')
            setLoading(false)
          })
          .catch(catchError)
      }

      setAutoUpdateCard(false)
    }
  }, [autoUpdateCard])

  if (data.loading || data.error) {
    return <Loader loading={data.loading} error={data.error} />
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
  const {
    party,
    councilOfStates,
    nationalCouncil,
    occupation,
    yearOfBirth
  } = card.payload
  const { listName, listPlaces, listNumbers } = nationalCouncil

  const handlePortrait = ({ values, errors }) => {
    setPortrait({
      values,
      errors
    })
  }

  const handleStatement = (value, shouldValidate) => {
    setStatement({
      ...statement,
      value,
      error: (
        (value.trim().length <= 0 && 'Statement fehlt')
      ),
      dirty: shouldValidate
    })
  }

  const handleBudget = (value, shouldValidate) => {
    setBudget({
      ...budget,
      value: String(value).replace(/[^0-9]/g, ''),
      error: false,
      dirty: shouldValidate
    })
  }

  const handleBudgetComment = (value, shouldValidate) => {
    setBudgetComment({
      ...budgetComment,
      value,
      error: false,
      dirty: shouldValidate
    })
  }

  const addVestedInterest = e => {
    e && e.preventDefault && e.preventDefault()

    setVestedInterests({
      ...vestedInterests,
      value: [
        ...vestedInterests.value,
        { id: `vestedInterest${vestedInterests.value.length}` }
      ]
    })
  }

  const updateCard = e => {
    e && e.preventDefault && e.preventDefault()

    handleStatement(statement.value, true)
    handlePortrait(portrait)
    handleBudget(budget.value, true)
    handleBudgetComment(budgetComment.value, true)

    setAutoUpdateCard(true)
  }

  const catchError = error => {
    setServerError(error)
    setLoading(false)
  }

  const findErrorMessages = () => {
    return [
      portrait.errors && portrait.errors.portrait,
      portrait.errors && portrait.errors.portraitPreview,
      statement.error,
      budget.error,
      budgetComment.error,
      vestedInterests.error
    ].filter(Boolean)
  }

  const errorMessages = findErrorMessages()

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
        onChange={(_, value, shouldValidate) => handleStatement(value, shouldValidate)} />

      <div>
        <H2>Wahlkampf-Budget</H2>

        <Field
          label='Ihr Wahlkampf-Budget (in CHF)'
          value={budget.value}
          error={budget.dirty && budget.error}
          dirty={budget.dirty}
          onChange={(_, value, shouldValidate) => handleBudget(value, shouldValidate)} />

        <Field
          label={'Bemerkungen zum Wahlkampf-Budget'}
          renderInput={({ ref, ...inputProps }) => (
            <AutosizeInput
              {...inputProps}
              {...fieldSetStyles.autoSize}
              inputRef={ref} />
          )}
          value={budgetComment.value}
          error={budgetComment.dirty && budgetComment.error}
          dirty={budgetComment.dirty}
          onChange={(_, value, shouldValidate) => handleBudgetComment(value, shouldValidate)} />
      </div>

      <div>
        <H2>Interessenbindungen</H2>

        <ul>
          {vestedInterests.value.map((vestedInterest) => (
            <li key={vestedInterest.id}>
              <P key={vestedInterest.id}>
                {vestedInterest.name} ({vestedInterest.entity}); {vestedInterest.position}
              </P>
              <P>
                <A href='#aendern' onClick={() => {}}>Ändern</A>
                {' '}
                <A href='#entfernen' onClick={() => {}}>Entfernen</A>
              </P>
            </li>
          ))}
        </ul>

        <P>
          <A href='#interessenbindung' onClick={addVestedInterest}>
            Interessenbindung hinzufügen
          </A>
        </P>
      </div>

      {showErrors && errorMessages.length > 0 && (
        <div {...styles.errorMessages}>
          Fehler<br />
          <ul>
            {errorMessages.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div {...styles.button}>
        {loading
          ? <InlineSpinner />
          : <Button
            primary
            type='submit'
            block
            onClick={updateCard}
            disabled={showErrors && errorMessages.length > 0}>
            Speichern
          </Button>
        }
      </div>

      {serverError && <ErrorMessage error={serverError} />}
    </>
  )
}

const fragmentCard = gql`
  fragment Card on Card {
    id
    payload
    group {
      id
      name
    }
  }
`

const ME_CARD = gql`
  query updateCardForm {
    me {
      id
      name
      isUserOfCurrentSession
      portrait(properties:{width:600 height:800 bw:false})
      cards(first: 1) {
        nodes {
          ...Card
        }
      }
    }
  }

  ${fragmentCard}
`

const withMeCard = graphql(ME_CARD)

const UPDATE_CARD = gql`
  mutation updateCard(
    $id: ID!
    $portrait: String
    $statement: String!
    $payload: JSON!
  ) {
    updateCard(
      id: $id
      portrait: $portrait
      statement: $statement
      payload: $payload
    ) {
      ...Card
    }
  }

  ${fragmentCard}
`

const withUpdateCard = graphql(
  UPDATE_CARD,
  {
    props: ({ mutate }) => ({
      updateCard: ({ id, portrait, statement, payload }) => mutate({
        variables: { id, portrait, statement, payload }
      })
    })
  }
)

export default compose(withRouter, withMeCard, withUpdateCard)(Update)
