import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { css } from 'glamor'

import { Editorial, Interaction, A, mediaQueries } from '@project-r/styleguide'

import withT from '../lib/withT'

import Frame, { MainContainer, Content } from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { PUBLIC_BASE_URL } from '../lib/constants'

import {
  List as TestimonialList
} from '../components/Testimonial/List'

import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../components/constants'

const { P, LI } = Editorial
const { H1 } = Interaction

const H2 = ({ children }) => <Interaction.H2 style={{ marginBottom: -20 }}>{children}</Interaction.H2>
const H3 = ({ children }) => <Interaction.H3 style={{ marginBottom: -20 }}>{children}</Interaction.H3>

const styles = {
  anchor: css({
    display: 'block',
    visibility: 'hidden',
    position: 'relative',
    top: -(HEADER_HEIGHT_MOBILE + 20),
    [mediaQueries.mUp]: {
      top: -(HEADER_HEIGHT + 20)
    }
  })
}

const Anchor = ({ children, id }) => {
  return (
    <div>
      <a {...styles.anchor} id={id} />
      {children}
    </div>
  )
}

// data source: https://api.republik.ch/graphiql/?query=%7B%0A%20%20employees%20%7B%0A%20%20%20%20title%0A%20%20%20%20group%0A%20%20%20%20name%0A%20%20%20%20user%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20slug%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20statement%0A%20%20%20%20%20%20credentials%20%7B%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20portrait%0A%20%20%20%20%20%20updatedAt%0A%20%20%20%20%20%20sequenceNumber%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A
// copy(d.data.employees.filter(e => e.name.match(/(Preusse|Strub)/)))

const amanda = {
  'title': 'HR und Finanzen',
  'group': 'Verlag',
  'name': 'Amanda Strub',
  'user': {
    'id': '2c869271-0b9d-4861-9c49-8d7ae7a72439',
    'slug': 'astrub',
    'name': 'Amanda Strub',
    'statement': null,
    'credentials': [
      {
        'description': 'Head Human Resources'
      }
    ],
    'portrait': 'https://cdn.republik.space/s3/republik-assets/portraits/45302395c1013519498f81f77f668a7b.jpeg?size=2094x1178&resize=384x384&bw=true',
    'updatedAt': '2018-11-01T11:53:00.038Z',
    'sequenceNumber': 23847
  }
}

const communityContacts = [
  amanda
]

const itContacts = [
  amanda,
  {
    'title': 'Head of IT',
    'group': 'Redaktion',
    'name': 'Thomas Preusse',
    'user': {
      'id': '57ff6996-e3ef-4186-a2e6-95376f2b086b',
      'slug': 'tpreusse',
      'name': 'Thomas Preusse',
      'statement': 'Daten und Visualisierungen gegen veraltete Fakten, Befangenheit und Empörung',
      'credentials': [
        {
          'description': 'Entwickelnder Journalist'
        },
        {
          'description': 'Head of IT'
        }
      ],
      'portrait': 'https://cdn.republik.space/s3/republik-assets/portraits/d14b93d52f16b2927c31320d6c864e85.jpeg?size=2000x2000&resize=384x384&bw=true',
      'updatedAt': '2019-06-18T14:08:33.191Z',
      'sequenceNumber': 7
    }
  }
]

