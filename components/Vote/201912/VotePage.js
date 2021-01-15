import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { Body, Title } from '../text'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Frame from '../../Frame'
import DiscussionIcon from '../../Icons/Discussion'
import Link from '../../Link/Path'
import SignIn from '../../Auth/SignIn'
import Collapsible from '../Collapsible'
import Voting from '../Voting'
import {
  colors,
  A,
  Interaction,
  mediaQueries,
  RawHtml,
  FigureImage,
  FigureCaption,
  IconButton
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'
import voteT from '../voteT'
import { CDN_FRONTEND_BASE_URL, PUBLIC_BASE_URL } from '../../../lib/constants'
import { getVotingStage, VOTING_STAGES } from '../votingStage'
import ActionBar from '../../ActionBar'
import Loader from '../../Loader'
import VoteInfo from './VoteInfo'
import VoteResult from '../VoteResult'
import md from 'markdown-in-js'
import { mdComponents } from '../text'

import {
  VOTINGS_COOP_201912 as VOTINGS,
  VOTING_COOP_201912_REPORT_SLUG
} from '../constants'

const { P, H2 } = Interaction

const styles = {
  actions: css({
    display: 'flex',
    margin: '0 0 20px 0',
    [mediaQueries.lUp]: {
      margin: '30px 0'
    },
    '& a': { marginLeft: 16 }
  }),
  anchor: css({
    display: 'block',
    position: 'relative',
    visibility: 'hidden',
    top: -HEADER_HEIGHT_MOBILE,
    [mediaQueries.lUp]: {
      top: -HEADER_HEIGHT
    }
  }),
  image: css({
    margin: '25px 0'
  }),
  thankyou: css({
    margin: '25px auto',
    maxWidth: 550,
    padding: 25,
    textAlign: 'center'
  }),
  chart: css({
    margin: '30px auto',
    [mediaQueries.mUp]: {
      margin: '50px auto'
    },
    maxWidth: '400px'
  })
}

class VotePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      president: []
    }

    this.onVoteChange = field => value => {
      this.setState({ [field]: value })
    }
  }

  render() {
    const { vt, data } = this.props

    const meta = {
      title: vt('vote/201912/page/title'),
      description: vt('vote/201912/page/description'),
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/vote-dez19-result.png`
    }

    return (
      <Frame meta={meta}>
        <Loader
          loading={data.loading}
          error={data.error}
          render={() => {
            const {
              beginDate,
              endDate,
              userIsEligible,
              discussion,
              groupTurnout
            } = this.props.data[VOTING_COOP_201912_REPORT_SLUG] || {}

            const votingStage = getVotingStage(beginDate, endDate)
            if (votingStage === VOTING_STAGES.INFO) {
              return <VoteInfo />
            }

            const votings = [...VOTINGS.map(({ slug }) => data[slug])]

            const { me } = data
            const numVotes = groupTurnout && groupTurnout.submitted

            const userIsDone = votings
              .map(d => d.userHasSubmitted)
              .every(Boolean)

            const now = new Date()
            const hasEnded = votings
              .map(d => now > new Date(d.endDate))
              .every(Boolean)

            const hasResults = votings.map(d => d.result).every(Boolean)

            const shareObject = {
              url: `${PUBLIC_BASE_URL}/vote/dez19`,
              title: vt('vote/201912/page/title'),
              tweet: vt('vote/201912/sm/tweet'),
              emailSubject: vt('vote/201912/sm/emailSubject'),
              emailBody: vt('vote/201912/sm/emailBody')
            }

            const actionBar = (
              <div {...styles.actions}>
                <ActionBar share={shareObject} />
                {discussion && (
                  <Link path={discussion.path} passHref>
                    <IconButton
                      Icon={DiscussionIcon}
                      label={
                        discussion.comments
                          ? discussion.comments.totalCount
                          : undefined
                      }
                      labelShort={
                        discussion.comments
                          ? discussion.comments.totalCount
                          : undefined
                      }
                      fill={colors.primary}
                    />
                  </Link>
                )}
              </div>
            )

            return (
              <Fragment>
                {hasResults && (
                  <Fragment>
                    <Title>{vt('vote/201912/result/title')}</Title>
                    <Body dangerousHTML={vt('vote/201912/result/lead')} />
                    <VoteResult
                      votings={VOTINGS.map(({ id, slug }) => ({
                        id,
                        data: data[slug]
                      }))}
                    />
                    <Body dangerousHTML={vt('vote/201912/result/after')} />
                    <div style={{ height: 80 }} />
                  </Fragment>
                )}
                {hasEnded && !hasResults && (
                  <div {...styles.thankyou}>
                    <RawHtml
                      type={P}
                      dangerouslySetInnerHTML={{
                        __html: vt('vote/201912/ended')
                      }}
                    />
                  </div>
                )}

                <Title>{vt('vote/201912/title')}</Title>
                {actionBar}
                <div {...styles.image}>
                  <FigureImage
                    src={`${CDN_FRONTEND_BASE_URL}/static/genossenschaft/urabstimmung3.jpg?resize=780x`}
                  />
                  <FigureCaption>{vt('vote/201912/caption')}</FigureCaption>
                </div>
                {!me && !hasEnded && (
                  <div style={{ margin: '80px 0' }}>
                    <SignIn
                      beforeForm={
                        <Fragment>
                          <H2>{vt('common/signInTitle')}</H2>
                          <RawHtml
                            type={P}
                            dangerouslySetInnerHTML={{
                              __html: vt('vote/201912/signInBody')
                            }}
                          />
                        </Fragment>
                      }
                    />
                  </div>
                )}
                {md(mdComponents)`
Sehr geehrte Verlegerinnen und Verleger

Herzlich willkommen zur dritten Urabstimmung von Project R. Viele von Ihnen haben bereits Übung: Im Herbst 2018 haben Sie gewählt und über die Finanzen abgestimmt und im Sommer 2019 die Revisionsstelle bestätigt sowie das Budget verabschiedet.

Heute geht es um die Genehmigung des vergangenen Geschäftsjahres. Oder im Fachjargon: Das sind die Traktanden dieser Urabstimmung: 

 - [Geschäftsbericht 2018/2019](#geschaftsbericht)
 - [Jahresrechnung Project R 2018/2019](#jahresrechnung)
 - [Entlastung des Vorstandes](#entlastung)
 - [Wahl der Revisionsstelle 2019/2020](#revisionsstelle)

Die virtuellen Urnen sind vom 13. bis zum 23. Dezember 2019 geöffnet. 

**${numVotes} Ihrer Kolleginnen und Kollegen haben bereits abgestimmt.**
`}
                <Collapsible>{md`
**Wer kann abstimmen?**  
Abstimmen können alle Personen, die am 13. Dezember 2019 Mitglied der Genossenschaft Project R waren (und es bis zur Stimmabgabe sind). Wenn Sie ein Monatsabo der Republik abgeschlossen haben, können Sie leider nicht abstimmen.

**Wie gebe ich meine Stimme ab?**  
Wenn Sie Ihre Stimme einmal abgegeben und bestätigt haben, können Sie sie nicht mehr zurücknehmen. Für die Abstimmungen wählen Sie «Ja» oder «Nein», oder Sie legen sie leer ein, indem Sie keine Antwort auswählen. Dann klicken Sie auf «Abstimmen» und «Stimme bestätigen».

**Wie werden die Abstimmungen ausgezählt?**  
Sie haben, wie jedes Mitglied, eine Stimme für jede Abstimmungsfrage. Sie können Ihre Stimme leer einlegen und damit zum Ausdruck bringen, dass Sie die Frage nicht beantworten können oder wollen. Wir weisen die leeren Stimmen aus, sie zählen für die Stimmbeteiligung, für die Beschlussfassung zählen sie jedoch nicht. Mit anderen Worten: Ein Traktandum gilt als angenommen, wenn mehr als die Hälfte der Personen, die teilgenommen haben, «Ja» gestimmt haben – ohne Berücksichtigung der Enthaltungen.

**Wie sieht der Zeitplan aus?**

${13}. Dezember bis 23. Dezember um Mitternacht: Die Mitglieder von Project R stimmen ab.  
${27}. Dezember: Wir geben die Abstimmungsresultate bekannt.

**Statuten und Finanzierung**  
Die detaillierten Abstimmungsbedingungen finden Sie in den [Statuten von Project R](https://www.republik.ch/statuten). Im Newsletter vom November 2017 finden Sie weitere Informationen [zu den beiden Organisationen und zur Finanzierung](https://project-r.construction/newsletter/2017-11-22-finanzierung).
                `}</Collapsible>

                {md(mdComponents)`
## Geschäftsbericht

Mit Ihrem Jahresbeitrag haben Sie uns viel Geld anvertraut. Sie haben ein Recht darauf, zu wissen, was damit geschehen ist, und über den Geschäftsbericht abzustimmen. 

Die Lektüre lohnt sich auch, falls Sie sich nicht für Zahlen interessieren. Wir haben für Sie publizistische Höhepunkte und Impressionen aus der Redaktion zusammengestellt und stellen das Team und den Genossenschaftsrat vor.

Über die weiteren drei Teile des [Geschäftsberichts](https://cdn.republik.space/s3/republik-assets/assets/can/Republik_Geschaeftsbericht_2018-2019.pdf) stimmen Sie ab. Daraus das Wichtigste:

**Lagebericht** (Seite 3 bis 12)

 - Wir konnten im letzten Geschäftsjahr 4483 neue Mitglieder gewinnen. Doch die Gesamtzahl ist von 19’618 auf 16’138 gesunken, da die Erneuerungsrate der Mitgliedschaften bei rund 60% lag. Die Verluste konnten nicht durch neue Mitgliedschaften kompensiert werden. 
 - Die Anzahl Monatsabonnentinnen blieb stabil bei rund 1700.
 - Die Finanzierung durch die Leser betrug 70%. 
 - Im Frühsommer 2019 wurden die monatlichen Ausgaben um 10% gesenkt.

**Konsolidierte Jahresrechnung** (Seiten 34 bis 49)

- Dies sind die Rechnungen der Project R Genossenschaft und der Republik AG zusammengenommen.
- Die flüssigen Mittel betrugen Ende Geschäftsjahr rund 2,3 Millionen Franken – 0,9 Millionen weniger als ein Jahr zuvor.
- Der konsolidierte Verlust betrug rund 5,4 Millionen Franken. Die Mitgliederbeiträge sind hier nicht eingerechnet, da sie in der Buchhaltung keinen Ertrag darstellen.
- Für die Nichtbuchhalter eine stark vereinfachte Milchbüechli-Rechnung: Einnahmen: 4,5 Millionen Franken. Ausgaben: 6,2 Millionen Franken. Defizit: 1,7 Millionen Franken.
- Für die Buchhalter unter Ihnen: Die Mitgliederbeiträge wurden in das Eigenkapital gebucht, das den Verlust von rund 5,4 Millionen Franken trägt. Aus diesem Grund ist die Veränderung des Eigenkapitals zentral. Die Mitgliederbeiträge betrugen rund 3,8 Millionen Franken. Hinzu kamen Erträge aus Monatsabos, Spenden und anderen Erträgen von rund 0,7 Millionen (Total 4,5 Millionen). Dem gegenüber standen Aufwand, Finanz- und Fondsergebnis und weitere Minderung des Eigenkapitals im Wert von rund 6,2 Millionen Franken. Das Eigenkapital hat somit um rund 1,7 Millionen Franken abgenommen (4,5 – 6,2 Millionen) und belief sich per Ende Juni 2019 auf rund 0,2 Millionen Franken. Das bedeutet, dass die Fortführung des Betriebes nicht nachhaltig gesichert ist.

**Revisionsbericht** (Seite 50)

 - Die Revisionsstelle hat die konsolidierte Jahresrechnung geprüft und empfiehlt, sie zu genehmigen.
 - Sie weist darauf hin, dass das interne Kontrollsystem noch nicht vollständig dokumentiert ist.
 - Sie weist auch darauf hin, dass eine wesentliche Unsicherheit an der Fortführungsfähigkeit besteht.

Der Vorstand und der Genossenschaftsrat von Project R legen Ihnen den [Geschäftsbericht 2018/2019](https://cdn.republik.space/s3/republik-assets/assets/can/Republik_Geschaeftsbericht_2018-2019.pdf) zur Genehmigung vor und bitten um Ihre Zustimmung.
`}
                <Collapsible>{md`
**Was, wenn der Geschäftsbericht abgelehnt wird?**  
Dann wird es richtig kompliziert. Zum Beispiel könnte der Vorstand nicht entlastet werden. Natürlich ist es Ihr gutes Recht, den Geschäftsbericht abzulehnen. Aber wir würden uns sehr wünschen, dass Sie uns in der [Abstimmungsdebatte](/vote/dez19/diskutieren) dazu vorher kurz anschreiben. Vielleicht finden wir einen gemeinsamen Weg.

**Warum haben wir kein vollständig dokumentiertes internes Kontrollsystem?**  
Als junges Unternehmen verändern sich unsere Prozesse und Verantwortlichkeiten immer noch relativ schnell – und damit auch das Kontrollsystem. Die Dokumentation müsste dann laufend angepasst werden, was kein verhältnismässiger Einsatz von Zeit und Geld wäre. Sobald wir genug Kontinuität haben, werden wir das Kontrollsystem auch ordnungsgemäss dokumentieren.

**Warum besteht eine wesentliche Unsicherheit an der Fortführungsfähigkeit?**  
Ganz einfach: weil uns das Geld ausgeht. Wenn wir im laufenden Geschäftsjahr gleich wirtschaften wie im letzten, können wir die Republik nicht fortführen. Deshalb haben wir uns ambitionierte [Ziele bis Ende März gesetzt, die Fortführung der Republik an diese Ziele geknüpft – und das transparent an alle Mitglieder kommuniziert](https://www.republik.ch/cockpit).

**Haben Sie Fragen?**  
Schreiben Sie uns in der [Abstimmungsdebatte](/vote/dez19/diskutieren). Auch wenn Sie von den Revisoren zur Durchführung und zum Ergebnis der Prüfung etwas wissen möchten. Wir sammeln die Fragen an die Revisionsstelle bis zum 17. Dezember, und Sie erhalten in der Abstimmungsdebatte bis zum 19. Dezember eine Antwort.
                `}</Collapsible>

                <Voting slug={'gen1819report'} />
                {md(mdComponents)`
## Jahresrechnung Project R

Die zweite Frage dreht sich um die Finanzen der Project R Genossenschaft für sich betrachtet. Das Wichtigste in Kürze:

- Die flüssigen Mittel betrugen Ende Geschäftsjahr rund 1,9 Millionen Franken
- Der Verlust betrug rund 4,8 Millionen Franken. Die Einnahmen aus Mitgliedsbeiträgen von 3,8 Millionen sind dabei nicht eingerechnet, da sie direkt ins Eigenkapital fliessen und somit in der Buchhaltung keinen Ertrag darstellen.  
- Deshalb ist das Eigenkapital der zentrale Wert: Es hat um rund 0,9 Millionen Franken abgenommen und belief sich per Ende Juni 2019 auf rund 0,9 Millionen Franken. 
- Die Revisionsstelle weist wiederum auf die fehlende Dokumentation des internen Kontrollsystems hin und empfiehlt, die Jahresrechnung zu genehmigen.

Der Vorstand und der Genossenschaftsrat von Project R legen Ihnen die [Jahresrechnung 2018/2019 der Project R Genossenschaft](https://cdn.republik.space/s3/republik-assets/assets/can/Jahresrechnung_Project-R_2018-2019.pdf) zur Genehmigung vor und bitten um Ihre Zustimmung.
`}
                <Collapsible>{md`
**Was, wenn die Jahresrechnung abgelehnt wird?**  
Nun, dann wird es richtig kompliziert. Wir könnten zum Beispiel die Steuererklärung für die Genossenschaft nicht einreichen. Natürlich ist es Ihr gutes Recht, die Jahresrechnung abzulehnen. Aber wir würden uns sehr wünschen, dass Sie uns in der [Abstimmungsdebatte](/vote/dez19/diskutieren) dazu vorher kurz anschreiben. Vielleicht finden wir einen gemeinsamen Weg.

**Haben Sie Fragen?**  
Schreiben Sie uns in der [Abstimmungsdebatte](/vote/dez19/diskutieren). Auch wenn Sie von den Revisoren zur Durchführung und zum Ergebnis der Prüfung etwas wissen möchten. Wir sammeln die Fragen an die Revisionsstelle bis zum 17. Dezember, und Sie erhalten in der Abstimmungsdebatte bis zum 19. Dezember eine Antwort.
                `}</Collapsible>

                <Voting slug={'gen1819accounts'} />

                {md(mdComponents)`
## Entlastung

Der Vorstand und die Mitarbeitenden der Project R Genossenschaft haben im Geschäftsjahr 2018/2019 mit Ihren Mitgliedsbeiträgen gewirtschaftet und sind für diese Tätigkeiten verantwortlich. Der Vorstand und der Genossenschaftsrat stellen den Antrag, die Entlastung zu erteilen. Stimmen Sie ab!
`}
                <Collapsible>{md`
**Was bedeutet die Entlastung?**  
Wir müssen hier genau sein. Darum haben wir unseren Anwalt gebeten, diese Erklärung zu formulieren: «In einer Genossenschaft liegt es in der Kompetenz der Gesamtheit der Mitglieder, dem Vorstand die Décharge/Entlastung zu erteilen ([Art. 879 Abs. 2 Ziff. 4 OR](https://www.admin.ch/opc/de/classified-compilation/19110009/index.html#a879)). Mit der Fassung des Entlastungsbeschlusses verzichtet die Genossenschaft auf die Geltendmachung von Verantwortlichkeitsansprüchen gegenüber dem Vorstand für dessen Tätigkeit während des abgelaufenen Geschäftsjahres. Die Genossenschaft entlässt den Vorstand mit anderen Worten aus der Haftung. Die Wirkung der Décharge ist insofern begrenzt, als sie nur für Sachverhalte gilt, die der Gesamtheit der Mitglieder zum Zeitpunkt der Décharge bekannt waren.

Die Entlastung gilt gegenüber den Mitgliedern des Vorstands sowie gegenüber jenen Personen, welche Weisungen des Vorstands entgegennehmen und ausführen.»

**Haben Sie Fragen?**  
Schreiben Sie uns in der [Abstimmungsdebatte](/vote/dez19/diskutieren).
                `}</Collapsible>

                <Voting slug={'gen19discharge'} />

                {md(mdComponents)`
## Revisionsstelle

Kommen wir zur letzten Frage. In den vergangenen zwei Jahren hat die BDO AG unsere Finanzen geprüft und anschliessend den Revisionsbericht verfasst. Sie kennt unsere Organisation sehr genau und wir möchten die Zusammenarbeit mit ihr fortsetzen. Der Genossenschaftsrat und der Vorstand bitten Sie darum, die [BDO AG (Zürich)](https://zh.chregister.ch/cr-portal/auszug/auszug.xhtml?uid=CHE-105.952.747) als Revisionsstelle zu bestätigen.
`}
                <Collapsible>{md`
**Was, wenn der Vorschlag abgelehnt wird?**  
Wir würden das abklären – wahrscheinlich müssten Vorstand und Genossenschaftsrat dann eine weitere Abstimmung mit einem neuen Wahlvorschlag durchführen.

**Warum schon wieder?**  
Sie haben die Revisionsstelle im Sommer 2019 bestätigt, und damit konnte diese die Finanzen des vergangenen Geschäftsjahres prüfen. In [Artikel 35 unserer Statuten](https://www.republik.ch/statuten) ist festgelegt, dass die Revisionsstelle jedes Jahr gewählt werden muss. Heute geht es darum, ob die BDO auch das laufende Geschäftsjahr prüfen und im Jahr 2020 die Revisionsberichte erstellen soll.
                `}</Collapsible>
                <Voting slug={'gen1920revision'} />

                {!hasEnded && (
                  <Body dangerousHTML={vt('vote/201912/nextsteps')} />
                )}
                {userIsDone && (
                  <div {...styles.thankyou}>
                    <RawHtml
                      type={P}
                      dangerouslySetInnerHTML={{
                        __html: vt('vote/201912/thankyou')
                      }}
                    />
                  </div>
                )}
                {actionBar}
                <P>
                  <A href='/meta'>{vt('vote/201912/back')}</A>
                </P>
              </Fragment>
            )
          }}
        />
      </Frame>
    )
  }
}

const votingsQuery = VOTINGS.map(
  ({ slug }) => `
  ${slug}: voting(slug: "${slug}") {
    id
    userHasSubmitted
    userSubmitDate
    userIsEligible
    beginDate
    endDate
    description
    turnout {
      eligible
      submitted
    }
    groupTurnout {
      eligible
      submitted
    }
    result {
      options {
        count
        winner
        option {
          id
          label
        }
      }
    }
    discussion {
      id
      path
      comments {
        id
        totalCount
      }
    }
   }
`
).join('\n')

const query = gql`
  query votePage {
    me {
      id
      address {
        name
        line1
        postalCode
        city
        country
      }
    }
    ${votingsQuery}
  }
`

export default compose(voteT, graphql(query))(VotePage)
