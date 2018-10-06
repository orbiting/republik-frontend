import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import withData from '../lib/apollo/withData'
import withT from '../lib/withT'

import Frame from '../components/Frame'

import { Editorial, Interaction, TitleBlock } from '@project-r/styleguide'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const { P, LI } = Editorial

export default compose(
  withData,
  withT,
  withRouter
)(({ router, t }) => {
  const meta = {
    pageTitle: t('etiquette/pageTitle'),
    title: t('etiquette/title'),
    description: t('etiquette/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/team/bern.jpg`,
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }

  return (
    <Frame
      meta={meta}
    >

      <TitleBlock center>
        <Interaction.Headline>Die Etikette</Interaction.Headline>
        <Editorial.Lead>
        Betreten Sie unseren Debattenraum, betreten Sie unser Wohnzimmer. Machen Sie es sich gemütlich und fühlen Sie sich wie zuhause. Damit wir – wie bei Cheminéefeuer – fruchtbar miteinander reden können, möchten wir Sie auf ein paar Spielregeln hinweisen.
        </Editorial.Lead>
      </TitleBlock>

      <P>Vergessen Sie nie, dass auf der anderen Seite ein Mensch sitzt. Oder wie David Foster Wallace schrieb: «Die wirklich wichtige Freiheit erfordert Aufmerksamkeit und Offenheit und Disziplin und Mühe und die Empathie, andere Menschen wirklich ernst zu nehmen.»</P>
      <P>Für uns ergeben sich daraus folgende Konsequenzen:</P>

      <Editorial.OL>

        <LI>Beleidigen Sie einander nicht. Auch nicht, wenn das Gegenüber diese Regel schon gebrochen hat. Im Zweifelsfall: Schreiben Sie nichts, was Sie Ihrem Gegenüber nicht auch ins Gesicht sagen würden.</LI>
        <LI>Sexismus, Rassismus und das Kokettieren damit hat im Wohnzimmer der Republik nichts verloren. Beiträge in diese Richtung werden nicht geduldet. Ebensowenig sämtliche Beiträge, die gegen das Gesetz verstossen.</LI>
        <LI>Belästigen Sie andere Menschen nicht. Will eine Person nicht mit Ihnen diskutieren, akzeptieren Sie das bitte.</LI>
        <LI>Durchatmen! Falls Sie sich dereinst einmal in Rage gebracht sehen sollten, geben Sie sich Zeit zu antworten. Sie müssen nicht sofort reagieren.</LI>
        <LI>Fördern Sie ein gutes Klima. Ignorieren Sie im Zweifelsfall destruktive Äusserungen.</LI>
        <LI>Respektieren Sie andere Meinungen. Je vielfältiger die Meinungen, desto bereichernder die Debatte.</LI>
        <LI>Bleiben Sie beim Thema. Unser Debattensystem erlaubt zwar mehrere Subgespräche, dennoch wollen wir über eine konkrete Sache diskutieren.</LI>
        <LI>Sollten Sie sich erst später in eine laufende Debatte einschalten, informieren Sie sich bitte darüber, was bereits diskutiert wurde.</LI>
        <LI>Gehen Sie auf die Argumente Ihres Gegenübers ein. Dies ist keine blosse Abstellkammer für Meinungen.</LI>
        <LI>Lassen Sie einander ausreden. Geben Sie auch anderen Menschen Raum.</LI>
        <LI>Schreiben Sie bitte nur einen Beitrag aufs Mal. Editieren Sie Ihren bereits bestehenden Beitrag, falls Ihnen nach dem Absenden noch ein ungeahnter Geistesblitz kommt.</LI>
        <LI>Bitte schreiben Sie lesbar und bleiben Sie verständlich. Der Debattenraum der Republik soll für alle zugänglich sein.</LI>
        <LI>Beiträge von epischer Länge bringen die Diskussion eher ins Stocken, als dass sie sie befeuern.</LI>
        <LI>Bitte nützen Sie ein Profilbild, das Sie zeigt. Nicht ein Logo, Werbung oder dergleichen.</LI>
        <LI>Werbung hat auch in anderen Formen nichts in der Debatte zu suchen.</LI>
        <LI>Obwohl wir mit Klarnamen debattieren, ist die Privatsphäre aller Nutzer zu respektieren. Posten Sie keine Adressen, Telefonnummern oder ähnliche private Informationen.</LI>

      </Editorial.OL>

    </Frame>
  )
})
