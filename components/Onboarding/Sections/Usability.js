import React, { Fragment } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'

import { Interaction, mediaQueries, Button, linkRule } from '@project-r/styleguide'

import Section from '../Section'
import PathLink from '../../Link/Path'
import ProgressSettings from '../../Account/ProgressSettings'
import {
  submitConsentMutation,
  revokeConsentMutation
} from '../../Article/Progress/api'
import { PROGRESS_EXPLAINER_PATH } from '../../../lib/constants'

const { P } = Interaction

const styles = {
  p: css({
    marginBottom: 20
  }),
  actions: css({
    marginBottom: 20,
    display: 'flex',
    flexWrap: 'wrap',
    position: 'relative',
    '& > button': {
      flexGrow: 1,
      margin: '5px 15px 0 0',
      minWidth: '120px',
      [mediaQueries.mUp]: {
        flexGrow: 0,
        margin: '5px 15px 0 0',
        minWidth: '160px'
      }
    }
  })
}

export const fragments = {
  user: gql`
    fragment UsabilityUser on User {
      id
      PROGRESS: hasConsentedTo(name:"PROGRESS")
    }
  `
}

const Usability = (props) => {
  const { user, onContinue } = props

  // Is ticked when either REVOKE or GRANT consent was submitted.
  const hasConsented = user && user.PROGRESS !== null

  return (
    <Section
      heading='Lesen, Hören und Sehen'
      isTicked={hasConsented}
      showContinue={hasConsented}
      {...props}>
      {hasConsented ? (
        <Fragment>
          <ProgressSettings />
          <br />
        </Fragment>
      ) : (
        <Fragment>
          <P {...styles.p}>Auf Wunsch merken wir uns Ihre Leseeposition in Beiträgen.</P>
          <P {...styles.p}>So können Sie auf unterschiedlichen Geräten an der letzten Stelle weiterlesen.</P>
          <P {...styles.p}>
            Mehr Lesekomfort, für den wir allerdings Ihr persönliches Leseverhalten in der Republik aufzeichnen müssen. <PathLink path={PROGRESS_EXPLAINER_PATH} passHref>
              <a {...linkRule}>Mehr Informationen</a>
            </PathLink>
          </P>
          <div {...styles.actions}>
            <Mutation mutation={submitConsentMutation} onCompleted={() => onContinue(props)}>
              {(mutate, { loading }) => {
                return <Button onClick={mutate} disabled={loading}>Ja</Button>
              }}
            </Mutation>
            <Mutation mutation={revokeConsentMutation} onCompleted={() => onContinue(props)}>
              {(mutate, { loading }) => {
                return <Button onClick={mutate} disabled={loading}>Nein</Button>
              }}
            </Mutation>
          </div>
        </Fragment>
      )}
    </Section>
  )
}

export default Usability
