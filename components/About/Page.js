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
      hasPublicProfile
      portrait
      username
    }
  }
  mediaResponses {
    medium
    publishDate
    title
    url
  }
  documents(feed: true, first: 1, template: "article") {
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
    : `~${countFormat(22500)}`
  const employeesCount = employees && employees.length
    ? employees.length
    : 60
  const documentsCount = documents && documents.totalCount

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
          <Subheader2>{t('pages/about/mediaResponses/title')}</Subheader2>
          <Loader
            loading={loading}
            error={error}
            render={() => (
              <Fragment>
                {data.mediaResponses.map((mediaResponse, index) => (
                  <P {...styles.faqCta} key={index}>
                    {mediaResponse.medium}, {mediaResponse.publishDate}:<br />
                    <a {...styles.link} href={mediaResponse.url} target='_blank'>{mediaResponse.title}</a>
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
            .filter(employee => !!employee.title /* && employee.title.match(/feuilleton/i) */)
            // .reduce((acc, curr) => !!acc.find(employee => employee.userId === curr.userId) ? acc : [...acc, curr], [])
            .sort(
              (a, b) => ascending(a.name, b.name)
            )
        }
      }
    }
  })
)(AboutPage)
