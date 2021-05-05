import React from 'react'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon
} from '@project-r/styleguide/icons'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import { withSignOut } from '../Auth/SignOut'
import { intersperse } from '../../lib/utils/helpers'
import withInNativeApp from '../../lib/withInNativeApp'

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
import Link from 'next/link'
import { useRouter } from 'next/router'

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
    ['@media (min-width: 500px)']: {
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
    left: 0,
    lineHeight: '18px'
  }),
  brandmark: css({
    width: 23
  }),
  sOnly: css({
    display: 'block',
    [mediaQueries.mUp]: {
      display: 'none'
    }
  }),
  mUpOnly: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'block'
    }
  })
}

const Footer = ({
  t,
  me,
  signOut,
  inNativeApp,
  inNativeIOSApp,
  black,
  isOnMarketingPage
}) => {
  const router = useRouter()
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
            {intersperse(t('footer/contact/address').split('\n'), (item, i) => (
              <br key={i} />
            ))}
            <br />
            <a href={`mailto:${t('footer/contact/mail')}`}>
              {t('footer/contact/mail')}
            </a>
            <br />
            <LazyLink href='/medien'>
              <a>{t('footer/media')}</a>
            </LazyLink>
          </div>
          <div {...styles.column}>
            <div {...styles.title}>{t('footer/about/title')}</div>
            <LazyLink href='/about'>
              <a>{t('footer/about')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/jobs'>
              <a>{t('footer/jobs')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/community'>
              <a>{t('nav/community')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/veranstaltungen'>
              <a>{t('footer/events')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/cockpit'>
              <a>{t('nav/cockpit')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/komplizin'>
              <a>Komplizen</a>
            </LazyLink>
            <br />
            <LazyLink
              href='/manifest'
              target={!inNativeApp ? '_blank' : undefined}
            >
              {t('footer/about/manifest')}
            </LazyLink>
            <br />
            <a
              href='https://project-r.construction/'
              rel='noopener'
              target='_blank'
            >
              {t('footer/about/projecR')}
            </a>
          </div>
          <div {...styles.column}>
            <div {...styles.title}>{t('footer/legal/title')}</div>
            <LazyLink href='/agb'>
              <a>{t('footer/legal/tos')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/datenschutz'>
              <a>{t('footer/legal/privacy')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/statuten'>
              <a>{t('footer/legal/statute')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/aktionariat'>
              <a>{t('footer/shareholder')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/impressum'>
              <a>{t('footer/legal/imprint')}</a>
            </LazyLink>
          </div>
          <div {...styles.column}>
            <div {...styles.title}>{t('footer/me/title')}</div>
            <LazyLink href='/konto'>
              <a>{t(me ? 'footer/me/signedIn' : 'footer/me/signIn')}</a>
            </LazyLink>
            <br />
            {me && me.accessCampaigns.length > 0 && (
              <>
                <a
                  href='/teilen'
                  onClick={e => {
                    if (shouldIgnoreClick(e)) {
                      return
                    }

                    router.push('/teilen')
                  }}
                >
                  {t('footer/me/share')}
                </a>
                <br />
              </>
            )}
            {!!me && (
              <>
                <LazyLink href={`/~${me.username || me.id}`}>
                  <a>{t('footer/me/profile')}</a>
                </LazyLink>
                <br />
              </>
            )}
            {!inNativeIOSApp && (
              <>
                <LazyLink
                  href='/angebote'
                  params={{ group: me ? 'GIVE' : undefined }}
                >
                  <a>{t(me ? 'footer/me/give' : 'footer/offers')}</a>
                </LazyLink>
                <br />
              </>
            )}
            <LazyLink href='/abholen'>
              <a>{t('footer/me/claim')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/faq'>
              <a>{t('footer/me/faq')}</a>
            </LazyLink>
            <br />
            <LazyLink href='/etikette'>
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
          <LazyLink href='/'>
            <a {...(isOnMarketingPage && styles.brandmark)} {...styles.left}>
              {isOnMarketingPage ? (
                <BrandMark fill={colors.negative.text} />
              ) : (
                <Logo fill={colors.negative.text} height={20} />
              )}
            </a>
          </LazyLink>
          <span {...styles.since} {...styles.mUpOnly}>
            {t('footer/since')}
          </span>
          <div {...styles.icons}>
            <IconButton
              Icon={InstagramIcon}
              href='https://www.instagram.com/republikmagazin/'
              target='_blank'
              fill={colors.negative.text}
            />
            <IconButton
              Icon={FacebookIcon}
              href='https://www.facebook.com/RepublikMagazin'
              target='_blank'
              fill={colors.negative.text}
            />
            <IconButton
              Icon={TwitterIcon}
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

export default compose(withT, withMe, withSignOut, withInNativeApp)(Footer)
