import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Container,
  RawHtml,
  Interaction,
  Editorial,
  Loader,
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import { intersperse } from '../../lib/utils/helpers'

import {
  List as TestimonialList,
  testimonialFields
} from '../Testimonial/List'

import TeaserBlock from '../Overview/TeaserBlock'
import { getTeasersFromDocument } from '../Overview/utils'
import { A, P } from '../Overview/Elements'
import Accordion from '../Pledge/Accordion'
import Cards from './Cards'
import SignIn from '../Auth/SignIn'
import UserGuidance from '../Account/UserGuidance'

import { buttonStyles, sharedStyles } from './styles'

import { negativeColors } from '../Frame/constants'
import ErrorMessage from '../ErrorMessage'

const query = gql`
query marketingMembershipStats {
  me {
    id
    memberships {
      id
    }
    accessGrants {
      id
    }
  }
  membershipStats {
    count
  }
  front: document(path: "/") {
    children(first: 50) {
      nodes {
        body
      }
    }
  }
  articles: documents(feed: true, first: 0, template: "article") {
    totalCount
  }
  statements(first: 6) {
    totalCount
    nodes {
      ${testimonialFields}
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`

const MEDIUM_MAX_WIDTH = 974
const SMALL_MAX_WIDTH = 680

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
  }),
  title: css({
    ...fontStyles.serifTitle58,
    fontSize: 26,
    lineHeight: '32px',
    color: negativeColors.text,
    marginTop: 0,
    marginBottom: 30,
    textAlign: 'center',
    [mediaQueries.mUp]: {
      fontSize: 48,
      lineHeight: '54px',
      marginBottom: 50,
      marginTop: 30
    }
  }),
  h2: css({
    marginBottom: 10,
    textAlign: 'center',
    [mediaQueries.mUp]: {
      marginBottom: 30
    }
  }),
  split: css({
    [mediaQueries.mUp]: {
      display: 'flex'
    }
  }),
  preview: css({
    marginBottom: '50px',
    [mediaQueries.mUp]: {
      marginRight: '50px',
      flex: 1
    }
  }),
  offers: css({
    [mediaQueries.mUp]: {
      flex: 1
    }
  }),
  cards: css({
    margin: '30px 0',
    [mediaQueries.mUp]: {
      margin: '50px 0'
    }
  })
}

const Title = ({ children }) => <h1 {...styles.title}>{children}</h1>

class MarketingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.onHighlight = highlight => this.setState({ highlight })
  }
  render () {
    const { t, data: { loading, error, me, membershipStats, front, articles, statements } } = this.props

    const hasMembershipOrAccessGrant = me && (
      (me.memberships && me.memberships.length > 0) ||
      (me.accessGrants && me.accessGrants.length > 0)
    )

    return (
      <Fragment>
        {!loading && me && !hasMembershipOrAccessGrant && <UserGuidance />}
        <div style={{ overflow: 'hidden' }}>
          {!error && <div {...styles.overviewContainer}>
            <Container style={{
              maxWidth: 1200,
              padding: 0,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Title>
                <RawHtml
                  dangerouslySetInnerHTML={{
                    __html: t('marketing/v2/overview/title', {
                      count: articles
                        ? countFormat(articles.totalCount)
                        : t('marketing/v2/overview/defaultCount')
                    })
                  }}
                />
              </Title>
              <Loader loading={loading} style={{ minHeight: 600 }} render={() => (
                <TeaserBlock
                  teasers={getTeasersFromDocument(front)}
                  highlight={this.state.highlight}
                  onHighlight={this.onHighlight}
                  maxHeight={520}
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
          <Container>
            <div {...sharedStyles.actions}>
              <div>
                <Link route='pledge' params={{ package: 'ABO' }}>
                  <button {...buttonStyles.primary}>
                    {t('marketing/v2/join/button/label')}
                  </button>
                </Link>
              </div>
              <Link route='preview'>
                <button {...buttonStyles.standard}>
                  {t('marketing/v2/preview/button/label')}
                </button>
              </Link>
            </div>
            <div {...sharedStyles.signIn}>
              {t.elements(
                'marketing/signin',
                { link: <Link key='link' route={'signin'}>
                  <a>{t('marketing/v2/signin/link') }</a>
                </Link>
                }
              )}{' – '}
              {t.elements('marketing/claim', {
                claimLink: (
                  <Link route='claim' key='claim' passHref>
                    <Editorial.A>
                      {t('marketing/v2/claim/link')}
                    </Editorial.A>
                  </Link>
                )
              })}
            </div>
            {error && <ErrorMessage error={error} style={{ textAlign: 'center' }} />}
          </Container>
        </div>

        {!error && <Fragment>
          <Container style={{ maxWidth: SMALL_MAX_WIDTH }}>
            <Interaction.H2 {...styles.h2}>
              {t('marketing/v2/usp/title')}
            </Interaction.H2>
            <Editorial.P>
              <RawHtml
                dangerouslySetInnerHTML={{
                  __html: t('marketing/v2/usp/body')
                }}
              />
            </Editorial.P>
          </Container>

          <Container style={{ maxWidth: MEDIUM_MAX_WIDTH }}>
            <div {...sharedStyles.spacer} />
            <div {...styles.split}>
              <div {...styles.preview}>
                <Interaction.H3 style={{ marginBottom: '17px' }}>
                  {t('marketing/v2/preview/title')}
                </Interaction.H3>
                <Interaction.P>
                  {t('marketing/signup/lead')}
                </Interaction.P>
                <div {...styles.signUp}>
                  <SignIn label={t('marketing/signup/button/label')} context='preview' />
                </div>
              </div>
              <div {...styles.offers}>
                <Interaction.H3 style={{ marginBottom: '17px' }}>
                  {t('marketing/v2/offers/title')}
                </Interaction.H3>
                <Accordion crowdfundingName={'LAUNCH'} singleGroup={'ME'} />
              </div>
            </div>
          </Container>

          <Container style={{ maxWidth: SMALL_MAX_WIDTH }}>
            <div {...sharedStyles.spacer} />
            <Interaction.H2 {...styles.h2}>
              {t('marketing/v2/manifesto/title')}
            </Interaction.H2>
            <Editorial.P>
              <RawHtml
                dangerouslySetInnerHTML={{
                  __html: t('marketing/v2/manifesto/body')
                }}
              />
            </Editorial.P>
          </Container>

          <Container>
            <div {...sharedStyles.actions}>
              <div>
                <Link route='pledge' params={{ package: 'ABO' }}>
                  <button {...buttonStyles.primary}>
                    {t('marketing/v2/join/button/label')}
                  </button>
                </Link>
              </div>
              <Link route='pledge' params={{ package: 'MONTHLY_ABO' }}>
                <button {...buttonStyles.standard}>
                  {t('marketing/v2/monthly/button/label')}
                </button>
              </Link>
            </div>
          </Container>

          <Container style={{ maxWidth: SMALL_MAX_WIDTH }}>
            <div {...sharedStyles.spacer} />
            <Interaction.H2 {...styles.h2}>
              {t('marketing/v2/magazine/title')}
            </Interaction.H2>
            <Editorial.P>
              <RawHtml
                dangerouslySetInnerHTML={{
                  __html: t('marketing/v2/magazine/body1')
                }}
              />
            </Editorial.P>
          </Container>

          <div {...styles.cards}>
            <Cards />
          </div>

          <Container style={{ maxWidth: SMALL_MAX_WIDTH }}>
            <Editorial.P>
              <RawHtml
                dangerouslySetInnerHTML={{
                  __html: t('marketing/v2/magazine/body2')
                }}
              />
            </Editorial.P>
          </Container>

          <Container style={{ maxWidth: MEDIUM_MAX_WIDTH }}>
            <div {...sharedStyles.spacer} />
            <Interaction.H2 {...styles.h2}>
              {t(
                'marketing/v2/community/title',
                {
                  count: membershipStats
                    ? countFormat(membershipStats.count)
                    : t('marketing/v2/community/defaultCount')
                }
              )}
            </Interaction.H2>
            <TestimonialList
              singleRow
              minColumns={3}
              first={6}
              statements={statements && statements.nodes}
              loading={loading}
              t={t} />
            <Interaction.P style={{ marginTop: 10, textAlign: 'center' }}>
              <Link route='community' passHref>
                <Editorial.A>
                  {t('marketing/v2/community/moreStatements', {
                    count: statements ? countFormat(statements.totalCount) : ''
                  })}
                </Editorial.A>
              </Link>
            </Interaction.P>
            <div {...sharedStyles.spacer} />
          </Container>

          <div style={{ background: colors.secondaryBg }}>
            <Container style={{ maxWidth: MEDIUM_MAX_WIDTH }}>
              <div {...sharedStyles.spacer} />
              <Interaction.H2 {...styles.h2}>
                {t(
                  'marketing/v2/bottom/title',
                  {
                    count: membershipStats
                      ? countFormat(membershipStats.count + 1)
                      : t('marketing/v2/community/defaultCount')
                  }
                )}
              </Interaction.H2>
              <div {...sharedStyles.actions} style={{ marginTop: 0 }}>
                <div>
                  <Link route='pledge' params={{ package: 'ABO' }}>
                    <button {...buttonStyles.primary}>
                      {t('marketing/v2/bottom/join/button/label')}
                    </button>
                  </Link>
                </div>
                <Link route='preview'>
                  <button {...buttonStyles.standard}>
                    {t('marketing/v2/bottom/preview/button/label')}
                  </button>
                </Link>
              </div>
              <div {...sharedStyles.spacer} />
            </Container>
          </div>
        </Fragment>}
      </Fragment>
    )
  }
}

export default compose(
  withT,
  graphql(query, { options: { ssr: false } })
)(MarketingPage)
