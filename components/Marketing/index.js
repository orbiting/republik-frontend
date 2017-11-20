import React from 'react'
import { Link } from '../../lib/routes'
import { css } from 'glamor'
import {
  Button,
  Container,
  Interaction,
  P,
  colors,
  mediaQueries
} from '@project-r/styleguide'

const MAX_WIDTH = '1005px'

// TODO: revisit special font sizes with design.
const styles = {
  intro: css({
    maxWidth: MAX_WIDTH,
    paddingTop: '35px',
    paddingBottom: '35px',
    [mediaQueries.mUp]: {
      paddingTop: '100px',
      paddingBottom: '100px'
    }
  }),
  text: css({
    fontSize: '16px',
    lineHeight: '26px',
    [mediaQueries.mUp]: {
      fontSize: '24px',
      lineHeight: '36px'
    }
  }),
  headline: css({
    fontSize: '28px',
    lineHeight: '34px',
    [mediaQueries.mUp]: {
      fontSize: '60px',
      lineHeight: '72px'
    }
  }),
  join: css({
    backgroundColor: colors.primaryBg,
    textAlign: 'center',
    padding: '18px 0',
    [mediaQueries.mUp]: {
      padding: '90px 0'
    }
  }),
  joinText: css({
    textAlign: 'left',
    margin: '20px 0 30px 0',
    [mediaQueries.mUp]: {
      margin: '40px 0 50px 0'
    }
  })
}

export default () => [
  <Container {...styles.intro}>
    <Interaction.H1 {...css(styles.headline, { marginBottom: '30px' })}>
      Hier kommt ein Titel
    </Interaction.H1>
    <P {...styles.text}>
      Die Republik ist eine kleine Rebellion. Für den Journalismus. Und gegen
      die Medienkonzerne. Denn die grossen Verlage verlassen die Publizistik:
      Sie bauen sich in hohem Tempo in Internet-Handelshäuser um. Das ist eine
      schlechte Nachricht für den Journalismus. Aber auch für die Demokratie.
      Denn ohne vernünftige Informationen fällt man schlechte Entscheidungen.
    </P>
    <P {...styles.text}>
      Eine funktionierende Demokratie braucht funktionierende Medien. Und dafür
      braucht es nicht nur Journalistinnen und Journalisten, sondern auch Sie.
      Als Leserinnen. Als Bürger. Als Menschen, die bereit sind, etwas Geld in
      unabhängigen Journalismus zu investieren.
    </P>
  </Container>,
  <div {...styles.join}>
    <Container style={{ maxWidth: MAX_WIDTH }}>
      <Interaction.P {...css(styles.headline, { marginBottom: '10px' })}>
        Abo und Mitgliedschaft
      </Interaction.P>
      <Interaction.H1 {...css(styles.headline, { color: colors.primary })}>
        CHF 240/Jahr
      </Interaction.H1>
      <Interaction.P {...css(styles.text, styles.joinText)}>
        Willkommen an Bord! Sie erhalten für ein Jahr unser Magazin. Und werden
        automatisch Mitglied der Project R Genossenschaft. Und damit zu einem
        kleinen Teil Verleger oder Verlegerin der Republik.
      </Interaction.P>
      <Link route='pledge'>
        <Button primary block>
          Mitglied werden
        </Button>
      </Link>
    </Container>
  </div>
]
