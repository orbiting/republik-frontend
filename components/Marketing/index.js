import React, { Fragment} from 'react'
import { Link } from '../../lib/routes'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { countFormat } from '../../lib/utils/format'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { css } from 'glamor'
import Cover from './Cover'
import Offers from './Offers'
import PreviewForm from './PreviewForm'

import { STATS_POLL_INTERVAL_MS } from '../../lib/constants'

import {
  Button,
  Container,
  Interaction,
  Loader,
  P,
  RawHtml,
  colors,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

const MAX_WIDTH = '1005px'

// TODO: revisit special font sizes with design.
const styles = {
  container: css({
    paddingBottom: 60,
    [mediaQueries.mUp]: {
      paddingBottom: 120
    }
  }),
  cta: css({
    '& > button': {
      display: 'block',
      margin: '20px auto 10px auto',
      maxWidth: '410px',
      width: '100%',
      [mediaQueries.mUp]: {
        margin: '30px auto 15px auto',
        maxWidth: '460px'
      }
    },
    marginBottom: 30,
    [mediaQueries.mUp]: {
      marginBottom: 60
    }
  }),
  intro: css({
    maxWidth: MAX_WIDTH,
    paddingTop: '30px',
    paddingBottom: '30px',
    [mediaQueries.mUp]: {
      paddingBottom: '60px',
      paddingTop: '60px'
    }
  }),
  text: css({
    fontSize: '16px',
    lineHeight: '26px',
    [mediaQueries.mUp]: {
      fontSize: '24px',
      lineHeight: '36px'
    }
  }),
  headline: css({
    fontSize: '28px',
    lineHeight: '34px',
    [mediaQueries.mUp]: {
      fontSize: '60px',
      lineHeight: '72px'
    }
  }),
  noMember: css({
    backgroundColor: colors.primaryBg,
    textAlign: 'center',
    padding: '18px 0',
    [mediaQueries.mUp]: {
      padding: '30px 0'
    }
  }),
  join: css({
    backgroundColor: colors.primaryBg,
    textAlign: 'center',
    padding: '18px 0',
    marginBottom: '30px',
    [mediaQueries.mUp]: {
      padding: '90px 0',
      marginBottom: '100px'
    }
  }),
  joinText: css({
    textAlign: 'left',
    margin: '20px 0 30px 0',
    [mediaQueries.mUp]: {
      margin: '40px 0 50px 0'
    }
  }),
  more: css({
    [mediaQueries.mUp]: {
      display: 'flex'
    }
  }),
  preview: css({
    marginBottom: '50px',
    [mediaQueries.mUp]: {
      marginRight: '30px',
      flex: 1
    }
  }),
  offers: css({
    [mediaQueries.mUp]: {
      width: '410px'
    }
  }),
  coverHeadline: css({
    color: '#fff',
    fontSize: '25px',
    lineHeight: '35px',
    [mediaQueries.mUp]: { fontSize: '36px', lineHeight: '48px' },
    [mediaQueries.lUp]: { fontSize: '54px', lineHeight: '68px' }
  })
}

const MarketingPage = ({ me, t, crowdfundingName, data }) => (
  <Fragment>
    <Cover image={{src: '/static/cover.jpg', srcMobile: '/static/cover_mobile.jpg'}}>
      <div {...styles.cta}>
        <Interaction.H1 {...styles.coverHeadline}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('marketing/cover/headline')
            }}
          />
        </Interaction.H1>
        <Link route='pledge' params={{package: 'ABO'}}>
          <Button primary>
            {t('marketing/cover/button/label')}
          </Button>
        </Link>
        <Interaction.P style={{color: '#fff', margin: '10px 0 20px 0'}}>
          {t('marketing/cover/button/caption')}
        </Interaction.P>
      </div>
    </Cover>
    <div {...styles.container}>
      {me && (
        <div {...styles.noMember}>
          <Container style={{ maxWidth: MAX_WIDTH }}>
            <Interaction.P>
              {t.elements('marketing/noActiveMembership', {
                link: (
                  <Link route='account' key='account'>
                    <a {...linkRule}>{t('marketing/noActiveMembership/link')}</a>
                  </Link>
                )
              })}
            </Interaction.P>
          </Container>
        </div>
      )}
      <Container {...styles.intro} key='intro'>
        <Loader error={data.error} loading={data.loading} style={{minHeight: 200}} render={() => (
          <P {...styles.text}>
            <RawHtml
              dangerouslySetInnerHTML={{
                __html: t('marketing/intro', {count: countFormat(data.membershipStats.count)})
              }}
          />
          </P>
      )} />
      </Container>
      <Container style={{ maxWidth: MAX_WIDTH }} key='more'>
        <div {...styles.more}>
          <div {...styles.preview}>
            <Interaction.H3 style={{ marginBottom: '17px' }}>
              {t('marketing/preview/title')}
            </Interaction.H3>
            <PreviewForm />
          </div>
          <div {...styles.offers}>
            <Interaction.H3 style={{ marginBottom: '17px' }}>
              {t('marketing/offers/title')}
            </Interaction.H3>
            <Offers crowdfundingName={crowdfundingName} />
          </div>
        </div>
      </Container>
    </div>
  </Fragment>
)

const query = gql`
query membershipStats {
  membershipStats {
    count
  }
}
`

export default compose(
  withMe,
  withT,
  graphql(query, {
    options: {
      pollInterval: STATS_POLL_INTERVAL_MS
    }
  })
)(MarketingPage)
