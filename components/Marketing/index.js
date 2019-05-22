import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Container,
  RawHtml,
  Interaction,
  Editorial,
  Loader
} from '@project-r/styleguide'

import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import { intersperse } from '../../lib/utils/helpers'

import {
  List as TestimonialList,
  fragments as testimonialFragments
} from '../Testimonial/List'

import TeaserBlock from '../Overview/TeaserBlock'
import { getTeasersFromDocument } from '../Overview/utils'
import { A, P } from '../Overview/Elements'

import { buttonStyles, sharedStyles } from './styles'

import { negativeColors } from '../Frame/constants'
import ErrorMessage from '../ErrorMessage'

const query = gql`
query marketingMembershipStats {
  membershipStats {
    count
  }
  front: document(path: "/") {
    children(first: 60) {
      nodes {
        body
      }
    }
  }
  employees(shuffle: 6) {
    title
    group
    name
    user {
      ...TestimonialOnUser
    }
  }
  articles: documents(feed: true, first: 0, template: "article") {
    totalCount
  }
  statements(first: 6) {
    totalCount
    nodes {
      ...TestimonialOnUser
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
${testimonialFragments.TestimonialOnUser}
`

const SMALL_MAX_WIDTH = 974
const styles = {
  overviewContainer: css({
    backgroundColor: negativeColors.containerBg,
    color: negativeColors.text,
    padding: '30px 20px',
    paddingBottom: 0
  }),
  overviewBottomShadow: css({
    position: 'absolute',
    bottom: 0,
    height: 100,
    left: 0,
    right: 0,
    background: 'linear-gradient(0deg, rgba(17,17,17,0.9) 0%, rgba(17,17,17,0.8) 30%, rgba(17,17,17,0) 100%)',
    pointerEvents: 'none'
  }),
  overviewBottomLinks: css({
    textAlign: 'center',
    position: 'absolute',
    bottom: 10,
    left: '50%',
    width: 280,
    marginLeft: -140
  })
}

class MarketingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.onHighlight = highlight => this.setState({ highlight })
  }
  render () {
    const { t, data: { loading, error, membershipStats, front, articles, statements, employees } } = this.props

    return (
      <Fragment>
        <div style={{ overflow: 'hidden' }}>
          <Container>
            <h1 {...sharedStyles.headline}>
              <RawHtml
                dangerouslySetInnerHTML={{
                  __html: t('marketing/title')
                }}
              />
            </h1>
            <p {...sharedStyles.lead}>{t('marketing/lead')}</p>
            <div {...sharedStyles.actions}>
              <div>
                <Link route='pledge'>
                  <button {...buttonStyles.primary}>
                    {t('marketing/join/button/label')}
                  </button>
                </Link>
              </div>
              <Link route='preview'>
                <button {...buttonStyles.standard}>
                  {t('marketing/preview/button/label')}
                </button>
              </Link>
            </div>
            <div {...sharedStyles.signIn}>
              {t.elements(
                'marketing/signin',
                { link: <Link key='link' route={'signin'}>
                  <a>{t('marketing/signin/link') }</a>
                </Link>
                }
              )}
            </div>
            {error && <ErrorMessage error={error} style={{ textAlign: 'center' }} />}
          </Container>
          {!error && <div {...styles.overviewContainer}>
            <Container style={{
              maxWidth: 1200,
              padding: 0,
              position: 'relative'
            }}>
              <Interaction.H2 style={{
                color: negativeColors.text,
                marginTop: 0,
                marginBottom: 10,
                textAlign: 'center'
              }}>
                {t('marketing/overview/title', {
                  count: articles
                    ? countFormat(articles.totalCount)
                    : t('marketing/overview/defaultCount')
                })}
              </Interaction.H2>
              <P style={{
                maxWidth: SMALL_MAX_WIDTH,
                margin: '0 auto 30px auto',
                textAlign: 'center'
              }}>{t('marketing/overview/lead')}</P>
              <Loader loading={loading} style={{ minHeight: 600 }} render={() => (
                <TeaserBlock
                  teasers={getTeasersFromDocument(front)}
                  highlight={this.state.highlight}
                  onHighlight={this.onHighlight}
                  overflow
                  lazy />
              )} />
              <div {...styles.overviewBottomShadow} />
              <P {...styles.overviewBottomLinks}>
                {t.elements('marketing/overview/more', {
                  years: intersperse([2019, 2018].map(year =>
                    <Link key={year} route='overview' params={{ year }} passHref><A>{year}</A></Link>
                  ), () => ', ')
                })}
              </P>
            </Container>
          </div>}
        </div>
        {!error && <Container style={{ maxWidth: SMALL_MAX_WIDTH }}>
          <div {...sharedStyles.spacer} />
          <Interaction.H2 style={{ marginBottom: 10 }}>
            {t(
              'marketing/community/title',
              {
                count: membershipStats
                  ? countFormat(membershipStats.count)
                  : t('marketing/community/defaultCount')
              }
            )}
          </Interaction.H2>
          <TestimonialList
            singleRow
            minColumns={3}
            first={6}
            statements={statements && statements.nodes}
            loading={loading}
            t={t}
            focus />
          <Interaction.P style={{ marginTop: 10 }}>
            <Link route='community' passHref>
              <Editorial.A>
                {t('marketing/community/moreStatements', {
                  count: statements ? countFormat(statements.totalCount) : ''
                })}
              </Editorial.A>
            </Link>
          </Interaction.P>
          <div {...sharedStyles.spacer} />
          <Interaction.H2 style={{ marginBottom: 10 }}>
            {t('marketing/employees/title')}
          </Interaction.H2>
          <TestimonialList
            minColumns={3}
            first={6}
            showCredentials
            singleRow
            statements={employees && employees.map(employee => ({
              ...employee.user,
              name: employee.name,
              credentials: [
                {
                  description: employee.title || employee.group
                }
              ].filter(d => d.description)
            }))}
            loading={loading}
            t={t}
            focus />
          <Interaction.P style={{ marginTop: 10 }}>
            <Link route='legal/imprint' passHref>
              <Editorial.A>{t('marketing/employees/more')}</Editorial.A>
            </Link>
          </Interaction.P>
          <div {...sharedStyles.spacer} />
        </Container>}
      </Fragment>
    )
  }
}

export default compose(
  withT,
  graphql(query, { options: { ssr: false } })
)(MarketingPage)
