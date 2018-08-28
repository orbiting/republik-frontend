import React, { Fragment} from 'react'
// import { Link } from '../../lib/routes'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { css, merge } from 'glamor'
import {
  Label,
  Container,
  Interaction,
  P,
  RawHtml,
  colors,
  mediaQueries,
  fontFamilies
} from '@project-r/styleguide'

import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import { STATS_POLL_INTERVAL_MS } from '../../lib/constants'

import CommunityWidget from './CommunityWidget'

// TODO: revisit special font sizes with design.

const buttonStyle = css({
  [mediaQueries.onlyS]: {
    padding: '8px 15px 8px 15px',
    fontSize: '16px',
    lineHeight: '25px',
    height: 50
  },
  width: '100%',
  outline: 'none',
  verticalAlign: 'bottom',
  minWidth: 160,
  textAlign: 'center',
  textDecoration: 'none',
  fontSize: 22,
  height: 60,
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  fontFamily: fontFamilies.sansSerifRegular,
  border: `1px solid ${colors.secondary}`,
  borderRadius: 0,
  color: colors.secondary,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: '#fff'
  },
  ':active': {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    color: '#fff'
  },
  ':disabled, [disabled]': {
    backgroundColor: '#fff',
    color: colors.disabled,
    borderColor: colors.disabled,
    cursor: 'default'
  }
})

const primaryStyle = css({
  backgroundColor: colors.primary,
  borderColor: colors.primary,
  color: '#fff',
  ':hover': {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary
  },
  ':active': {
    backgroundColor: '#000',
    borderColor: '#000',
    color: '#fff'
  }
})

const styles = {
  lead: css({
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'center',
    maxWidth: '702px',
    margin: '0 auto',
    [mediaQueries.mUp]: {
      fontSize: '23px',
      lineHeight: '36px'
    }
  }),
  headline: css({
    fontSize: '28px',
    lineHeight: '34px',
    maxWidth: '1002px',
    textAlign: 'center',
    margin: '0 auto',
    fontFamily: fontFamilies.sansSerifRegular,
    [mediaQueries.mUp]: {
      fontSize: '64px',
      lineHeight: '72px'
    }
  }),
  actions: css({
    maxWidth: '980px',
    margin: '0 auto',
    [mediaQueries.mUp]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      '& > *:first-child': {
        marginRight: '10px',
        width: '50%'
      },
      '& > *:last-child': {
        marginLeft: '10px',
        width: '50%'
      }
    }
  }),
  signInLabel: css({
    display: 'block',
    cursor: 'pointer',
    color: colors.text,
    '& a': {
      textDecoration: 'underline'
    },
    '& a:hover': {
      color: colors.secondary
    },
    '& a:focus': {
      color: colors.secondary
    },
    '& a:active': {
      color: colors.primary
    },
    fontSize: '12px',
    lineHeight: '18px',
    [mediaQueries.mUp]: {
      marginTop: '4px',
      fontSize: '16px',
      lineHeight: '24px'
    }
  })

}

const MarketingPage = ({ me, t, crowdfundingName, data }) => (
  <Fragment>
    <Container>
      <Interaction.H1 {...styles.headline}>
        <RawHtml
          dangerouslySetInnerHTML={{
            __html: t('marketing/cover/headline')
          }}
        />
      </Interaction.H1>
      <P {...styles.lead}>Herzlich willkommen! Die Republik ist ein leserinnenfinanziertes Magazin für Politik, Wirtschaft, Gesellschaft und Kultur. Es wäre schön, Sie mit an Bord zu haben!</P>
      <div {...styles.actions}>
        <div>
          <button {...merge(buttonStyle, primaryStyle)}>
            {t('marketing/cover/button/label')}
          </button>
          <Label {...styles.signInLabel}>Sie haben schon ein Abo? <a>Jetzt anmelden</a></Label>
        </div>
        <button {...buttonStyle}>
          5 Artikel probelesen
        </button>
      </div>
      <div>
        <CommunityWidget />
      </div>
    </Container>
  </Fragment>
)

const query = gql`
query memberStats {
  memberStats {
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
