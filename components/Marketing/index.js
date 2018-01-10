import React from 'react'
import { Link } from '../../lib/routes'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'
import { css } from 'glamor'
import Offers from './Offers'
import PreviewForm from './PreviewForm'
import {
  Button,
  Container,
  Interaction,
  Loader,
  P,
  RawHtml,
  colors,
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
    marginBottom: 44,
    '& > button': {
      display: 'block',
      marginBottom: 20,
      width: '100%'
    },
    [mediaQueries.mUp]: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 90,
      '& > button': {
        width: '48%'
      }
    }
  }),
  intro: css({
    maxWidth: MAX_WIDTH,
    paddingTop: '44px',
    paddingBottom: '35px',
    [mediaQueries.mUp]: {
      paddingTop: '90px',
      paddingBottom: '90px'
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
  })
}

const MarketingPage = ({ t, crowdfundingName, data }) => (
  <div {...styles.container}>
    <Container {...styles.intro} key='intro'>
      <div {...styles.cta}>
        <Link route='anmelden'>
          <Button>
            {t('marketing/signin/button/label')}
          </Button>
        </Link>
        <Link route='pledge' params={{package: 'ABO'}}>
          <Button primary>
            {t('marketing/join/button/label')}
          </Button>
        </Link>
      </div>
      <Interaction.H1 {...css(styles.headline, { marginBottom: '30px', textAlign: 'center' })}>
        {t('marketing/headline')}
      </Interaction.H1>
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
    <div {...styles.join} key='join'>
      <Container style={{ maxWidth: MAX_WIDTH }}>
        <Interaction.P {...css(styles.headline, { marginBottom: '10px' })}>
          {t('marketing/cta/title')}
        </Interaction.P>
        <Interaction.H1 {...css(styles.headline, { color: colors.primary })}>
          {t('marketing/cta/subtitle')}
        </Interaction.H1>
        <Interaction.P {...css(styles.text, styles.joinText)}>
          {t('marketing/cta/text')}
        </Interaction.P>
        <Link route='pledge' params={{package: 'ABO'}}>
          <Button primary block>
            {t('marketing/cta/button/label')}
          </Button>
        </Link>
      </Container>
    </div>
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
)

const query = gql`
query membershipStats {
  membershipStats {
    count
  }
}
`

export default compose(
  withT,
  graphql(query)
)(MarketingPage)
