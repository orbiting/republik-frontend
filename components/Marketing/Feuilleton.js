import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Center,
  Container,
  Editorial,
  Interaction,
  Label,
  P,
  PullQuote,
  PullQuoteText,
  PullQuoteSource,
  RawHtml,
  colors,
  mediaQueries
} from '@project-r/styleguide'

import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'
import { Link, Router } from '../../lib/routes'

import Employee from '../Imprint/Employee'
import FaqList from '../Faq/List'

import { ListWithQuery } from '../Testimonial/List'

import { buttonStyles, sharedStyles } from './styles'

const query = gql`
query marketingMembershipStats {
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
}
`

const styles = {
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
  })
}

const authorNames = [
  'Barbara Villiger Heilig',
  'Daniel Binswanger',
  'Daniel Graf'
]

const faqSlugFilter = [
  'ich-bin-interessiert-an-der-republik-gibt-es-ein-probe-abonnement',
  'gibt-es-studentinnen-oder-rentnerabonnemente',
  'kann-ich-die-republik-auf-mehreren-geräten-lesen',
  'wie-logge-ich-mich-ein-brauche-ich-ein-passwort',
  'ich-muss-mich-jeden-tag-neu-anmelden-wie-kann-ich-das-ändern',
  'ich-habe-einen-input-für-ein-thema-über-welches-ich-gern-in-der-republik-lesen-würde'
]

const Subheader = ({ children }) => (
  <Interaction.H2 {...styles.subheader}>{children}</Interaction.H2>
)

const QuoteContainer = ({ children }) => (
  <div {...styles.quote}>{children}</div>
)

const FeuilletonMarketingPage = ({
  me,
  t,
  crowdfundingName,
  loading,
  data: { membershipStats, employees },
  ...props
}) => {
  const filteredEmployees = employees
    ? employees.filter(employee => authorNames.indexOf(employee.name) !== -1)
    : []

  return (
    <Fragment>
      <Container>
        <h1 {...sharedStyles.headline} style={{ maxWidth: '1080px' }}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('marketing/feuilleton/title')
            }}
          />
        </h1>
        <P {...sharedStyles.lead} style={{ maxWidth: '800px' }}>
          {t('marketing/feuilleton/lead')}
        </P>
        <div {...sharedStyles.actions} style={{ maxWidth: '1005px' }}>
          <div>
            <Link route='pledge'>
              <button {...buttonStyles.primary}>
                {t('marketing/join/button/label')}
              </button>
            </Link>
            <Label {...sharedStyles.signInLabel}>{
              t.elements(
                'marketing/signin',
                { link: <Link key='link' route={'signin'}>
                  <a>{t('marketing/signin/link') }</a>
                </Link>
                }
              )
            }</Label>
          </div>
          <Link route='preview'>
            <button {...buttonStyles.standard}>
              {t('marketing/preview/button/label')}
            </button>
          </Link>
        </div>
      </Container>
      <Center>
        <Subheader>{t('marketing/feuilleton/what/title')}</Subheader>
        <Editorial.P>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('marketing/feuilleton/what/text')
            }}
          />
        </Editorial.P>
        <QuoteContainer>
          <PullQuote {...styles.pullQuoteText}>
            <Editorial.Format {...styles.format}>
              {t('marketing/feuilleton/what/quote/format')}
            </Editorial.Format>
            <PullQuoteText size='large'>
              {t('marketing/feuilleton/what/quote/text')}
            </PullQuoteText>
            <PullQuoteSource>
              {t('marketing/feuilleton/what/quote/source')}
            </PullQuoteSource>
          </PullQuote>
        </QuoteContainer>
        <Subheader>{t('marketing/feuilleton/why/title')}</Subheader>
        <Editorial.P>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('marketing/feuilleton/why/text')
            }}
          />
        </Editorial.P>
        <QuoteContainer>
          <PullQuote {...styles.pullQuoteText}>
            <Editorial.Format {...styles.format}>
              {t('marketing/feuilleton/why/quote/format')}
            </Editorial.Format>
            <PullQuoteText size='large'>
              {t('marketing/feuilleton/why/quote/text')}
            </PullQuoteText>
            <PullQuoteSource>
              {t('marketing/feuilleton/why/quote/source')}
            </PullQuoteSource>
          </PullQuote>
        </QuoteContainer>
        <Subheader>{t('marketing/feuilleton/audience/title')}</Subheader>
        <Editorial.P>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('marketing/feuilleton/audience/text')
            }}
          />
        </Editorial.P>
        <Subheader>{t('marketing/feuilleton/who/title')}</Subheader>
        {filteredEmployees.length && <div {...styles.employees}>
          {filteredEmployees.filter(
            employee =>
              authorNames.indexOf(employee.name) !== -1
          )
            .map((employee, index) => (
              <Employee
                {...employee}
                singleRow
                key={index}
                style={{ width: `${100 / filteredEmployees.length}%` }}
              />
            )
            )}
        </div>
        }
        <Editorial.P>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('marketing/feuilleton/who/text')
            }}
          />
        </Editorial.P>
        <QuoteContainer>
          <PullQuote {...styles.pullQuoteText}>
            <Editorial.Format {...styles.format}>
              {t('marketing/feuilleton/who/quote/format')}
            </Editorial.Format>
            <PullQuoteText size='large'>
              {t('marketing/feuilleton/who/quote/text')}
            </PullQuoteText>
            <PullQuoteSource>
              {t('marketing/feuilleton/who/quote/source')}
            </PullQuoteSource>
          </PullQuote>
        </QuoteContainer>
      </Center>
      <Container>
        {!loading && membershipStats && <div {...styles.communityWidget}>
          <Interaction.H2 {...sharedStyles.communityHeadline}>
            {t(
              'marketing/community/title',
              { count: countFormat(membershipStats.count) }
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
        </div>}
      </Container>
      <Center style={{ marginBottom: 80 }}>
        <Interaction.H3 {...styles.faqHeader}>{t('marketing/feuilleton/faq/title')}</Interaction.H3>
        <FaqList filter={faqSlugFilter} />
        <Interaction.P {...styles.faqCta}>
          <Link route='faq'>
            <a {...styles.link}>{t('marketing/feuilleton/faq/link')}</a>
          </Link>
        </Interaction.P>
      </Center>
    </Fragment>
  )
}

export default compose(
  withT,
  graphql(query)
)(FeuilletonMarketingPage)
