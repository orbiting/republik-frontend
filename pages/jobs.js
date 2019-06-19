import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import { Editorial, Interaction, A } from '@project-r/styleguide'

import withT from '../lib/withT'

import Frame, { MainContainer, Content } from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { PUBLIC_BASE_URL } from '../lib/constants'

import {
  List as TestimonialList
} from '../components/Testimonial/List'

const { P, LI } = Editorial
const { H1 } = Interaction

const H2 = ({ children }) => <Interaction.H2 style={{ marginBottom: 10 }}>{children}</Interaction.H2>
const H3 = ({ children }) => <Interaction.H3 style={{ marginBottom: -20 }}>{children}</Interaction.H3>

// data source: https://api.republik.ch/graphiql/?query=%7B%0A%20%20employees%20%7B%0A%20%20%20%20title%0A%20%20%20%20group%0A%20%20%20%20name%0A%20%20%20%20user%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20slug%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20statement%0A%20%20%20%20%20%20credentials%20%7B%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20portrait%0A%20%20%20%20%20%20updatedAt%0A%20%20%20%20%20%20sequenceNumber%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A
// copy(d.data.employees.filter(e => e.name.match(/(Preusse|Moor|Venetz|Recher|Strub)/)))
const immediateTeam = [
  {
    'title': 'Software-Entwickler',
    'group': 'Redaktion',
    'name': 'Andreas Moor',
    'user': {
      'id': '65b64225-3843-4e41-a7a6-716ae81a5d57',
      'slug': 'amoor',
      'name': 'Andreas Moor',
      'statement': null,
      'credentials': [
        {
          'description': 'Software-Entwickler'
        }
      ],
      'portrait': 'https://cdn.republik.space/s3/republik-assets/portraits/debad63791ed0bf7dfd088bbf4524392.jpeg?size=2078x1169&resize=384x384&bw=true',
      'updatedAt': '2018-10-05T14:56:14.298Z',
      'sequenceNumber': 1549
    }
  },
  {
    'title': 'Software-Entwickler',
    'group': 'Redaktion',
    'name': 'Patrick Recher',
    'user': {
      'id': 'b3054752-eefe-4cb4-9da0-b57a9c07d334',
      'slug': 'patte',
      'name': 'Patrick Recher',
      'statement': 'Union in struggle!',
      'credentials': [
        {
          'description': 'Programmierer'
        },
        {
          'description': 'Software-Entwickler @Republik'
        }
      ],
      'portrait': 'https://cdn.republik.space/s3/republik-assets/portraits/98cf43149fdd9c0916dac399f8b03c45.jpeg?size=400x400&resize=384x384&bw=true',
      'updatedAt': '2019-06-12T08:27:47.661Z',
      'sequenceNumber': 8
    }
  },
  {
    'title': 'Software-Entwickler',
    'group': 'Redaktion',
    'name': 'Patrick Venetz',
    'user': {
      'id': 'b86f9625-96b8-4886-b6b9-baf4fb657939',
      'slug': 'pae',
      'name': 'Patrick Venetz',
      'statement': '🍪',
      'credentials': [
        {
          'description': 'Software-Entwickler, Republik Mitarbeiter des Monats'
        },
        {
          'description': 'Web-Entwickler'
        },
        {
          'description': 'Programmierer'
        },
        {
          'description': 'Software-Entwickler'
        },
        {
          'description': 'Entwickler @Republik'
        },
        {
          'description': 'Software-Entwickler @Republik'
        }
      ],
      'portrait': 'https://cdn.republik.space/s3/republik-assets/portraits/95b35a0ba210cdaabf10fcea9caafc17.jpeg?size=2988x1681&resize=384x384&bw=true',
      'updatedAt': '2019-04-03T04:16:15.525Z',
      'sequenceNumber': 16349
    }
  },
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
  },
  {
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
]

