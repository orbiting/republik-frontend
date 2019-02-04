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
  P,
  RawHtml,
  colors,
  mediaQueries
} from '@project-r/styleguide'
import Loader from '../Loader'
import { ascending } from 'd3-array'

import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'
import { Link, Router } from '../../lib/routes'

import Employee from '../Imprint/Employee'

import { ListWithQuery } from '../Testimonial/List'

import { sharedStyles } from '../Marketing/styles'

const query = gql`
query feuilletonMarketingPage {
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
  documents(template: "article", first: 1) {
    totalCount
  }
}
`

const styles = {
  titleBlock: css({
    margin: '23px auto 23px auto',
    [mediaQueries.mUp]: {
      marginBottom: 80
    }
  }),
  subheader: css({
    marginBottom: 20,
    textAlign: 'center',
    [mediaQueries.lUp]: {
      marginBottom: 30
    }
  }),
  format: css({
    color: colors.feuilleton
  }),
  quote: css({
    textAlign: 'center',
    margin: '50px 0',
    [mediaQueries.lUp]: {
      margin: '80px 0'
    }
  }),
  employees: css({
    display: 'flex',
    margin: '0 auto',
    maxWidth: '473px'
  }),
  communityWidget: css({
    margin: '50px auto',
    maxWidth: '974px',
    [mediaQueries.mUp]: {
      margin: '0 auto 80px auto'
    }
  }),
  faqHeader: css({
    marginBottom: 10,
    [mediaQueries.lUp]: {
      marginBottom: 20
    }
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
    flexDirection: 'row'
  })
}

const Subheader = ({ children }) => (
  <Interaction.H2 {...styles.subheader}>{children}</Interaction.H2>
)

const FeuilletonMarketingPage = ({
  t,
  data,
  data: { membershipStats, documents, employees, mediaResponses, loading, error }
}) => {
  return (
    <Fragment>
      <Container>
        <div {...styles.titleBlock}>
          <Interaction.H1 {...sharedStyles.headline} style={{ maxWidth: '1080px' }}>
            {documents && documents.totalCount}
            <RawHtml
              dangerouslySetInnerHTML={{
                __html: t('about/title')
              }}
            />
          </Interaction.H1>
          <P {...sharedStyles.lead} style={{ maxWidth: '800px' }}>
            {t('about/lead')}
          </P>
        </div>
      </Container>
      <Center>
        <Subheader>{t('about/audience/title')}</Subheader>
        <Editorial.P>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('about/audience/text')
            }}
          />
        </Editorial.P>
        <Subheader>{t('about/publishers/title')}</Subheader>
        <Editorial.P>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('about/publishers/text')
            }}
          />
        </Editorial.P>
        <Subheader>{t('about/output/title')}</Subheader>
        <Editorial.P>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('about/output/text')
            }}
          />
        </Editorial.P>
        <Subheader>{t('about/values/title')}</Subheader>
        <Editorial.P>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('about/values/text')
            }}
          />
        </Editorial.P>
        <Subheader>{t('about/employees/title')}</Subheader>
        <Editorial.P>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('about/employees/text')
            }}
          />
        </Editorial.P>
        {employees && employees.length && <Fragment>
          <Breakout size='breakout'>
            <div {...styles.tiles}>
              {employees.map((employee, index) => (
                <Employee
                  {...employee}
                  minColumns={3}
                  maxColumns={6}
                  key={index}
                // style={{ width: `${100 / employees.length}%` }}
                />
              ))}
            </div>
          </Breakout>
        </Fragment>}
      </Center>
      <Container>
        <div {...styles.communityWidget}>
          <Interaction.H2 {...sharedStyles.communityHeadline}>
            {t(
              'marketing/community/title',
              {
                count: membershipStats
                  ? countFormat(membershipStats.count)
                  : `~${countFormat(22500)}`
              }
            )}
          </Interaction.H2>
          <ListWithQuery singleRow minColumns={3} first={6} onSelect={(id) => {
            Router.push(`/community?id=${id}`).then(() => {
              window.scrollTo(0, 0)
              return false
            })
          }} />
          <Interaction.P {...sharedStyles.communityLink}>
            <Link route='community'>
              <a>{t('marketing/community/link')}</a>
            </Link>
          </Interaction.P>
        </div>
      </Container>
      <Center style={{ marginBottom: 80 }}>
        <Interaction.H3 {...styles.faqHeader}>{t('about/mediaResponses/title')}</Interaction.H3>
        <Loader
          loading={loading}
          error={error}
          render={() => <>
            {data.mediaResponses.map((mediaResponse, index) => (
              <Editorial.P {...styles.faqCta} key={index}>
                {mediaResponse.medium}, {mediaResponse.publishDate}:<br />
                <a {...styles.link} href={mediaResponse.url} target='_blank'>{mediaResponse.title}</a>
              </Editorial.P>
            )
            )}
          </>}
        />
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
)(FeuilletonMarketingPage)
