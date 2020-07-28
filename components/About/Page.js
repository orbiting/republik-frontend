import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Breakout,
  Center,
  Container,
  Editorial,
  Interaction,
  RawHtml,
  colors,
  mediaQueries
} from '@project-r/styleguide'
import Loader from '../Loader'
import { ascending } from 'd3-array'

import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'

import Employee from '../Imprint/Employee'

const query = gql`
  query AboutPage {
    membershipStats {
      count
    }
    employees {
      title
      name
      group
      subgroup
      user {
        id
        portrait
        slug
      }
    }
    mediaResponses {
      medium
      publishDate
      title
      url
    }
    documents(feed: true, first: 0, template: "article") {
      totalCount
    }
  }
`

const styles = {
  titleBlock: css({
    margin: '20px auto 20px auto',
    [mediaQueries.mUp]: {
      margin: '60px 0 80px 0'
    }
  }),
  lead: css({
    textAlign: 'center',
    maxWidth: '820px',
    margin: '12px auto 0 auto',
    [mediaQueries.mUp]: {
      marginTop: '32px'
    }
  }),
  subheader: css({
    marginBottom: 20,
    textAlign: 'center',
    [mediaQueries.lUp]: {
      marginBottom: 30
    }
  }),
  section: css({
    marginBottom: 40,
    [mediaQueries.mUp]: {
      marginBottom: 80
    }
  }),
  employees: css({
    display: 'flex',
    margin: '0 auto',
    maxWidth: '473px'
  }),
  faqCta: css({
    margin: '10px 0',
    [mediaQueries.mUp]: {
      margin: '15px 0'
    }
  }),
  link: css({
    color: colors.text,
    textDecoration: 'underline'
  }),
  tiles: css({
    marginLeft: '-5px',
    flexWrap: 'wrap',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 50,
    [mediaQueries.mUp]: {
      marginTop: 80
    }
  })
}

const { Emphasis, P } = Editorial

const Subheader = ({ children }) => (
  <Interaction.H2 {...styles.subheader}>{children}</Interaction.H2>
)

const Subheader2 = ({ children }) => (
  <Interaction.H3 {...styles.subheader}>{children}</Interaction.H3>
)

