import React, { Component } from 'react'
import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'
import { Router } from '../../lib/routes'

import {
  ELECTION_STATS_POLL_INTERVAL
} from '../../lib/constants'

import {
  fontStyles,
  fontFamilies,
  colors,
  Button,
  mediaQueries,
  Editorial,
  TeaserFrontTileRow,
  TeaserFrontTile,
  TeaserFrontTileHeadline,
  TeaserFrontLead
} from '@project-r/styleguide'
import { countFormat } from '../../lib/utils/format'
import withT from '../../lib/withT'

const styles = {
  number: css({
    fontFamily: fontFamilies.sansSerifMedium,
    whiteSpace: 'nowrap',
    lineHeight: '96px',
    fontSize: 80,
    [mediaQueries.lUp]: {
      lineHeight: '140px',
      fontSize: 116
    }
  }),
  lead: css({
    ...fontStyles.sansSerifRegular23
  }),
  big: css({
    fontFamily: fontFamilies.sansSerifMedium,
    lineHeight: '44px',
    fontSize: 38,
    padding: '0 5%',
    marginBottom: 28,
    [mediaQueries.lUp]: {
      marginBottom: 35,
      lineHeight: '72px',
      fontSize: 64
    }
  })
}

const ThankYouTile = ({ t }) =>
  <TeaserFrontTile color='#000' bgColor='#fff'>
    <Editorial.Format>{t('questionnaire/title')}</Editorial.Format>
    <TeaserFrontTileHeadline.Interaction>
      <div {...styles.big}>
        {t('pages/meta/questionnaire/thankyou')}
      </div>
    </TeaserFrontTileHeadline.Interaction>
  </TeaserFrontTile>

const SignupTile = ({ t }) =>
  <TeaserFrontTile color={colors.primary} bgColor='#fff'>
    <Editorial.Format>{t('questionnaire/title')}</Editorial.Format>
    <TeaserFrontTileHeadline.Interaction>
      <div {...styles.big}>
        {t('pages/meta/questionnaire/actionTitle')}
      </div>
    </TeaserFrontTileHeadline.Interaction>
    <TeaserFrontLead>
      <Button
        primary
        onClick={
          () => Router
            .pushRoute('/umfrage/2018')
            .then(() => window.scrollTo(0, 0))
        }
      >
        {t('pages/meta/questionnaire/actionLabel')}
      </Button>
    </TeaserFrontLead>
  </TeaserFrontTile>

class MetaWidget extends Component {
  render () {
    const { data, t } = this.props
    return (
      <Loader loading={data.loading} error={data.error} render={() => {
        const { questionnaire: { userHasSubmitted, turnout: { submitted } } } = data

        return (
          <TeaserFrontTileRow columns={2}>
            {userHasSubmitted
              ? <ThankYouTile t={t} />
              : <SignupTile t={t} />

            }
            <TeaserFrontTile color={colors.text} bgColor='#fff'>
              <TeaserFrontTileHeadline.Interaction>
                <div {...styles.number}>{countFormat(submitted)}</div>
              </TeaserFrontTileHeadline.Interaction>
              <TeaserFrontLead>
                <div {...styles.lead}>{t('pages/meta/questionnaire/counterText')}</div>
              </TeaserFrontLead>
            </TeaserFrontTile>
          </TeaserFrontTileRow>
        )
      }} />
    )
  }
}

const query = gql`
{
  questionnaire(slug: "2018") {
    id
    userHasSubmitted
    turnout {
      submitted
    }
  }
}
`

export default compose(
  withT,
  graphql(query, {
    options: {
      pollInterval: ELECTION_STATS_POLL_INTERVAL
    }
  })
)(MetaWidget)