export default compose(
  withT,
  withRouter
)(({ router, t }) => {
  const meta = {
    pageTitle: t('jobs/pageTitle'),
    title: t('jobs/title'),
    description: t('jobs/description'),
    image: 'https://cdn.republik.space/s3/republik-assets/assets/images/jobs.jpg?resize=2000x',
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }

  return (
    <Frame
      meta={meta}
      raw
    >
      <ImageCover
        image={{
          src: meta.image,
          alt: 'Weitwinkelfoto von vielen Republik-Mitarbeitern und Freunden mit brennender Geburtstagstorte in Mitte.'
        }}
      />
      <MainContainer>
        <Content>
          <P>
            Die Republik ist ein täglich erscheinendes digitales, werbefreies Magazin für Politik, Wirtschaft, Gesellschaft und Kultur. Wir sind getrieben von unserem Willen, eine gewichtige unabhängige Stimme in der Schweizer Medienlandschaft zu sein. Werde Teil einer <A href='/impressum'>interdisziplinären und leidenschaftlichen Crew</A>.
          </P>
          <H1>Offene Stellen</H1>
          <Editorial.UL>
            <LI><A href='#editorial'>Redaktorin mit Fokus Inland und Politik</A></LI>
            <LI><A href='#community'>Community Builder & Partnership Management</A></LI>
            <LI><A href='#it'>Designerin</A></LI>
            <LI><A href='#it'>React-Entwickler</A></LI>
            <LI><A href='#it'>Backend-Entwicklerin</A></LI>
          </Editorial.UL>
          <br />
          <br />
          <Anchor id='editorial'>
            <H2>Redaktorin mit Fokus Inland und Politik</H2>
          </Anchor>
          <P>
            Damit du für diese Rolle in Frage kommst, bist du bereits einige Jahre als Journalistin tätig und hast ein besonderes Interesse an den Bereichen Inland, Politik und Bundeshaus. Du bist gut vernetzt in Bern wie auch dem Rest der Schweiz.
          </P>
          <P>
            Du verstehst die Wichtigkeit von unabhängigem Journalismus und bringst Energie und Lust mit, um Beiträge zu realisieren, die aufdecken, hinterfragen und analysieren. Du denkst über den Tellerrand hinaus, bist neugierig, kritisch und eigenständig. Du magst interdisziplinäres Arbeiten, bringst deine Ideen ein und treibst die Umsetzung journalistischer Projekte aktiv voran. Zudem hast du eine Vorstellung davon, wie der Politikjournalismus bei der Republik, einem modernen, digitalen Magazin, in Zukunft aussehen sollte.
          </P>
          <P>
            Du übernimmst gerne Verantwortung und fühlst dich wohl in einem dynamischen, sich stetig verändernden Umfeld. Du arbeitest gerne im Team, legst Wert auf offene Kommunikation und nutzt Kritik, um dich weiterzuentwickeln. Auch schätzt du den Austausch und Dialog mit der Community und beteiligst dich gerne aktiv daran.
          </P>
          <P>
            Hast du Lust, zusammen mit anderen kreativen Köpfen Journalismus zu machen, der bewegt und überrascht? Dann bewirb dich, wir freuen uns!
          </P>
          <P>Ab September oder nach Vereinbarung, 60 bis 80 Prozent.</P>

          <H3>Was wir bieten</H3>
          <br />
          <Editorial.UL>
            <LI>Konkurrenzfähiger Einheitslohn</LI>
            <LI>Kreatives, unkonventionelles Arbeitsumfeld</LI>
            <LI>Arbeitsorte Zürich und Bern</LI>
          </Editorial.UL>

          <H3>Wie bewerben?</H3>
          <P style={{ marginBottom: 10 }}>
            Fragen & Bewerbungen an: <A href='mailto:bewerbung@republik.ch'>bewerbung@republik.ch</A>.
          </P>
          <TestimonialList
            share={false}
            minColumns={3}
            showCredentials
            statements={communityContacts.map(employee => ({
              ...employee.user,
              name: employee.name,
              credentials: [
                {
                  description: employee.title || employee.group
                }
              ].filter(d => d.description)
            }))}
            t={t} />
          <br />
          <br />
          <Anchor id='community'>
            <H2>Community Builder & Partnership Management</H2>
          </Anchor>
          <P>
            In dieser Rolle trägst du unsere Marke in die Welt hinaus! Du hast einen Rucksack voller Erfahrung mit Online Community Building und digitalen Kampagnen: von der Konzeption und der Durchführung bis zur Erfolgsmessung. Wir suchen jemanden mit Know-how in den Bereichen:
          </P>
          <Editorial.UL>
            <LI>Analytic Skills und Tools für die tägliche Datenanalyse</LI>
            <LI>Digital Sales, User Journeys und Conversion Marketing</LI>
            <LI>Partnership Management und Public Relations</LI>
            <LI>Influencer Marketing und Social Communities</LI>
          </Editorial.UL>
          <P>
            Übernimmst du gerne den Lead, magst du die Zusammenarbeit mit kreativen Köpfen aus verschiedenen Bereichen, verstehst du, wie Online-Communitys ticken und kannst du unsere Leserinnen begeistern und potenzielle Abonnentinnen von der Republik überzeugen? Dann melde dich!
          </P>
          <P>Ab sofort oder nach Vereinbarung, 80 bis 100 Prozent.</P>

          <H3>Was wir bieten</H3>
          <br />
          <Editorial.UL>
            <LI>Konkurrenzfähiger Einheitslohn</LI>
            <LI>Kreatives, unkonventionelles Arbeitsumfeld</LI>
            <LI>Viel Gestaltungsspielraum</LI>
            <LI>Zentraler Arbeitsort an der Langstrasse in Zürich</LI>
          </Editorial.UL>

          <P>
            Du wirst Teil des Community-Teams und eng mit Kollegen aus der Redaktion und dem IT-Team zusammenarbeiten.
          </P>

          <H3>Wie bewerben?</H3>
          <P style={{ marginBottom: 10 }}>
            Fragen & Bewerbungen an: <A href='mailto:bewerbung@republik.ch'>bewerbung@republik.ch</A>.
          </P>
          <TestimonialList
            share={false}
            minColumns={3}
            showCredentials
            statements={communityContacts.map(employee => ({
              ...employee.user,
              name: employee.name,
              credentials: [
                {
                  description: employee.title || employee.group
                }
              ].filter(d => d.description)
            }))}
            t={t} />
          <P>Wir freuen uns auf deine Bewerbung.</P>
          <br />
          <br />
          <Anchor id='it'>
            <H2>Entwicklerinnen und Designer gesucht</H2>
          </Anchor>
          <P>Unser <A href='https://github.com/orbiting'>Code ist Open Source</A>, wir haben einen <A href='https://styleguide.republik.ch/'>Styleguide</A> und unsere <A href='https://api.republik.ch/graphiql'>API ist öffentlich</A> zugänglich.</P>

          <P>
            Zusammen mit dem Team willst du die Republik langfristig weiterentwickeln. Du geniesst es, viel Freiheit zu haben, bringst dich gerne konzeptionell ein und interessierst dich für verschiedene Aspekte unseres Produktes: einzelne Geschichten, Mitgliedschaften gewinnen, Mitglieder bei Laune halten, Benutzerfreundlichkeit verbessern, neue Erzählformen, Datenvisualisierung, Datenanalyse und vieles mehr.
          </P>

          <H3>Designerin</H3>
          <P>
            Du bist ein Designer mit Erfahrung im Online-Journalismus. Geschichten illustrieren, mit Daten und oder Interaktion zu erklären, liegt dir. Darüber hinaus hast du ein Interesse an Produktdesign und unterstützt das Team bei der Weiterentwicklung der Republik.
          </P>
          <H3>React-Entwickler</H3>
          <P>
            Du bist eine React-Entwicklerin. Wenn du schon mit GraphQL oder Next.js gearbeitet hast: umso besser. Du hast eine Leidenschaft für Benutzerfreundlichkeit und kannst in agilen Prozessen dafür sorgen, dass Design, Funktionalität und Inhalt zu einem überzeugenden Ganzen verschmelzen.
          </P>
          <H3>Backend-Entwicklerin</H3>
          <P>
            Du bist ein Node.js-Entwickler. GraphQL und PostgreSQL sind dir ein Begriff und du möchtest damit arbeiten. Du hilfst mit, dass unsere API zuverlässig und schnell läuft und bist auch nicht abgeneigt, eine Datenauswertung zu erstellen oder eine Geschichte zu programmieren.
          </P>

          <H3>Was wir bieten</H3>
          <br />
          <Editorial.UL>
            <LI>Sinnstiftende Arbeit: <A href='/manifest'>Aufklärung, Kritik der Macht und Verantwortung für die&nbsp;Öffentlichkeit</A></LI>
            <LI>Einheitslohn auf hohem Niveau</LI>
            <LI>Teilzeit möglich</LI>
            <LI>Flexible Arbeitszeiten und Homeoffice</LI>
            <LI>Zentraler Arbeitsort an der Langstrasse in Zürich</LI>
          </Editorial.UL>

          <P>
            Du wirst Teil des IT-Teams und eng mit Kolleginnen aus der Redaktion und dem Community-Team zusammenarbeiten.
          </P>

          <H3>Wie bewerben?</H3>
          <P style={{ marginBottom: 10 }}>
            Du bist interessiert? Dann bewirb dich: <A href='mailto:bewerbung@republik.ch'>bewerbung@republik.ch</A>.
          </P>
          <TestimonialList
            share={false}
            minColumns={3}
            showCredentials
            statements={itContacts.map(employee => ({
              ...employee.user,
              name: employee.name,
              credentials: [
                {
                  description: employee.title || employee.group
                }
              ].filter(d => d.description)
            }))}
            t={t} />
          <P>Deine Bewerbung sollte einen Lebenslauf und ein Portfolio beinhalten. Es ist keine formale Ausbildung zwingend: Wir interessieren uns für dich, ganz egal, ob du einen Master hast oder du dir alles selbst beigebracht hast. Das Wichtigste ist, dass du das beste digitale Magazin der Schweiz mit uns entwickeln willst.</P>
          <P>
            Zum Bewerbungsprozess: Entweder wir laden dich zu einem ersten Gespräch ein, oder du bekommst eine Absage. Falls wir uns nach diesem Gespräch eine Zusammenarbeit vorstellen können, laden wir dich für einen Kennenlerntag ein. Wir arbeiten zusammen an einem Feature oder einer Geschichte und du lernst den Rest des Teams kennen. So haben wir alle, du und wir, eine möglichst gute Grundlage für den finalen Entscheid.
          </P>
          <P>Wir freuen uns auf deine Bewerbung.</P>
        </Content>
      </MainContainer>
    </Frame>
  )
})
