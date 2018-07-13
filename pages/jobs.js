import React from 'react'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'

import Frame from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { A, Editorial, Interaction } from '@project-r/styleguide'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const { Emphasis, P, UL, LI } = Editorial
const { H1, H2 } = Interaction

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
        <H1>HR-Fachfrau/Fachmann 50%</H1>
        <br />
        <P><Emphasis>Sie fühlen sich in einem dynamischen, agilen Medien-Start-up wohl. Sie sind HR-Allrounder/in, haben Erfahrung in allen HR-Themen und -Belangen und können Mitarbeitende vom Eintritt bis zum Austritt begleiten. Ausserdem sind Sie sattelfest in Lohnbuchhaltung und Zeitmanagement.</Emphasis></P>
        <H2>Ihre Aufgabe</H2>
        <UL>
          <LI>Ansprechperson für alle Anliegen von Mitarbeiterinnen und Mitarbeitern sowie deren Vorgesetzten</LI>
          <LI>Zuständigkeit vom Eintritt bis zum Austritt, inkl. Rekrutierung</LI>
          <LI>Mitarbeit bei der Lohnbuchhaltung</LI>
          <LI>Verantwortung im Zeitmanagement</LI>
        </UL>
        <P>Wir erwarten einige Jahre Berufserfahrung im HR sowie eine fachspezifische Weiterbildung (HR-Fachfrau, HR-Fachmann mit eidg. Fachausweis oder gleichwertige Ausbildung). Sie sind eine gewinnende, diskrete Persönlichkeit, die offen auf Menschen zugeht und eine Vertrauensbasis schaffen kann. Sie sind mündlich und schriftlich kommunikationsstark. Sie sind erfahren in anspruchsvollen Gesprächssituationen, agieren mit diplomatischem Geschick und sind klar in Ihrer Aussage. Sie sind flexibel, lösungsorientiert und können mit unterschiedlichen Interessen konstruktiv umgehen.</P>
        <P>Wir bieten Ihnen eine interessante Stelle an, die es Ihnen ermöglicht, Ihre Kenntnisse und Fähigkeiten im HR-Bereich voll einzubringen.</P>
        <P>Senden Sie Ihre Bewerbungsunterlagen an <A href='mailto:bewerbung@republik.ch'>bewerbung@republik.ch</A></P>
      </Frame>
    )
  })
)
