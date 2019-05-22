import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import {
  Container,
  RawHtml,
  mediaQueries,
  Interaction,
  Editorial
} from '@project-r/styleguide'

import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import { List as TestimonialList } from '../Testimonial/List'

import TeaserBlock from '../Overview/TeaserBlock'
import { getTeasersFromDocument } from '../Overview/utils'
import { A, P } from '../Overview/Elements'

import { buttonStyles, sharedStyles } from './styles'

import { negativeColors } from '../Frame/constants'

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
  articles: documents(feed: true, first: 0, template: "article") {
    totalCount
  }
  statements(first: 6) {
    totalCount
    nodes {
      id
      username
      name
      statement
      credentials {
        description
      }
      portrait
      updatedAt
      sequenceNumber
      hasPublicProfile
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`

const styles = {
  communityWidget: css({
    margin: '18px auto 0 auto',
    maxWidth: '974px',
    [mediaQueries.mUp]: {
      margin: '78px auto 0 auto'
    }
  })
}

const MarketingPage = ({ me, t, crowdfundingName, loading, data: { membershipStats, front, articles, statements }, ...props }) => {
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
          <div {...sharedStyles.signIn}>{
            t.elements(
              'marketing/signin',
              { link: <Link key='link' route={'signin'}>
                <a>{t('marketing/signin/link') }</a>
              </Link>
              }
            )
          }</div>
        </Container>
        {!loading && front && <div style={{
          backgroundColor: negativeColors.containerBg,
          color: negativeColors.text,
          padding: '30px 20px',
          paddingBottom: 0
        }}>
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
              {articles.totalCount} Produktionen
            </Interaction.H2>
            <P style={{
              maxWidth: 974,
              margin: '0 auto 30px auto',
              textAlign: 'center'
            }}>Die Republik erscheint von Montag bis Samstag – auf der Website, als Newsletter, in der App. Und liefert Ihnen täglich ein bis drei Beiträge zu den wichtigsten Fragen der Gegenwart.</P>
            <TeaserBlock
              teasers={getTeasersFromDocument(front)}
              highlight={undefined}
              onHighlight={() => {}}
              overflow
              lazy />
            <div style={{
              position: 'absolute',
              bottom: 0,
              height: 100,
              left: 0,
              right: 0,
              background: 'linear-gradient(0deg, rgba(17,17,17,0.9) 0%, rgba(17,17,17,0.8) 30%, rgba(17,17,17,0) 100%)',
              pointerEvents: 'none'
            }} />
            <P style={{
              textAlign: 'center',
              position: 'absolute',
              bottom: 10,
              left: '50%',
              width: 280,
              marginLeft: -140
            }}>
              Chronologie <Link route='overview' params={{ year: 2019 }} passHref><A>2019</A></Link>, <Link route='overview' params={{ year: 2018 }} passHref><A>2018</A></Link>
            </P>
          </Container>
        </div>}
      </div>
      <Container>
        {!loading && membershipStats && <div {...styles.communityWidget}>
          <Interaction.H2 style={{ marginBottom: 10 }}>
            {countFormat(membershipStats.count)} Verlegerinnen und Verleger
          </Interaction.H2>
          <TestimonialList
            singleRow
            minColumns={3}
            first={6}
            statements={statements.nodes}
            loading={loading}
            t={t}
            focus />
          <Interaction.P style={{ marginTop: 20 }}>
            <Link route='community' passHref>
              <Editorial.A>Weitere {statements.totalCount} Statements</Editorial.A>
            </Link>
          </Interaction.P>
        </div>}
        <div {...sharedStyles.spacer} />
      </Container>
    </Fragment>
  )
}

export default compose(
  withT,
  graphql(query, { options: { ssr: false } })
)(MarketingPage)
