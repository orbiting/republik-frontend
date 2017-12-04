import React from 'react'
import { css } from 'glamor'
import Head from 'next/head'

import withData from '../lib/apollo/withData'
import withT from '../lib/withT'
import { intersperse } from '../lib/utils/helpers'
import { Link } from '../lib/routes'

import Me from '../components/Auth/Me'

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
    maxWidth: 580
  }),
  link: css({
    marginTop: 20
  }),
  me: css({
    marginTop: 80,
    marginBottom: 80
  })
}

const {H1, P} = Interaction

export default withData(withT(({url: {query: {type, context, email}}, t}) => {
  const links = [
    context === 'pledge' && {
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
          <Link route='index'>
            <a><Logo /></a>
          </Link>
        </div>
        <div {...styles.text}>
          <H1>
            {t(`notifications/${type}/title`, undefined, '')}
          </H1>
          <RawHtml type={P} dangerouslySetInnerHTML={{
            __html: t(`notifications/${type}/text`, undefined, '')
          }} />
          {(
            type === 'invalid-token' &&
            (
              context === 'signIn' ||
              context === 'pledge'
            )
          ) && (
            <div {...styles.me}>
              <Me email={email} />
            </div>
          )}
          {links.length > 0 && <P {...styles.link}>
            {intersperse(links.map((link, i) => (
              <Link key={i} route={link.route} params={link.params}>
                <a {...linkRule}>
                  {link.label}
                </a>
              </Link>
            )), () => ' – ')}
          </P>}
        </div>
      </NarrowContainer>
    </div>
  )
}))
