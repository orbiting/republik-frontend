import React, { Fragment } from 'react'
import { css } from 'glamor'
import Head from 'next/head'
import isEmail from 'validator/lib/isEmail'

import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'
import withInNativeApp from '../lib/withInNativeApp'
import { intersperse } from '../lib/utils/helpers'
import { Link } from '../lib/routes'
import * as base64u from '../lib/utils/base64u'

import RawHtmlTranslation from '../components/RawHtmlTranslation'
import Me from '../components/Auth/Me'
import TokenAuthorization from '../components/Auth/TokenAuthorization'
import MacNewsletterSubscription from '../components/Auth/MacNewsletterSubscription'

import { MdClose } from 'react-icons/md'

import {
  DEFAULT_TOKEN_TYPE,
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  LOGO_WIDTH,
  LOGO_PADDING,
  LOGO_WIDTH_MOBILE,
  LOGO_PADDING_MOBILE
} from '../components/constants'

import { CURTAIN_MESSAGE, CDN_FRONTEND_BASE_URL } from '../lib/constants'

import {
  Interaction,
  NarrowContainer,
  Logo,
  linkRule,
  mediaQueries,
  colors,
  Button
} from '@project-r/styleguide'

const styles = {
  bar: css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    textAlign: 'center',
    height: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT
    },
    '@media print': {
      position: 'absolute',
      backgroundColor: 'transparent'
    },
    borderBottom: `1px solid ${colors.divider}`
  }),
  padHeader: css({
    // minus 1px for first sticky hr from header
    // - otherwise there is a jump when scroll 0 and opening hamburger
    paddingTop: HEADER_HEIGHT_MOBILE - 1,
    [mediaQueries.mUp]: {
      paddingTop: HEADER_HEIGHT - 1
    }
  }),
  close: css({
    position: 'fixed',
    right: 15,
    top: 5
  }),
  logoRepublik: css({
    position: 'relative',
    display: 'inline-block',
    padding: LOGO_PADDING_MOBILE,
    width: LOGO_WIDTH_MOBILE + LOGO_PADDING_MOBILE * 2,
    [mediaQueries.mUp]: {
      padding: LOGO_PADDING,
      width: LOGO_WIDTH + LOGO_PADDING * 2
    },
    verticalAlign: 'middle'
  }),
  logoProjectR: css({
    display: 'block',
    margin: '26px auto -16px',
    maxWidth: 520,
    textAlign: 'left'
  }),
  text: css({
    margin: '30px auto',
    maxWidth: 520,
    [mediaQueries.mUp]: {
      margin: '60px auto 120px'
    }
  }),
  link: css({
    marginTop: 20
  }),
  button: css({
    marginTop: 20
  }),
  me: css({
    marginTop: 80,
    marginBottom: 80
  })
}

const hasCurtain = !!CURTAIN_MESSAGE

const { H1, P } = Interaction

const fixAmpsInQuery = rawQuery => {
  let query = {}

  Object.keys(rawQuery).forEach(key => {
    query[key.replace(/^amp;/, '')] = rawQuery[key]
  })

  return query
}

const knownTypes = [
  'email-confirmed',
  'invalid-email',
  'invalid-token',
  // Deprecated (superseeded by "newsletter")
  'newsletter-subscription',
  // Deprecated (superseeded by "newsletter")
  // Workaround to handle "script" replacements in email clients
  'newsletter-subscript-disabledion',
  'newsletter',
  'session-denied',
  'token-authorization',
  'unavailable'
]

