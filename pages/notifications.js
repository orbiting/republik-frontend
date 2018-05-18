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
  CURTAIN_MESSAGE
} from '../lib/constants'

import {
  Interaction, NarrowContainer, Logo, linkRule, RawHtml
} from '@project-r/styleguide'

const styles = {
  logo: css({
    textAlign: 'center',
    maxWidth: 207,
    margin: '0 auto',
    paddingTop: 26
  }),
  text: css({
    margin: '120px auto',
    textAlign: 'center',
    maxWidth: 520
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

const Page = withT(({ url: { query, query: { context, token } }, t }) => {
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
  let content
  if (type === 'token-authorization') {
    content = <TokenAuthorization
      email={email}
      token={token}
    />
  } else if (type === 'newsletter-subscription') {
    content = <MacNewsletterSubscription
      name={query.name}
      subscribed={query.subscribed}
      mac={query.mac}
      email={email} />
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

  return (
    <div>
      <Head>
        <title>{t('notifications/pageTitle')}</title>
        <meta name='robots' content='noindex' />
      </Head>
      <NarrowContainer>
        <div {...styles.logo}>
          {hasCurtain
            ? <Logo />
            : <Link route='index'>
              <a><Logo /></a>
            </Link>
          }
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
