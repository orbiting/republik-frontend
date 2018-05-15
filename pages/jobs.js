import React from 'react'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'

import Frame from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { Editorial, Interaction } from '@project-r/styleguide'

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

        <P>Die Republik ist ein digitales Magazin, das sich mit Themen aus Politik, Gesellschaft, Kultur und Wirtschaft befasst. Das Magazin ging am 14. Januar 2018 online. Es setzt auf Recherchen und Reportagen. Täglich bietet die Republik ihren Leserinnen und Lesern bis zu drei Artikel. Das Magazin ist werbefrei und finanziert sich über Abonnements und Mitgliedschaften. Die Redaktion hat ihren Sitz im Rothaus in Zürich.</P>

        <P>Zum Ausbau unserer Kulturredaktion suchen wir nach Vereinbarung eine/n</P>

        <Interaction.H2>Redaktor/in 60–80%</Interaction.H2>
        <br />
        <P>Wir bieten</P>
        <Editorial.UL>
          <LI>Mitverantwortung für die Organisation, Gestaltung und Weiterentwicklung des Kulturteils der Republik;</LI>
          <LI>eine Arbeit im Dialog mit der Republik-Leserschaft auf der Republik-Plattform, auf den sozialen Kanälen und bei Veranstaltungen;</LI>
          <LI>ein vielfältiges journalistisches Tätigkeitsfeld inklusive redaktionellen Arbeitens;</LI>
          <LI>die Möglichkeit zu selbstständiger Recherche und Produktion eigener Artikel und Reportagen;</LI>
          <LI>eine Plattform zum Verfassen von Rezensionen;</LI>
          <LI>ein abwechslungsreiches, herausforderndes und inspirierendes Umfeld mit agilen Arbeitsweisen.</LI>
        </Editorial.UL>

        <P>Wir freuen uns auf</P>
        <Editorial.UL>
          <LI>eine Kollegin, einen Kollegen, die/der Erfahrung im Kulturjournalismus und  ausgezeichnete Kenntnisse in mindestens einem der klassischen Feuilletongebiete inklusive Pop-Art und Subkulturen mitbringt;</LI>
          <LI>einen offenen Geist, der sich auch auf unkonventionelle Arbeitsmethoden einlässt und in einem heterogenen Team seine Linie behält;</LI>
          <LI>eine Journalistin, einen Journalisten, die/der neue Herausforderungen sucht, ein Spezialgebiet hat und bereit ist, dieses weiter zu erforschen;</LI>
          <LI>eine Persönlichkeit mit eigenständiger Denkweise;</LI>
          <LI>eine Bewerberin, einen Bewerber, die/der gern redaktionell tätig sein will, Ideen und Konzepte generiert, Texte redigiert und Themengebiete betreut;</LI>
          <LI>eine Autorin, einen Autoren, die/der sich durch herausragende feuilletonistische Beiträge bereits einen Namen gemacht hat.</LI>
        </Editorial.UL>

        <P>Interessiert? Neugierig? Senden Sie Ihre vollständigen Bewerbungsunterlagen an <a href='mailto:personal@republik.ch'>personal@republik.ch</a>.</P>

      </Frame>
    )
  })
)
