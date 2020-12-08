import React, { Component, Fragment } from 'react'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'
import { IoLogoFacebook, IoLogoTwitter } from 'react-icons/io'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import { withSignOut } from '../Auth/SignOut'
import { intersperse } from '../../lib/utils/helpers'
import { Link, Router } from '../../lib/routes'
import withInNativeApp from '../../lib/withInNativeApp'
import HrefLink from '../Link/Href'

import {
  BrandMark,
  Container,
  Logo,
  mediaQueries,
  fontFamilies,
  colors,
  IconButton
} from '@project-r/styleguide'

import { ZINDEX_FOOTER } from '../constants'

import { shouldIgnoreClick } from '../../lib/utils/link'

const LazyLink = props => <Link {...props} prefetch={false} />

const COL_PADDING_S = 15
const COL_PADDING_M = 70

const styles = {
  bg: css({
    '@media print': {
      display: 'none !important'
    },
    position: 'relative',
    zIndex: ZINDEX_FOOTER, // goes over sidebar
    backgroundColor: colors.negative.primaryBg,
    borderTop: `1px solid ${colors.negative.divider}`,
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
    color: colors.negative.text,
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
      color: colors.negative.text,
      ':visited': {
        color: colors.negative.text
      },
      '@media (hover)': {
        ':hover': {
          color: colors.negative.lightText
        }
      }
    }
  }),
  title: css({
    color: colors.negative.lightText,
    fontFamily: fontFamilies.sansSerifMedium
  }),
  hr: css({
    marginTop: 20,
    marginBottom: 20,
    border: 'none',
    borderBottom: `1px solid ${colors.negative.divider}`
  }),
  lastLine: css({
    textAlign: 'center',
    position: 'relative',
    height: 25,
    lineHeight: '24px'
  }),
  since: css({
    color: colors.negative.lightText,
    [mediaQueries.mUp]: {
      display: 'inline-block'
    }
  }),
  icons: css({
    position: 'absolute',
    bottom: 0,
    right: 0,
    display: 'flex'
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
  render() {
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
                  (item, i) => (
                    <br key={i} />
                  )
                )}
              </a>
              <br />
              <a href={`mailto:${t('footer/contact/mail')}`}>
                {t('footer/contact/mail')}
              </a>
              <br />
              <LazyLink route='media'>
                <a>{t('footer/media')}</a>
              </LazyLink>
            </div>
            <div {...styles.column}>
              <div {...styles.title}>{t('footer/about/title')}</div>
              <LazyLink route='about'>
                <a>{t('footer/about')}</a>
              </LazyLink>
              <br />
              <HrefLink href='/jobs' passHref>
                <a href='/jobs'>{t('footer/jobs')}</a>
              </HrefLink>
              <br />
              <LazyLink route='community'>
                <a>{t('nav/community')}</a>
              </LazyLink>
              <br />
              <LazyLink route='events'>
                <a>{t('footer/events')}</a>
              </LazyLink>
              <br />
              <LazyLink route='cockpit'>
                <a>{t('nav/cockpit')}</a>
              </LazyLink>
              <br />
              <LazyLink route='section' params={{ slug: 'komplizin' }}>
                <a>Komplizen</a>
              </LazyLink>
              <br />
              <a href='/manifest' target={!inNativeApp ? '_blank' : undefined}>
                {t('footer/about/manifest')}
              </a>
              <br />
              <a
                href='https://project-r.construction/'
                rel='noopener'
                target='_blank'
              >
                {t('footer/about/projecR')}
              </a>
              {/*
                <br />
                <a href='/etat'>{t('footer/researchBudget')}</a>
              */}
            </div>
            <div {...styles.column}>
              <div {...styles.title}>{t('footer/legal/title')}</div>
              <LazyLink route='legal/tos'>
                <a>{t('footer/legal/tos')}</a>
              </LazyLink>
              <br />
              <LazyLink route='legal/privacy'>
                <a>{t('footer/legal/privacy')}</a>
              </LazyLink>
              <br />
              <LazyLink route='legal/statute'>
                <a>{t('footer/legal/statute')}</a>
              </LazyLink>
              <br />
              <LazyLink route='shareholder'>
                <a>{t('footer/shareholder')}</a>
              </LazyLink>
              <br />
              <LazyLink route='legal/imprint'>
                <a>{t('footer/legal/imprint')}</a>
              </LazyLink>
            </div>
            <div {...styles.column}>
              <div {...styles.title}>{t('footer/me/title')}</div>
              <LazyLink route='account'>
                <a>{t(me ? 'footer/me/signedIn' : 'footer/me/signIn')}</a>
              </LazyLink>
              <br />
              {me && me.accessCampaigns.length > 0 && (
                <Fragment>
                  <a
                    href='/teilen'
                    onClick={e => {
                      if (shouldIgnoreClick(e)) {
                        return
                      }

                      Router.pushRoute('/teilen')
                    }}
                  >
                    {t('footer/me/share')}
                  </a>
                  <br />
                </Fragment>
              )}
              {!!me && (
                <Fragment>
                  <LazyLink
                    route='profile'
                    params={{ slug: me.username || me.id }}
                  >
                    <a>{t('footer/me/profile')}</a>
                  </LazyLink>
                  <br />
                </Fragment>
              )}
              {!inNativeIOSApp && (
                <Fragment>
                  <LazyLink
                    route='pledge'
                    params={me ? { group: 'GIVE' } : undefined}
                  >
                    <a>{t(me ? 'footer/me/give' : 'footer/offers')}</a>
                  </LazyLink>
                  <br />
                </Fragment>
              )}
              <Fragment>
                <LazyLink route='claim'>
                  <a>{t('footer/me/claim')}</a>
                </LazyLink>
                <br />
              </Fragment>
              <LazyLink route='faq'>
                <a>{t('footer/me/faq')}</a>
              </LazyLink>
              <br />
              <LazyLink route='section' params={{ slug: 'etikette' }}>
                <a>{t('footer/me/etiquette')}</a>
              </LazyLink>
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
            <LazyLink route='index'>
              <a {...styles.logo} {...styles.left}>
                <Logo fill={colors.negative.text} height={20} />
              </a>
            </LazyLink>
            <LazyLink route='index'>
              <a {...styles.brandmark} {...styles.left}>
                <BrandMark fill={colors.negative.text} />
              </a>
            </LazyLink>
            <span {...styles.since}>{t('footer/since')}</span>
            <div {...styles.icons}>
              <IconButton
                Icon={IoLogoFacebook}
                href='https://www.facebook.com/RepublikMagazin'
                target='_blank'
                fill={colors.negative.text}
              />
              <IconButton
                Icon={IoLogoTwitter}
                href='https://twitter.com/RepublikMagazin'
                target='_blank'
                fill={colors.negative.text}
              />
            </div>
          </div>
        </Container>
      </div>
    )
  }
}

export default compose(withT, withMe, withSignOut, withInNativeApp)(Footer)
