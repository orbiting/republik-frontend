import React from 'react'
import {
  Interaction,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  colors,
  mediaQueries,
  A,
  fontStyles
} from '@project-r/styleguide'
import MdClose from 'react-icons/lib/md/close'
import { css } from 'glamor'

const styles = {
  articleContainer: css({
    [mediaQueries.mUp]: {
      maxHeight: 400,
      overflow: 'scroll'
    }
  }),
  article: css({
    ...fontStyles.serifTitle20,
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
  link: css({
    color: colors.negative.text,
    textDecoration: 'none'
  }),
  footer: css({
    padding: 20
  })
}
const articles = [
  {
    headline:
      'Was China mit seinen 60 Milliarden in der Schweiz schon so alles gekauft hat.',
    url: 'https://www.republik.ch/2019/09/16/das-china-dilemma'
  },
  {
    headline:
      'Schwirrt der Kopf bei Quantenphysik? Gut, dann gehen wir jetzt einen Schritt weiter.',
    url: 'https://www.republik.ch/2019/09/07/die-physiker'
  },
  {
    headline:
      'Google-Software im Klassenzimmer: Totalüberwachung von Minderjährigen?',
    url: 'https://www.republik.ch/2019/07/02/der-spion-im-schulzimmer'
  },
  {
    headline: 'Grossbritannien: We have not even begun to fuck ourselves.',
    url: 'https://www.republik.ch/2019/10/05/die-schlacht-um-england'
  },
  {
    headline:
      'Keine kommende Katastrophe wurde je so gründlich untersucht wie die Klimaerwärmung. Und keine wurde so gründlich ignoriert. Wieso?',
    url: 'https://www.republik.ch/2019/08/24/die-grosse-ueberforderung'
  },
  {
    headline:
      'Neu im Nationalrat? Für wen lobbyieren Sie – und was ist Ihr Preis?',
    url: 'https://www.republik.ch/2019/10/02/interessen-vertreten'
  },
  {
    headline: 'Hat Facebook Sie schon radikalisiert?',
    url:
      'https://www.republik.ch/2019/10/03/die-infrastruktur-des-netzes-spielt-den-extremisten-in-die-haende'
  },
  {
    headline:
      'Deutschlands Autobauer haben die E-Mobilität lange ignoriert, jetzt kommt die Retourkutsche.',
    url: 'https://www.republik.ch/2019/09/20/die-retourkutsche'
  },
  {
    headline: 'Die Swisscom braucht dringend ein Näxt Big Sing.',
    url: 'https://www.republik.ch/2019/08/15/se-naext-big-sing'
  }
]

export default ({ onClose }) => {
  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 400, minHeight: 'none' }}>
      <OverlayToolbar>
        <Interaction.Emphasis
          style={{ padding: '15px 20px', fontSize: 16, color: colors.text }}
        >
          Die Republik durch 9 Artikel entdecken
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} fill='#000' />}
        />
      </OverlayToolbar>
      <OverlayBody style={{ padding: '48px 0 0' }}>
        <div {...styles.articleContainer}>
          {articles.map((article, index) => {
            return (
              <A href={article.url} key={index}>
                <div {...styles.article}>{article.headline}</div>
              </A>
            )
          })}
        </div>
        <Interaction.P {...styles.footer}>
          More about die Republik <A>here</A>.
        </Interaction.P>
      </OverlayBody>
    </Overlay>
  )
}
