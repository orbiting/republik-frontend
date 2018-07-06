import React from 'react'
import { css } from 'glamor'
import Head from 'next/head'
import isEmail from 'validator/lib/isEmail'

import withData from '../lib/apollo/withData'
import withT from '../lib/withT'
import { intersperse } from '../lib/utils/helpers'
import { Link } from '../lib/routes'
import * as base64u from '../lib/utils/base64u'

import Me from '../components/Auth/Me'
import TokenAuthorization from '../components/Auth/TokenAuthorization'
import MacNewsletterSubscription from '../components/Auth/MacNewsletterSubscription'

import {
  CURTAIN_MESSAGE, CDN_FRONTEND_BASE_URL
} from '../lib/constants'

import {
  Interaction, NarrowContainer, Logo, linkRule, RawHtml, mediaQueries
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
    margin: '60px auto 120px',
    maxWidth: 520,
    [mediaQueries.mUp]: {
      textAlign: 'center'
    }
  }),
  link: css({
    marginTop: 20
  }),
  me: css({
    marginTop: 80,
    marginBottom: 80
  })
}

const hasCurtain = !!CURTAIN_MESSAGE

const {H1, P} = Interaction

const Page = withT(({ url: { query, query: { context, token, tokenType } }, t }) => {
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
      tokenType={tokenType || 'EMAIL_TOKEN'}
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
    content = <RawHtml type={P} dangerouslySetInnerHTML={{
      __html: t(`notifications/${type}/text`, query, '')
    }} />
  }
  const displayMe = (
    type === 'invalid-email' &&
    ['signIn', 'pledge', 'authorization'].indexOf(context) !== -1
  )
  const links = [
    context === 'pledge' && type !== 'token-authorization' && {
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
        <div {...styles.logo}>
          {logo}
        </div>
        <div {...styles.text}>
          {title && <H1>{title}</H1>}
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

export default withData(Page)