export default compose(
  withT,
  withRouter
)(({ router, t }) => {
  const meta = {
    pageTitle: t('jobs/pageTitle'),
    title: t('jobs/title'),
    description: t('jobs/description'),
    image: 'https://place-hold.it/2400x800?text=Cover',
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
          alt: 'Taufe des Namen und Logo in Bern'
        }}
      />
      <MainContainer>
        <Content>
          <H1>Offene Stellen</H1>
          <br />
          <br />
          <H2>Entwicklerinnen und Designer gesucht</H2>
          <P>Wir suchen dich. Wir arbeiten für relevanten, unabhängigen und innovativen Journalismus. Und wir sind eine interdisziplinäre und leidenschaftliche <A href='/impressum'>Crew</A>. Unser <A href='https://github.com/orbiting'>Code ist Open-Source</A>, wir haben einen <A href='https://styleguide.republik.ch/'>Styleguide</A> und unsere <A href='https://api.republik.ch/graphiql'>API ist öffentlich</A> zugänglich.</P>
          <P>Zusammen mit dem Team willst du die Republik langfristig weiterentwickeln und verbessern. Du geniesst viel Freiheit zu haben, bringst dich gerne auch konzeptionell ein und interessierst dich für verschiedene Aspekte unseres Produktes: einzelne Geschichten, Mitglieschaften gewinnen, Mitgliederinnen bei Laune halten, Leuchtturm Projekte, neue Erzählformen, Datenvisualisierung, Statistik und vieles mehr.</P>

          <H3>Designerin</H3>
          <P>
            Du bist ein Designer mit Erfahrung im Journalismus. Geschichten illustriert, mit Daten und oder Interaktion zu erklären liegt dir. Darüber hinaus hast du auch ein Interesse an Produktdesign und kannst dir vorstellen das Team bei Änderung am Produkt aus Designsicht zu unterstützen.
          </P>
          <H3>React-Entwickler</H3>
          <P>
            Du bist eine React-Entwicklerin. Wenn du schon mit GraphQL oder next.js gearbeitet hast: umso besser. Du hast ein überzeugendes UX-Portfolio und kannst in agilen Prozessen dafür sorgen, dass Design, Funktionalität und Inhalt zu einem überzeugenden Ganzen verschmelzen.
          </P>
          <H3>Backend-Entwicklerin</H3>
          <P>
            Du bist ein node.js-Entwickler. GraphQL und PostgreSQL sind dir ein Begriff und du möchtest damit arbeiten. Du sorgst dafür dass unsere API zuverlässig und stabil läuft und bist auch nicht abgeneigt eine Datenauswertung für unser Produkt oder auch eine Geschichte zu machen.
          </P>

          <H3>Was wir bieten</H3>
          <br />
          <Editorial.UL>
            <LI>Pensum wählbar: Teilzeit möglich</LI>
            <LI>Sinnstiftende Arbeit: <A href='/manifest'>Aufklärung, Kritik der Macht und Verantwortung für die&nbsp;Öffentlichkeit</A></LI>
            <LI>Nettoeinheitslohn auf hohem Niveau</LI>
            <LI>Zentraler Arbeitsort an der Langstrasse in Zürich</LI>
            <LI>Flexible Arbeitszeiten und Homeoffice</LI>
          </Editorial.UL>

          <P>
            Du wirst Teil des IT-Teams und eng mit Kolleginnen aus der Redaktion, dem Community- und Marketing-Team zusammenarbeiten.
          </P>

          <TestimonialList
            minColumns={3}
            showCredentials
            statements={immediateTeam.map(employee => ({
              ...employee.user,
              name: employee.name,
              credentials: [
                {
                  description: employee.title || employee.group
                }
              ].filter(d => d.description)
            }))}
            t={t} />
          <P>
            <A href='/impressum'>Vollständige Crew im Impressum</A>
          </P>

          <H3>Wie bewerben?</H3>
          <P>
            Du bist interessiert? Dann bewirb dich mit einer E-Mail bei <A href='mailto:thomas.preusse@republik.ch'>Thomas Preusse</A> oder <A href='mailto:amanda.strub@republik.ch'>Amanda Strub</A>.
          </P>
          <P>Deine Bewerbung sollte ein Lebenslauf und Portfolio beinhalten. Es ist keine formale Ausbildung zwingend: wir interessieren uns für dich ganz egal ob du einen Master hast oder du dir alles selbst beigebracht hast. Das Wichtigste ist dass du das bestmöglichst Onlinemagazin der Schweiz mit uns entwickeln willst.</P>
          <P>
            Zum Bewerbungsprozess: Entweder wir laden dich für ein erstes Gespräch ein oder du bekommst leider eine Absage. Falls wir uns nach dem ersten Gespräch eine Zusammenarbeit vorstellen können, laden wir dich für einen Kennenlerntag ein. Wir arbeiten zusammen an einem Feature oder einer Geschichte und du lernst den Rest des Teams kennen. Du und wir haben so eine möglichst gute Grundlage für den finalen Entscheid.
          </P>
          <P>Wir können es kaum erwarten, dich in unserem Team zu begrüssen!</P>
        </Content>
      </MainContainer>
    </Frame>
  )
})