const Page = ({ router: { query: rawQuery }, t, me, inNativeApp }) => {
  const query = fixAmpsInQuery(rawQuery)
  const { context, token, tokenType, noAutoAuthorize } = query
  let { type, email } = query
  if (email !== undefined) {
    try {
      if (base64u.match(email)) {
        email = base64u.decode(email)
      }
    } catch (e) {}

    if (!isEmail(email)) {
      type = 'invalid-email'
      email = ''
    }
  }

  let isUnkownType = false
  let title = t.first(
    [`notifications/${type}/${context}/title`, `notifications/${type}/title`],
    undefined,
    ''
  )
  if (!title && !knownTypes.includes(type)) {
    title = t('notifications/unkown/title')
    isUnkownType = true
  }
  let logoTarget
  let content
  if (type === 'token-authorization') {
    logoTarget = '_blank'
    content = (
      <TokenAuthorization
        email={email}
        token={token}
        tokenType={tokenType || DEFAULT_TOKEN_TYPE}
        noAutoAuthorize={noAutoAuthorize}
        context={context}
      />
    )
  } else if (
    [
      // Deprecated (superseeded by "newsletter")
      'newsletter-subscription',
      // Deprecated (superseeded by "newsletter")
      // Workaround to handle "script" replacements in email clients
      'newsletter-subscript-disabledion',
      'newsletter'
    ].includes(type)
  ) {
    logoTarget = '_blank'
    content = (
      <MacNewsletterSubscription
        name={query.name}
        subscribed={!!query.subscribed}
        mac={query.mac}
        email={email}
        context={context}
      />
    )
  } else {
    const afterTokenAuth =
      type === 'email-confirmed' || type === 'session-denied'

    const displayCloseNote =
      !me || ['claim', 'preview', 'access'].includes(context)

    content = (
      <Fragment>
        <P>
          <RawHtmlTranslation
            first={[
              `notifications/${type}/${context}/text`,
              `notifications/${type}/text`
            ]}
            replacements={query}
            missingValue={isUnkownType ? t('notifications/unkown/text') : ''}
          />
        </P>
        {afterTokenAuth && displayCloseNote ? (
          <P>{t('notifications/closeNote')}</P>
        ) : (
          ((!hasCurtain && !isUnkownType) || inNativeApp) && (
            <div {...styles.button}>
              <Link route='index'>
                <Button block primary>
                  {t(`notifications/closeButton${inNativeApp ? '/app' : ''}`)}
                </Button>
              </Link>
            </div>
          )
        )}
      </Fragment>
    )
  }
  const displayMe =
    type === 'invalid-email' && ['signIn', 'pledge'].indexOf(context) !== -1
  const links = [
    me &&
      context === 'pledge' &&
      type !== 'token-authorization' && {
        route: 'account',
        label: t('notifications/links/merci')
      }
  ].filter(Boolean)

  const isProjectR = context === 'projectr'
  const logo = isProjectR ? (
    <a
      href='https://project-r.construction/'
      rel='noopener'
      target='_blank'
      {...styles.logoProjectR}
    >
      <img
        style={{ height: 50 }}
        src={`${CDN_FRONTEND_BASE_URL}/static/project_r_logo.png`}
      />
    </a>
  ) : hasCurtain ? (
    <div {...styles.logoRepublik}>
      <Logo />
    </div>
  ) : (
    <a href='/' target={logoTarget} {...styles.logoRepublik}>
      <Logo />
    </a>
  )

  const stickyBar = !isProjectR

  return (
    <div>
      <Head>
        <title>{t('notifications/pageTitle')}</title>
        <meta name='robots' content='noindex' />
      </Head>
      <NarrowContainer>
        <div {...(stickyBar ? styles.bar : undefined)}>{logo}</div>
        {inNativeApp && (
          <Link route='index'>
            <a {...styles.close}>
              <MdClose size={32} fill='#000' />
            </a>
          </Link>
        )}
        <div
          {...styles.text}
          {...(stickyBar ? styles.padHeader : undefined)}
          style={{
            marginTop: inNativeApp ? 15 : undefined
          }}
        >
          {title && (
            <Fragment>
              <H1>{title}</H1>
              <br />
            </Fragment>
          )}
          {content}
          {displayMe && (
            <div {...styles.me}>
              <Me email={email} />
            </div>
          )}
          {!hasCurtain && links.length > 0 && (
            <P {...styles.link}>
              {intersperse(
                links.map((link, i) => (
                  <Link key={i} route={link.route} params={link.params}>
                    <a {...linkRule}>{link.label}</a>
                  </Link>
                )),
                () => ' – '
              )}
            </P>
          )}
        </div>
      </NarrowContainer>
    </div>
  )
}

export default compose(withMe, withT, withRouter, withInNativeApp)(Page)
