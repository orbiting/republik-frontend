import React, { Component, Fragment } from 'react'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import { withSignOut } from '../Auth/SignOut'
import { intersperse } from '../../lib/utils/helpers'
import { Link, Router } from '../../lib/routes'
import withInNativeApp from '../../lib/withInNativeApp'
import { prefixHover } from '../../lib/utils/hover'

import {
  BrandMark,
  Container,
  Logo,
  mediaQueries,
  fontFamilies
} from '@project-r/styleguide'

import { negativeColors } from './constants'
import { ZINDEX_FOOTER } from '../constants'

import IconLink from '../IconLink'
import { shouldIgnoreClick } from '../Link/utils'

export { negativeColors } from './constants'

const COL_PADDING_S = 15
const COL_PADDING_M = 70

const styles = {
  bg: css({
    '@media print': {
      display: 'none !important'
    },
    position: 'relative',
    zIndex: ZINDEX_FOOTER, // goes over sidebar
    backgroundColor: negativeColors.primaryBg,
    paddingTop: 30,
    paddingBottom: 30,
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased'
  }),
  bgBlack: css({
    backgroundColor: '#000'
  }),
  grid: css({
    marginLeft: -COL_PADDING_S / 2,
    width: `calc(100% + ${COL_PADDING_S}px)`,
    [mediaQueries.mUp]: {
      marginLeft: -COL_PADDING_M / 2,
      width: `calc(100% + ${COL_PADDING_M}px)`
    },
    ':after': {
      content: '""',
      display: 'table',
      clear: 'both'
    }
  }),
  column: css({
    paddingLeft: COL_PADDING_S / 2,
    paddingRight: COL_PADDING_S / 2,
    marginBottom: 10,
    fontSize: 12,
    lineHeight: '18px',
    color: negativeColors.text,
    float: 'left',
    width: '50%',
    [mediaQueries.mUp]: {
      fontSize: 17,
      lineHeight: '25px',
      paddingLeft: COL_PADDING_M / 2,
      paddingRight: COL_PADDING_M / 2,
      width: '25%'
    },
    '& a': {
      fontFamily: fontFamilies.sansSerifRegular,
      textDecoration: 'none',
      color: negativeColors.text,
      ':visited': {
        color: negativeColors.text
      },
      [prefixHover()]: {
        color: negativeColors.lightText
      }
    }
  }),
  title: css({
    color: negativeColors.lightText,
    fontFamily: fontFamilies.sansSerifMedium
  }),
  hr: css({
    marginTop: 20,
    marginBottom: 20,
    border: 'none',
    borderBottom: `1px solid ${negativeColors.divider}`
  }),
  lastLine: css({
    textAlign: 'center',
    position: 'relative',
    height: 25,
    lineHeight: '24px'
  }),
  since: css({
    color: negativeColors.lightText,
    [mediaQueries.mUp]: {
      display: 'inline-block'
    }
  }),
  icons: css({
    position: 'absolute',
    bottom: 0,
    right: 0
  }),
  left: css({
    position: 'absolute',
    bottom: 0,
    left: 0
  }),
  logo: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'block'
    }
  }),
  brandmark: css({
    display: 'block',
    marginTop: '1px',
    width: '20px',
    [mediaQueries.mUp]: {
      display: 'none'
    }
  })
}

