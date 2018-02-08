import React from 'react'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'

import Frame from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { Editorial, Interaction, A } from '@project-r/styleguide'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const { P, LI } = Editorial

export default withData(
  withT(({ url, t }) => {
    const meta = {
      pageTitle: t('jobs/pageTitle'),
      title: t('jobs/title'),
      description: t('jobs/description'),
      image: `${CDN_FRONTEND_BASE_URL}/static/team/bern.jpg`,
      url: `${PUBLIC_BASE_URL}${url.pathname}`
    }

    return (
      <Frame
        url={url}
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
        <Interaction.H1>Offene Stellen</Interaction.H1>
        <br />
        <Interaction.H2>Coder, Entwicklerinnen und Nerds gesucht</Interaction.H2>
        <P>Wir suchen dich. Wir sind das Team der Republik. Wir arbeiten für relevanten, unabhängigen und innovativen Journalismus ohne Bullshit. Und wir sind eine interdisziplinäre, qualifizierte, hart arbeitende, leidenschaftliche und fröhliche <A href='/crew'>Crew</A>. Unser Code ist vollständig Open-Source: <A href='https://github.com/orbiting'>github.com/orbiting</A>.</P>
        <P>Du hast Lust, bei uns viel Verantwortung zu übernehmen. Zusammen mit dem Team willst du die Republik langfristig weiterentwickeln und maintainen. Du geniesst viel Freiheit zu haben, bringst dich gerne auch konzeptionell ein und interessierst dich für verschiedene Aspekte unseres Produktes: von einer möglichst stabilen und einfachen Payments-Lösung über unser super cooles wysiwyg-markdown-github-CMS hin zu neuen Tools für spannende User-Interaktion.</P>
        <Interaction.H2>node.js-Entwicklerin (70 - 100%)</Interaction.H2>
        <P>Du bist ein erfahrener node.js-Entwickler. Insbesondere GraphQL und PostgreSQL sind dir vertraut. Du hast in der Vergangenheit schon Verantwortung für Software-Projekte getragen. Und du weisst, was es braucht, ein Konzept erfolgreich umzusetzen bis hin zum laufenden Betrieb. </P>
        <Interaction.H2>React-Entwickler (70 - 100%)</Interaction.H2>
        <P>Du bist eine erfahrene React-Entwicklerin. Wenn du schon mit GraphQL, next.js oder React Native gearbeitet hast: umso besser. Du hast ein überzeugendes UX-Portfolio und kannst in agilen Prozessen dafür sorgen, dass Design, Funktionalität und Inhalt zu einem überzeugenden Ganzen verschmelzen.</P>
        <Interaction.H2>Wie bewerben?</Interaction.H2>
        <P>Du bist interessiert? Dann bewirb dich mit einer E-Mail bei <A href='mailto:clara.vuillemin@republik.ch'>clara.vuillemin@republik.ch</A></P>
        <P>Bitte beantworte in der Bewerbung – neben dem, was du uns sonst noch sagen möchtest – folgende Fragen: </P>

        <Editorial.UL>
          <LI> Was denkst du über unser Produkt? Was gefällt dir daran? Was würdest du ändern?</LI>
          <LI>Was interessiert dich am Journalismus?</LI>
          <LI>Was macht dich zu einer guten Coderin, einem guten Coder?</LI>
          <LI>Hast du Projekte, auf die du besonders stolz bist? Dann freuen wir uns über Links zu Open Source Repos, Websites etc. und eine Begründung, warum du besonders stolz darauf bist.</LI>
        </Editorial.UL>

        <P>Zum Bewerbungsprozess: Entweder wir laden dich für ein erstes Gespräch ein oder du bekommst leider eine Absage. Falls wir uns nach dem ersten Gespräch eine Zusammenarbeit vorstellen können, laden wir dich für einen Probearbeitstag ein. Wir arbeiten zusammen an einem Feature und du lernst den Rest des Teams kennen. Du und wir haben so eine möglichst gute Grundlage für den finalen Entscheid. Beginn der Arbeit: so bald wie möglich.</P>
        <P>Wir können es kaum erwarten, dich in unserem Team zu begrüssen!</P>

      </Frame>
    )
  })
)
