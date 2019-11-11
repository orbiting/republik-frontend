import React from 'react'
import {
  Interaction,
  Editorial,
  RawHtml,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  colors,
  mediaQueries,
  fontStyles
} from '@project-r/styleguide'
import MdClose from 'react-icons/lib/md/close'
import { css } from 'glamor'
import withT from '../../lib/withT'
import Link from 'next/link'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { getUtmParams } from '../../lib/utils/url'

const styles = {
  articleContainer: css({
    [mediaQueries.mUp]: {
      maxHeight: 400,
      overflow: 'scroll'
    }
  }),
  article: css({
    ...fontStyles.serifTitle20,
    display: 'block',
    textDecoration: 'none',
    background: colors.negative.primaryBg,
    color: colors.negative.text,
    padding: 20,
    margin: 0,
    borderBottom: '1px solid #222',
    '@media (hover)': {
      ':hover': {
        backgroundColor: '#2c2e35'
      }
    },
    [mediaQueries.mUp]: {
      ...fontStyles.serifTitle22,
      padding: '30px 20px'
    }
  }),
  footer: css({
    color: colors.negative.text,
    padding: 20
  })
}
const articles = [
  {
    headline:
      'Was China mit seinen 60 Milliarden in der Schweiz schon so alles gekauft hat.',
    path: '/2019/09/16/das-china-dilemma'
  },
  {
    headline:
      'Schwirrt der Kopf bei Quantenphysik? Gut, dann gehen wir jetzt einen Schritt weiter.',
    path: '/2019/09/07/die-physiker'
  },
  {
    headline:
      'Google-Software im Klassenzimmer: Totalüberwachung von Minderjährigen?',
    path: '/2019/07/02/der-spion-im-schulzimmer'
  },
  {
    headline: 'Grossbritannien: We have not even begun to fuck ourselves.',
    path: '/2019/10/05/die-schlacht-um-england'
  },
  {
    headline:
      'Keine kommende Katastrophe wurde je so gründlich untersucht wie die Klimaerwärmung. Und keine wurde so gründlich ignoriert. Wieso?',
    path: '/2019/08/24/die-grosse-ueberforderung'
  },
  {
    headline:
      'Neu im Nationalrat? Für wen lobbyieren Sie – und was ist Ihr Preis?',
    path: '/2019/10/02/interessen-vertreten'
  },
  {
    headline: 'Hat Facebook Sie schon radikalisiert?',
    path:
      '/2019/10/03/die-infrastruktur-des-netzes-spielt-den-extremisten-in-die-haende'
  },
  {
    headline:
      'Deutschlands Autobauer haben die E-Mobilität lange ignoriert, jetzt kommt die Retourkutsche.',
    path: '/2019/09/20/die-retourkutsche'
  },
  {
    headline: 'Die Swisscom braucht dringend ein Näxt Big Sing.',
    path: '/2019/08/15/se-naext-big-sing'
  }
]

export default compose(
  withT,
  withRouter
)(({ t, router: { query }, onClose }) => {
  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 600, minHeight: 'none' }}>
      <OverlayToolbar>
        <Interaction.Emphasis
          style={{ padding: '15px 20px', fontSize: 16, color: colors.text }}
        >
          {t('marketing/vbz/overlay/title')}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} fill='#000' />}
        />
      </OverlayToolbar>
      <OverlayBody
        style={{
          padding: '48px 0 0',
          backgroundColor: colors.negative.primaryBg
        }}
      >
        {articles.map((article, index) => {
          return (
            <Link
              href={{
                pathname: article.path,
                query: getUtmParams(query, { utm_campaign: 'wseww' })
              }}
              key={index}
              passHref
            >
              <a {...styles.article}>{article.headline}</a>
            </Link>
          )
        })}
        <div {...styles.footer}>
          <RawHtml
            white
            dangerouslySetInnerHTML={{
              __html: t('marketing/vbz/overlay/footnote')
            }}
          />
        </div>
      </OverlayBody>
    </Overlay>
  )
})
