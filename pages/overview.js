import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'

import { nest } from 'd3-collection'
// import { lab } from 'd3-color'

import { swissTime } from '../lib/utils/format'
import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../lib/constants'

import {
  Button,
  Editorial,
  Interaction,
  Label,
  fontFamilies
} from '@project-r/styleguide'

import Loader from '../components/Loader'
import Frame from '../components/Frame'
import { negativeColors } from '../components/Frame/constants'

import { Link } from '../lib/routes'

const getDocument = gql`
query getFrontOverview {
  front: document(path: "/") {
    id
    content
    links {
      entity {
        __typename
        ... on Document {
          meta {
            path
            publishDate
          }
        }
      }
    }
  }
}
`

const styles = {
  p: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 17,
    lineHeight: '26px',
    color: negativeColors.text,
    margin: 0
  })
}

const P = ({ children, ...props }) =>
  <p {...styles.p} {...props}>{children}</p>

const A = ({ children, ...props }) =>
  <Editorial.A style={{ color: negativeColors.text }} {...props}>{children}</Editorial.A>

const getMonth = swissTime.format('%B')

class FrontOverview extends Component {
  render () {
    const { data } = this.props
    const meta = {
      title: '2018, Monat für Monat'
    }

    return (
      <Frame meta={meta} dark>
        <Interaction.H1 style={{ color: negativeColors.text, marginBottom: 5 }}>
          2018, Monat für Monat
        </Interaction.H1>

        <P>
          <Label>signed_out</Label> Melden Sie sich an, um alle Beiträge lesen zu können. Noch nicht Mitglied? <Link route='pledge' passHref>
            <A>Kommen Sie an Bord!</A>
          </Link>
        </P>
        <P>
          <Label>no_membership</Label> Werden Sie Mitglied, um alle Beiträge lesen zu können. <Link route='pledge' passHref>
            <A>Kommen Sie an Bord!</A>
          </Link>
        </P>
        <P>
          <Label>members</Label> Lassen Sie das erste Jahr der Republik Revue passieren.
        </P>

        <Loader loading={data.loading} error={data.error} render={() => {
          const teasers = data.front.content.children.reduce((agg, rootChild) => {
            // if (rootChild.identifier === 'TEASERGROUP') {
            //   rootChild.children.forEach(child => {
            //     agg.push({size: 1 / rootChild.children.length, node: child})
            //   })
            // } else {
            agg.push({ size: 1, node: rootChild })
            // }
            return agg
          }, []).reverse().filter((teaser, i, all) => {
            let node = teaser.node
            if (teaser.node.identifier === 'TEASERGROUP') {
              node = teaser.node.children[0]
            }

            const link = data.front.links.find(l => (
              l.entity.__typename === 'Document' &&
              l.entity.meta.path === node.data.url
            ))
            if (!link) {
              // console.warn('no link found', teaser)
            }
            teaser.index = i
            teaser.publishDate = link
              ? new Date(link.entity.meta.publishDate)
              : all[i - 1].publishDate
            return teaser.publishDate
          })

          const texts = {
            Januar: <Fragment>
              Die Republik geht mit irrational langen Beiträgen an den Start. Auftakt für den <A href='https://www.republik.ch/2018/01/17/warum-justiz'>Schwerpunkt Justiz</A>. Premiere der ersten Reportagen-Serie «Race, Class, Guns and God». Globi besucht das WEF, wir analysieren Fox News und verteidigen den Service public. Die Doping-Recherchen sorgen international für Aufsehen.
            </Fragment>,
            Februar: <Fragment>
              Peppe Grillos Fünf-Sterne Bewegung in Italien, <A href='https://www.republik.ch/2018/01/13/verdeckte-politwerbung-enttarnen'>Polit-Werbung auf Facebook</A>: digitale Themen werden zu einem Markenzeichen der Republik. Sybille Berg startet ihre Kolumne. Das Elend der SDA und die Zukunft der AHV beschäftigen Debatten wie Autorinnen. Die Audio-Podcast gehen in Serie. Und <A href='https://www.republik.ch/2018/02/12/sie-wir-und-unser-gemeinsames-unternehmen'>wir haben Ihnen zugehört</A>.
            </Fragment>,
            März: <Fragment>
              Raiffeisen im Elend, «UBS im Dschungel» – und die Frage: Sind deutsche Whistleblower in der Schweiz tatsächlich Spione? Gespräche mit Politologin Silja Häusermann und Feministin Mona Eltahawy. Auftakt zur Sozialdetektiv-Debatte. Erstmals <A href='https://www.republik.ch/2018/03/01/die-republik-zum-hoeren'>lesen Autoren ihre Beiträge auch vor</A> – zum Anhören als Podcast..
            </Fragment>,
            April: <Fragment>
              Der «Mord auf Malta» und das Baukartell in Graubünden. Porträt über die Schweizer Chefdiplomatin Christine Baeriswyl. Vorwürfe gegen den Zürcher Regierungsrat Mario Fehr. Gespräche mit Top-Ökonomen über die Zukunft Europas. Und: «Die 10 Gebote der Medienförderung».
            </Fragment>,
            Mai: <Fragment>
              Vollgeld für Dummies, Vollgeld für Nerds und der Libanon in der Panorama-Ansicht. Premiere des Videoformats «An der Bar» mit Carla Del Ponte. Debatte zum neuen EU-Datenschutzgesetz. Wir erklären, wie die Republik die <A href='https://www.republik.ch/2018/05/19/der-neue-datenschutz-der-republik'>Daten ihrer Nutzerinnen schützt</A>. Die PDF-Funktion startet: ab sofort gibts die Republik auch auf Papier.
            </Fragment>,
            Juni: <Fragment>
              Die Türkei vor den Wahlen als Mini-Soap, Mexiko vor den Wahlen als Zweiteiler. Erste interaktive Serie zum Siegeszug des Computers. Die illustrierte Recherche zum «FC Kreml»: Wer profitiert von der Fussball-WM in Russland? <A href='https://www.republik.ch/2018/06/09/in-eigener-sache-zum-baukartell'>Klarstellung zu den Baukartell-Recherchen</A>. Und: Die Republik hat jetzt eine Suchfunktion.
            </Fragment>,
            Juli: <Fragment>
              Das Leben der Eritreer in der Schweiz, das Gesicht als Passwort und das Milliarden-Geschäft mit Baby-Aalen. Das Plädoyer für ein souveränes Europa und das Migrantinnen-Manifest. Wir fragen: Soll man Sex kaufen dürfen? Und auch in Deutschland wird «Merkel, Machos und die Macht» ein Hit.
            </Fragment>,
            August: <Fragment>
              Liebe, Sex und LSD, dazu – endlich! – der Start der «<A href='https://www.republik.ch/2018/08/21/ameisen-bevoelkern-die-republik'>Ameisen</A>». Die Österreicherin der Republik hält Rede zur Nation. Wir erklären alles Wichtige zu den flankierenden Massnahmen. Die Wortkünstlerin Fatima Moumoumi im Porträt. Das Community-Projekt «<A href='https://www.republik.ch/2018/08/15/ihre-nachbarin-denkt-anders-als-sie-treffen-sie-sich-zum-gespraech'>Schweiz spricht</A>» wird lanciert. Und: Bilder-Galerien werden eingeführt.
            </Fragment>,
            September: <Fragment>
              Brasilien vor dem Faschismus, die «vorletzten Tage der Menschheit», Chemnitz und Start der Drogen-Serie. Feministin Rebecca Solnit über die Unterdrückung der Frauen und Politologin Chantal Mouffé über Linkspopulismus. Die Abschaffung der Freiheit und die Lehren aus der Finanzkrise. <A href='https://www.republik.ch/2018/09/03/7-uhr-newsletter'>Feuilleton</A> und <A href='https://www.republik.ch/2018/09/01/app/diskussion'>App</A> – beides ist da!
            </Fragment>,
            Oktober: <Fragment>
              Unser Recherche-Netzwerk deckt den CumEx-Skandal auf. Der Zuger CVP-Sicherheitsdirektor Beat Villiger sorgt für den ersten Rechtsstreit, «Die Macht der Lüge in der Politik» für Reflexion. Google als Medienmäzen. Wir fragen: Wie recht hat das Volk? Podium zu #metoo. Und die <A href='https://www.republik.ch/2018/10/31/wie-sie-waehlten-stimmten-und-was-sie-wollen'>Republik wird demokratisch</A>.
            </Fragment>,
            November: <Fragment>
              «Verrat in der Moschee». Das Ende der Sozialdemokratie. Zwei ehemalige Kindersoldaten, die das Schicksal an den Internationalen Strafgerichtshof spült. Wie die Politik beim Klimawandel versagt. Soros in der Schweiz. Der Schweizer Aussenminister sitzt «An der Bar». Und die <A href='https://www.republik.ch/umfrage/2018'>erste Leserinnen-Umfrage</A>.
            </Fragment>,
            Dezember: <Fragment>
              Nicht der erste, sondern der definitive Artikel: «Aufstand der Peripherie» – die Analyse zu den Gelbwesten in Frankreich. Die Serie zum Klimawandel. Vom Leben mit non-binärer Geschlechtsidentität. Betablocker. Die Eine-Million-Dollar-Frage: Wer erfindet den Bullshit-Detektor? Und wir lancieren die <A href='https://www.republik.ch/2018/12/17/willkommen-im-neuen-republik-dialog'>Dialog-Plattform neu</A>.
            </Fragment>
          }

          return nest()
            .key(d => getMonth(d.publishDate))
            .entries(teasers)
            .slice(0, 13)
            .map(({ key: month, values }) => {
              return (
                <div style={{ marginTop: 50 }} key={month}>
                  <Interaction.H2 style={{ color: negativeColors.text, marginBottom: 5, marginTop: 0 }}>
                    {month}
                  </Interaction.H2>
                  <P style={{ marginBottom: 20 }}>
                    {texts[month]}
                  </P>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    height: values.length * 8
                  }}>
                    {values.map(teaser => {
                      return <a key={teaser.node.data.id} href={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.node.data.id}`)}`} target='_blank'><img
                        src={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.node.data.id}`)}&resize=160`}
                        style={{
                          width: 80,
                          // width: 55 * teaser.size,
                          marginBottom: 5,
                          marginRight: 5
                          // flex: '1 1 80px'
                        }} /></a>
                    })}
                  </div>
                </div>
              )
            })
        }} />

        <P style={{ marginBottom: 10, marginTop: 100 }}>
          <Label>not members</Label> Geniessen Sie die stillen Stunden zum Lesen:
        </P>
        <Button white>Jetzt Mitglied werden</Button>
      </Frame>
    )
  }
}

export default compose(
  graphql(getDocument)
)(FrontOverview)