const AboutPage = ({
  t,
  data,
  data: {
    membershipStats,
    documents,
    employees,
    mediaResponses,
    loading,
    error
  }
}) => {
  const publishersCount = membershipStats
    ? countFormat(membershipStats.count)
    : `~${countFormat(25000)}`
  const documentsCount = (documents && documents.totalCount) || 'Über 2500'

  return (
    <Fragment>
      <Container>
        <div {...styles.titleBlock}>
          <Interaction.Headline
            style={{
              maxWidth: '1080px',
              textAlign: 'center',
              margin: '0 auto'
            }}
          >
            Das sind wir
          </Interaction.Headline>
          <div {...styles.lead}>
            <Editorial.Lead>
              Die Republik ist ein digitales Magazin für Politik, Wirtschaft,
              Gesellschaft und Kultur. Finanziert von seinen Leserinnen und
              Lesern. Gemeinsam sind wir eine Rebellion gegen die
              Medienkonzerne, für die Medienvielfalt. Unabhängig, werbefrei –
              und mit nur einem Ziel: begeisternden Journalismus zu liefern.
            </Editorial.Lead>
          </div>
        </div>
      </Container>
      <Center>
        <section {...styles.section}>
          <Subheader>{publishersCount} Verleger</Subheader>
          <P>
            Ein neues Geschäftsmodell für unabhängigen Journalismus schaffen wir
            nur gemeinsam – oder gar nicht. Deshalb gehört die Republik nicht
            nur uns Macherinnen, sondern auch ihren Lesern.{' '}
            <strong>
              Journalismus braucht ein aufmerksames, neugieriges und furchtloses
              Publikum, das bereit ist, in unabhängigen Journalismus zu
              investieren.
            </strong>{' '}
            Ohne ihre aktuell {publishersCount} Verlegerinnen wäre die Republik
            – nichts! Täglich kommen neue Unterstützer an Bord. Bald auch Sie?
          </P>
        </section>
        <section {...styles.section}>
          <Subheader>{documentsCount} Produktionen</Subheader>
          <P>
            Die Republik erscheint von Montag bis Samstag –{' '}
            <strong>auf der Website, als Newsletter, in der App.</strong> Und
            liefert Ihnen <strong>täglich ein bis drei Beiträge</strong> zu den
            wichtigsten Fragen der Gegenwart. Weniger, dafür besser: Das ist
            unser Anspruch. Und Sie besuchen uns, wann Sie wollen: täglich,
            wöchentlich, monatlich. Brisante Recherchen, erhellende Analysen und
            Debatten, unterhaltsame Essays. In Texten, Bildern, Podcasts,
            Videos, Grafiken – und live an Veranstaltungen.
          </P>
        </section>
        <section {...styles.section}>
          <Subheader>45 Macherinnen</Subheader>
          <P>
            Unsere Crew ist Ihr persönliches Expeditionsteam in die
            Wirklichkeit. Wir arbeiten uns durch den Staub der Welt, trennen
            Wichtiges von Unwichtigem – und liefern Ihnen in der verworrenen
            Gegenwart die bestmögliche Übersicht. Doch die Republik ist mehr als
            Ihre Redaktion. Vom Community- Team über die Marketing-Expertinnen
            bis zum Erste-Hilfe-Team.
          </P>
        </section>
        <section {...styles.section}>
          <Subheader2>Geschäftsbericht 2018–2019</Subheader2>
          <P {...styles.faqCta}>
            <a
              {...styles.link}
              href='https://cdn.republik.space/s3/republik-assets/assets/geschaeftsbericht/2018-2019.pdf'
            >
              Im zweiten Geschäftsjahr
            </a>{' '}
            eines Start-ups geht der adrenalingeladene Sprint der Gründungsphase
            über in den Marathon des Alltags. Die Republik erreichte in diesem
            Zeitraum einen Mitgliederfinanzierungsgrad von über 70 Prozent und
            fokussierte sich auf die Weiterentwicklung des journalistischen
            Kernprodukts.
          </P>
        </section>
        <section {...styles.section}>
          <Subheader2>Geschäftsbericht 2017–2018</Subheader2>
          <P {...styles.faqCta}>
            <a
              {...styles.link}
              href='https://cdn.republik.space/s3/republik-assets/assets/geschaeftsbericht/2017-2018.pdf'
            >
              Der erste Geschäftsbericht
            </a>{' '}
            beleuchtet die Periode zwischen Januar 2017 und Juni 2018. Also nur
            ein halbes Jahr der bisherigen Publikationstätigkeit der Republik.
            Anfang Januar 2017 hatten wir nicht mehr als 8 Leute, 3 Hotelzimmer
            und einen Plan. Ende Juni 2018 ein Unternehmen mit über 20’000
            Verlegerinnen und Verlegern.
          </P>
        </section>
        <section {...styles.section}>
          <Subheader2>Auszeichnungen & Nominierungen</Subheader2>
          <P {...styles.faqCta}>
            <a
              {...styles.link}
              href='https://www.reporter-forum.ch/reporterpreis-2020'
            >
              Schweizer Reporterpreis 2020 für die Serie «Die gefährlichste Frau
              der&nbsp;Schweiz?»
            </a>
          </P>
          <P {...styles.faqCta}>
            <a
              {...styles.link}
              href='https://swisspressaward.ch/de/user/c00029546/showcase/bj6/'
            >
              Swiss Press Award 2020 für den fünfteiligen Podcast «Zündstoff»
            </a>
          </P>
          <P {...styles.faqCta}>
            <a
              {...styles.link}
              href='https://www.grimme-online-award.de/2019/nominierte/'
            >
              Nominierung für «Grimme online award» Kategorie Information
            </a>
          </P>
          <P {...styles.faqCta}>
            <a
              {...styles.link}
              href='https://newspaper-congress.eu/wp-content/uploads/2019/04/European_Digital-Publishing-Award_2019_Winners2.pdf'
            >
              European Publishing Award: European Start-Up of the Year 2019
            </a>
          </P>
          <P {...styles.faqCta}>
            <a
              {...styles.link}
              href='https://www.reporter-forum.ch/reporterpreis-2019'
            >
              Schweizer Reporterpreis 2019 für die Serie «Das Kartell»
            </a>
          </P>
        </section>
        <section {...styles.section}>
          <Subheader2>Das sagen andere über uns</Subheader2>
          <Loader
            loading={loading}
            error={error}
            render={() => (
              <Fragment>
                {data.mediaResponses.map((mediaResponse, index) => (
                  <P {...styles.faqCta} key={index}>
                    {mediaResponse.medium}, {mediaResponse.publishDate}:<br />
                    <a {...styles.link} href={mediaResponse.url}>
                      {mediaResponse.title}
                    </a>
                  </P>
                ))}
              </Fragment>
            )}
          />
        </section>
        {employees && employees.length && (
          <Fragment>
            <Breakout size='breakout'>
              <div {...styles.tiles}>
                {employees.map((employee, index) => (
                  <Employee
                    {...employee}
                    title={employee.title || employee.group}
                    minColumns={3}
                    maxColumns={6}
                    key={index}
                  />
                ))}
              </div>
            </Breakout>
          </Fragment>
        )}
      </Center>
    </Fragment>
  )
}

export default compose(
  withT,
  graphql(query, {
    props: ({ data }) => {
      const { employees } = data
      return {
        data: {
          ...data,
          employees:
            employees &&
            employees
              .filter(
                (employee, index, all) =>
                  all.findIndex(e => e.name === employee.name) === index
              )
              .sort((a, b) => ascending(a.name, b.name))
        }
      }
    }
  })
)(AboutPage)
