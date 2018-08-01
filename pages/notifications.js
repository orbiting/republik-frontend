import React, { Fragment } from 'react'
import { css } from 'glamor'
import Head from 'next/head'
import isEmail from 'validator/lib/isEmail'

import { compose } from 'react-apollo'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'
import withInNativeApp from '../lib/withInNativeApp'
import { intersperse } from '../lib/utils/helpers'
import { Link } from '../lib/routes'
import * as base64u from '../lib/utils/base64u'

import Me from '../components/Auth/Me'
import TokenAuthorization from '../components/Auth/TokenAuthorization'
import MacNewsletterSubscription from '../components/Auth/MacNewsletterSubscription'

import { DEFAULT_TOKEN_TYPE } from '../components/constants'
import {
  CURTAIN_MESSAGE, CDN_FRONTEND_BASE_URL
} from '../lib/constants'

import {
  Interaction, NarrowContainer, Logo, linkRule, RawHtml, mediaQueries, Button
} from '@project-r/styleguide'

const styles = {
  logo: css({
    margin: '0 auto',
    paddingTop: 26,
    textAlign: 'center'
  }),
  logoProjectR: css({
    display: 'block',
    margin: '0 auto',
    maxWidth: 520,
    marginBottom: -16,
    textAlign: 'left',
    [mediaQueries.mUp]: {
      textAlign: 'center'
    }
  }),
  text: css({
    margin: '30px auto 120px',
    maxWidth: 520,
    [mediaQueries.mUp]: {
      textAlign: 'center'
    },
    [mediaQueries.lUp]: {
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

const {H1, P} = Interaction

const Page = withT(({ url: { query, query: { context, token, tokenType, noAutoAuthorize } }, t, me, inNativeApp }) => {
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

  const title = t(`notifications/${type}/title`, undefined, '')
  let logoTarget
  let content
  if (type === 'token-authorization') {
    logoTarget = '_blank'
    content = <TokenAuthorization
      email={email}
      token={token}
      tokenType={tokenType || DEFAULT_TOKEN_TYPE}
      noAutoAuthorize={noAutoAuthorize}
      context={context}
    />
  } else if (type === 'newsletter-subscription') {
    logoTarget = '_blank'
    content = <MacNewsletterSubscription
      name={query.name}
      subscribed={query.subscribed}
      mac={query.mac}
      email={email}
      context={context} />
  } else {
    const afterTokenAuth =
      type === 'email-confirmed' || type === 'session-denied'

    const displayCloseNote =
      !me || ['claim', 'preview'].indexOf(context) !== -1

    content = <Fragment>
      <RawHtml type={P} dangerouslySetInnerHTML={{
        __html: t.first([`notifications/${type}/${context}/text`, `notifications/${type}/text`], query, '')
      }} />
      {afterTokenAuth && displayCloseNote
        ? <P> {t('notifications/closeNote')} </P>
        : (!hasCurtain || inNativeApp) && <div {...styles.button}>
          <Link route='index'>
            <Button block primary>
              {t(`notifications/closeButton${inNativeApp ? '/app' : ''}`)}
            </Button>
          </Link>
        </div>
      }
    </Fragment>
  }
  const displayMe = (
    type === 'invalid-email' &&
    ['signIn', 'pledge'].indexOf(context) !== -1
  )
  const links = [
    me && context === 'pledge' && type !== 'token-authorization' && {
      route: 'account',
      label: t('notifications/links/merci')
    }
  ].filter(Boolean)

  const logo = context === 'projectr' ? (
    <a href='https://project-r.construction/' rel='noopener' target='_blank' {...styles.logoProjectR}>
      <img
        style={{height: 50}}
        src={`${CDN_FRONTEND_BASE_URL}/static/project_r_logo.png`} />
    </a>
  ) : (
    hasCurtain
      ? <Logo height={34} />
      : <a href='/' target={logoTarget}>
        <Logo height={34} />
      </a>
  )

  return (
    <div>
      <Head>
        <title>{t('notifications/pageTitle')}</title>
        <meta name='robots' content='noindex' />
      </Head>
      <NarrowContainer>
        {!inNativeApp && (
          <div {...styles.logo}>
            {logo}
          </div>
        )}
        <div {...styles.text}>
          {title && <Fragment>
            <H1>{title}</H1>
            <br />
          </Fragment>}
          {content}
          {displayMe && (
            <div {...styles.me}>
              <Me email={email} />
            </div>
          )}
          {!hasCurtain && links.length > 0 && (
            <P {...styles.link}>
              {intersperse(links.map((link, i) => (
                <Link key={i} route={link.route} params={link.params}>
                  <a {...linkRule}>
                    {link.label}
                  </a>
                </Link>
              )), () => ' – ')}
            </P>
          )}
        </div>
      </NarrowContainer>
    </div>
  )
})

export default compose(withData, withMe, withInNativeApp)(Page)