class Footer extends Component {
  render () {
    const { t, me, signOut, inNativeApp, inNativeIOSApp, black } = this.props
    return (
      <div {...merge(styles.bg, black && styles.bgBlack)}>
        <Container style={{ overflow: 'hidden' }}>
          {black && <hr {...styles.hr} />}
          <div {...styles.grid}>
            <div {...styles.column}>
              <div {...styles.title}>{t('footer/contact/title')}</div>
              {intersperse(t('footer/contact/name').split('\n'), (item, i) => (
                <br key={i} />
              ))}
              <br />
              <a
                href='https://www.google.ch/maps/place/Sihlhallenstrasse+1,+8004+Zürich'
                target='_blank'
                rel='noopener'
              >
                {intersperse(
                  t('footer/contact/address').split('\n'),
                  (item, i) => <br key={i} />
                )}
              </a>
              <br />
              <a href={`mailto:${t('footer/contact/mail')}`}>
                {t('footer/contact/mail')}
              </a>
            </div>
            <div {...styles.column}>
              <div {...styles.title}>{t('footer/about/title')}</div>
              <Link route='events'>
                <a>{t('footer/events')}</a>
              </Link>
              <br />
              <Link route='jobs'>
                <a>{t('footer/jobs')}</a>
              </Link>
              <br />
              <Link route='media'>
                <a>{t('footer/media')}</a>
              </Link>
              <br />
              <a href='/manifest' target={!inNativeApp ? '_blank' : undefined}>
                {t('footer/about/manifest')}
              </a>
              <br />
              <a href='/en' target={!inNativeApp ? '_blank' : undefined}>
                {t('footer/about/en')}
              </a>
              <br />
              <a href='https://project-r.construction/' rel='noopener' target='_blank'>
                {t('footer/about/projecR')}
              </a>
              <br />
              <Link route='researchBudget'>
                <a>{t('footer/researchBudget')}</a>
              </Link>
            </div>
            <div {...styles.column}>
              <div {...styles.title}>{t('footer/legal/title')}</div>
              <Link route='legal/tos'>
                <a>{t('footer/legal/tos')}</a>
              </Link>
              <br />
              <Link route='legal/privacy'>
                <a>{t('footer/legal/privacy')}</a>
              </Link>
              <br />
              <Link route='legal/statute'>
                <a>{t('footer/legal/statute')}</a>
              </Link>
              <br />
              <Link route='shareholder'>
                <a>{t('footer/shareholder')}</a>
              </Link>
              <br />
              <Link route='legal/imprint'>
                <a>{t('footer/legal/imprint')}</a>
              </Link>
            </div>
            <div {...styles.column}>
              <div {...styles.title}>{t('footer/me/title')}</div>
              <Link route='account'>
                <a>{t(me ? 'footer/me/signedIn' : 'footer/me/signIn')}</a>
              </Link>
              <br />
              {me && me.accessCampaigns.length > 0 &&
                <Fragment>
                  <a
                    href='/konto#teilen'
                    onClick={(e) => {
                      if (shouldIgnoreClick(e)) {
                        return
                      }

                      Router.pushRoute('/konto#teilen')
                    }}>
                    {t('footer/me/share')}
                  </a>
                  <br />
                </Fragment>
              }
              {!!me && <Fragment>
                <Link route='profile' params={{ slug: me.username || me.id }}>
                  <a>{t('footer/me/profile')}</a>
                </Link>
                <br />
              </Fragment>}
              {!inNativeIOSApp && (
                <Fragment>
                  <Link
                    route='pledge'
                    params={me ? { group: 'GIVE' } : undefined}>
                    <a>{t(me ? 'footer/me/give' : 'footer/offers')}</a>
                  </Link>
                  <br />
                </Fragment>
              )}
              <Link route='faq'>
                <a>{t('footer/me/faq')}</a>
              </Link>
              <br />
              <Link route='etiquette'>
                <a>{t('footer/me/etiquette')}</a>
              </Link>
              <br />
              {!!me && (
                <a
                  href='#'
                  onClick={e => {
                    e.preventDefault()
                    signOut()
                  }}
                >
                  {t('footer/me/signOut')}
                </a>
              )}
            </div>
          </div>
          <hr {...styles.hr} />
          <div {...styles.lastLine}>
            <Link route='index'>
              <a {...styles.logo} {...styles.left}>
                <Logo fill={negativeColors.text} height={20} />
              </a>
            </Link>
            <Link route='index'>
              <a {...styles.brandmark} {...styles.left}>
                <BrandMark fill={negativeColors.text} />
              </a>
            </Link>
            <span {...styles.since}>{t('footer/since')}</span>
            <div {...styles.icons}>
              <IconLink
                icon='facebook'
                href='https://www.facebook.com/RepublikMagazin'
                target='_blank'
                fill={negativeColors.text}
              />
              <IconLink
                icon='twitter'
                href='https://twitter.com/RepublikMagazin'
                target='_blank'
                fill={negativeColors.text}
              />
            </div>
          </div>
        </Container>
      </div>
    )
  }
}

export default compose(withT, withMe, withSignOut, withInNativeApp)(Footer)
