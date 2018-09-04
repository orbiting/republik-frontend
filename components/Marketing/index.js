import React, { Fragment} from 'react'
import { Link } from '../../lib/routes'

import { css } from 'glamor'
import {
  Label,
  Container,
  P,
  RawHtml,
  colors,
  mediaQueries,
  fontFamilies
} from '@project-r/styleguide'

import withT from '../../lib/withT'

import CommunityWidget from './CommunityWidget'
import { buttonStyles } from './styles'

const styles = {
  headline: css({
    fontSize: '28px',
    lineHeight: '34px',
    maxWidth: '1002px',
    textAlign: 'center',
    margin: '0 auto',
    fontWeight: 'normal',
    fontFamily: fontFamilies.serifTitle,
    marginTop: '12px',
    [mediaQueries.mUp]: {
      fontSize: '64px',
      lineHeight: '72px',
      marginTop: '50px'
    }

  }),
  lead: css({
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'center',
    maxWidth: '702px',
    margin: '12px auto 0 auto',
    [mediaQueries.mUp]: {
      fontSize: '23px',
      lineHeight: '36px',
      marginTop: '32px'
    }
  }),
  actions: css({
    maxWidth: '974px',
    margin: '14px auto 0 auto',
    '& > *': {
      marginBottom: '9px',
      width: '100%'
    },
    [mediaQueries.mUp]: {
      marginTop: '80px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      '& > *': {
        margin: 0,
        width: '50%'
      },
      '& > *:first-child': {
        marginRight: '10px'
      },
      '& > *:last-child': {
        marginLeft: '10px'
      }
    }
  }),
  signInLabel: css({
    display: 'block',
    color: colors.text,
    '& a': {
      cursor: 'pointer',
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
  }),
  communityWidget: css({
    margin: '9px auto 0 auto',
    maxWidth: '974px',
    [mediaQueries.mUp]: {
      margin: '78px auto 0 auto'
    }
  }),
  spacer: css({
    minHeight: '23px',
    [mediaQueries.mUp]: {
      minHeight: '84px'
    }
  })
}

export default withT(({ me, t, crowdfundingName, data, ...props }) => {
  return (
    <Fragment>
      <Container>
        <h1 {...styles.headline}>
          <RawHtml
            dangerouslySetInnerHTML={{
              __html: t('marketing/cover/headline')
            }}
          />
        </h1>
        <P {...styles.lead}>Herzlich willkommen! Die Republik ist ein leserinnenfinanziertes Magazin für Politik, Wirtschaft, Gesellschaft und Kultur. Es wäre schön, Sie mit an Bord zu haben!</P>
        <div {...styles.actions}>
          <div>
            <Link route='pledge'>
              <button {...buttonStyles.primary}>
                {t('marketing/cover/button/label')}
              </button>
            </Link>
            <Label {...styles.signInLabel}>Sie haben schon ein Abo? <a>Jetzt anmelden</a></Label>
          </div>
          <Link route='preview'>
            <button {...buttonStyles.standard}>
              5 Artikel probelesen
            </button>
          </Link>
        </div>
        <div {...styles.communityWidget}>
          <CommunityWidget />
        </div>
        <div {...styles.spacer} />
      </Container>
    </Fragment>
  )
})
