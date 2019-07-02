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
  data: { membershipStats, documents, employees, mediaResponses, loading, error }
}) => {
  const publishersCount = membershipStats
    ? countFormat(membershipStats.count)
    : `~${countFormat(18000)}`
  const employeesCount = (employees && employees.length) || '~60'
  const documentsCount = (documents && documents.totalCount) || 'Über 1000'

  return (
    <Fragment>
      <Container>
        <div {...styles.titleBlock}>
          <Interaction.Headline style={{ maxWidth: '1080px', textAlign: 'center', margin: '0 auto' }}>
            {t('pages/about/title')}
          </Interaction.Headline>
          <div {...styles.lead}>
            <Editorial.Lead>
              {t('pages/about/lead')}
            </Editorial.Lead>
          </div>
        </div>
      </Container>
      <Center>
        {/* TK: Revive Audience once we settled on an KPI */}
        {/* <section {...styles.section}>
          <Subheader>{t('pages/about/audience/title', { count: countFormat(200000) })}</Subheader>
          <P>
            {t.elements('pages/about/audience/text', {
              emphasis1: <Emphasis>{t('pages/about/audience/text/emphasis1')}</Emphasis>
            })}
          </P>
        </section> */}
        <section {...styles.section}>
          <Subheader>{t('pages/about/publishers/title', { count: publishersCount })}</Subheader>
          <P>
            {t.elements('pages/about/publishers/text', {
              count: publishersCount,
              emphasis1: <Emphasis>{t('pages/about/publishers/text/emphasis1')}</Emphasis>
            })}
          </P>
        </section>
        <section {...styles.section}>
          <Subheader>{t('pages/about/output/title', { count: documentsCount })}</Subheader>
          <P>
            {t.elements('pages/about/output/text', {
              emphasis1: <Emphasis>{t('pages/about/output/text/emphasis1')}</Emphasis>,
              emphasis2: <Emphasis>{t('pages/about/output/text/emphasis2')}</Emphasis>
            })}
          </P>
        </section>
        <section {...styles.section}>
          <Subheader>{t('pages/about/employees/title', { count: employeesCount })}</Subheader>
          <P>
            <RawHtml
              dangerouslySetInnerHTML={{
                __html: t('pages/about/employees/text')
              }}
            />
          </P>
        </section>
        <section {...styles.section}>
          <Subheader2>Geschäftsbericht 2017–2018</Subheader2>
          <P {...styles.faqCta}>
            <a {...styles.link} href='https://cdn.republik.space/s3/republik-assets/assets/geschaeftsbericht2017_2018_fuer_gv_und_urabstimmung.pdf'>
              Der erste Geschäftsbericht
            </a>
            {' '}
            beleuchtet die Periode zwischen Januar 2017 und Juni 2018. Also nur ein halbes Jahr der bisherigen Publikationstätigkeit der Republik. Anfang Januar 2017 hatten wir nicht mehr als 8 Leute, 3 Hotelzimmer und einen Plan. Ende Juni 2018 ein Unternehmen mit über 20’000 Verlegerinnen und Verlegern und rund 50 Mitarbeitenden.
          </P>
        </section>
        <section {...styles.section}>
          <Subheader2>Auszeichnungen & Nominierungen</Subheader2>
          <P {...styles.faqCta}>
            <a {...styles.link} href='https://www.grimme-online-award.de/2019/nominierte/'>
              Nominierung für «Grimme online»
            </a><br />
            Kategorie Information
          </P>
          <P {...styles.faqCta}>
            <a {...styles.link} href='https://newspaper-congress.eu/european-digital-publishing-award/'>
              European Publishing Award
            </a><br />
            European Start-Up of the Year
          </P>
        </section>
        <section {...styles.section}>
          <Subheader2>{t('pages/about/mediaResponses/title')}</Subheader2>
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
        {employees && employees.length && <Fragment>
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
        </Fragment>}
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
          employees: employees && employees
            .filter((employee, index, all) => all.findIndex(e => e.name === employee.name) === index)
            .sort(
              (a, b) => ascending(a.name, b.name)
            )
        }
      }
    }
  })
)(AboutPage)
