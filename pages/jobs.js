import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import withT from '../lib/withT'

import Frame from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { A, Editorial, Interaction } from '@project-r/styleguide'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const { P } = Editorial
const { H1 } = Interaction

export default compose(
  withT,
  withRouter
)(({ router, t }) => {
  const meta = {
    pageTitle: t('jobs/pageTitle'),
    title: t('jobs/title'),
    description: t('jobs/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/team/bern.jpg`,
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }

  return (
    <Frame
      meta={meta}
      cover={
        <ImageCover
          image={{
            src: meta.image,
            alt: 'Taufe des Namen und Logo in Bern'
          }}
        />
      }
    >
      <P>Wir sind die Republik. Ein Online-Magazin, das vergangenen Januar gestartet ist. Wir sind crowdfunded und getrieben von unserem Willen, eine gewichtige unabhängige Stimme in der Schweizer Medienlandschaft zu sein. Noch sind wir nicht ganz dort, wo wir hinwollen. Aber mit deiner Hilfe gelangen wir ein paar Schritte weiter. Derzeit suchen wir eine*n Neue*n mit einer Schwäche für starken Journalismus.</P>
      <H1>Projektleiter*in Marketing/Kommunikation (80 Prozent)</H1>
      <br />
      <P>Du bist Hohepriester*in unserer Marke und trägst sie in die Welt hinaus. Dafür hast du in deinem Rucksack neben ganz viel Talent und Cleverness auch überzeugende Erfahrungen in Marketingkommunikation und kannst Aus- und Weiterbildungen vorweisen. Du beherrschst das Chaos, haust deine Massnahmen präzis wie Tontauben raus und verlierst Budget und Ziele nicht aus den Augen. Bei deinen Projekten übernimmst du den Lead nicht nur gern, sondern auch erfolgreich. Du siegst über Drachen und Windmühlen und arbeitest gut mit Leuten, deren Köpfe anders funktionieren als deiner. Idealerweise bist du mit dem Verlagsbusiness vertraut. Du verstehst, wie Social Media und Communities ticken und wie du sie für uns nutzen kannst – indem du etwa neue Leserinnen für unsere Storys begeisterst. Du verstehst dich mit allen gut und arbeitest erfolgreich mit unseren externen Agenturen zusammen. Bei aller Kreativität, die du einsetzt, bist du auch genug Zahlenmensch, um Reportings und Analysen zu erstellen.</P>
      <P>Wir bieten dir eine Stelle, wie es sie nicht überall gibt, viele neue Freunde und einen konkurrenzfähigen Einheitslohn für alle. Arbeitsort ist mitten im Zürcher Kreis 4, wo du auch mal laut sein darfst.</P>
      <P>Ab sofort oder nach Vereinbarung.</P>
      <P>Fragen und Bewerbungen an Amanda Strub<br />
        <A href='mailto:bewerbung@republik.ch'>bewerbung@republik.ch</A></P>
    </Frame>
  )
})
