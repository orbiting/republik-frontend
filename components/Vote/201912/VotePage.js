import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import {
  Body,
  Heading,
  Section,
  Small,
  Title,
} from '../text'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Frame from '../../Frame'
import { DiscussionIconLinkWithoutEnhancer } from '../../Discussion/IconLink'
import { Link } from '../../../lib/routes'
import SignIn from '../../Auth/SignIn'
import Collapsible from '../Collapsible'
import Voting from '../Voting'
import {
  colors,
  linkRule,
  Interaction,
  mediaQueries,
  RawHtml,
  FigureImage,
  FigureCaption
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'
import voteT from '../voteT'
import { CDN_FRONTEND_BASE_URL, PUBLIC_BASE_URL } from '../../../lib/constants'
import { getVotingStage, VOTING_STAGES } from '../votingStage'
import ActionBar from '../../ActionBar'
import Loader from '../../Loader'
import VoteInfo from './VoteInfo'
import AddressEditor from '../AddressEditor'
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
    margin: '0 0 20px 0',
    [mediaQueries.lUp]: {
      margin: '30px 0'
    }
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
    background: colors.primaryBg,
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
      image: `${CDN_FRONTEND_BASE_URL}/static/social-media/vote-dez19.png`
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

            const missingAdress = userIsEligible && !me.address

            const dangerousDisabledHTML = missingAdress
              ? vt('common/missingAddressDisabledMessage')
              : undefined

            const actionBar = (
              <div {...styles.actions}>
                <ActionBar
                  url={`${PUBLIC_BASE_URL}/vote/dez19`}
                  title={vt('vote/201912/page/title')}
                  tweet={vt('vote/201912/sm/tweet')}
                  emailSubject={vt('vote/201912/sm/emailSubject')}
                  emailBody={vt('vote/201912/sm/emailBody')}
                />
                {discussion && (
                  <DiscussionIconLinkWithoutEnhancer
                    discussionId={discussion.id}
                    path={discussion.path}
                    discussionCommentsCount={
                      discussion.comments
                        ? discussion.comments.totalCount
                        : undefined
                    }
                    style={{ marginLeft: 5, lineHeight: 0 }}
                  />
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
                {missingAdress && (
                  <Fragment>
                    <a {...styles.anchor} id='adresse' />
                    <H2>{vt('common/missingAddressTitle')}</H2>
                    <P>{vt('common/missingAddressBody')}</P>
                    <div style={{ margin: '30px 0' }}>
                      <AddressEditor />
                    </div>
                  </Fragment>
                )}
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
Sehr geehrte Verlegerin, sehr geehrter Verleger

Herzlich willkommen zur dritten Urabstimmung von Project R. Viele von Ihnen haben bereits Übung: Im Herbst 2018 haben Sie gewählt und über die Finanzen abgestimmt und im Sommer 2019 die Revisionsstelle bestätigt sowie das Budget verabschiedet.

Dieses Mal geht es um die Genehmigung des  vergangenen Geschäftsjahres. Oder im Fachjargon: Das sind die Traktanden dieser Urabstimmung: 

 - [Geschäftsbericht 2018/2019](#geschaftsbericht)
 - [Jahresrechnung Project R 2018/2019](#jahresrechnung)
 - [Entlastung des Vorstandes](#entlastung)
 - [Wahl der Revisionsstelle 2019/2020](#revisionsstelle)

Die virtuellen Urnen sind vom 13. bis zum 23. Dezember 2019 geöffnet. **${numVotes} Ihrer Kolleginnen und Kollegen haben bereits abgestimmt.**

${(
  <Collapsible>{md`
**Wer kann abstimmen?**  
Abstimmen können alle Personen, die am 13. Dezember 2019 Mitglied der Genossenschaft Project R waren (und es bis zur Stimmabgabe sind). Wenn Sie ein Monatsabo der Republik abgeschlossen haben, können Sie leider nicht abstimmen.

**Wie gebe ich meine Stimme ab?**  
Wenn Sie Ihre Stimme einmal abgegeben und bestätigt haben, können Sie sie nicht mehr zurücknehmen. Für die Abstimmungen wählen Sie «Ja» oder «Nein» oder legen Sie leer ein, indem Sie keine Antwort auswählen. Dann klicken Sie auf «Abstimmen» und «Stimme bestätigen».

**Wie werden die Abstimmungen ausgezählt?**  
Sie haben, wie jedes Mitglied, eine Stimme für jede Abstimmungsfrage. Sie können Ihre Stimme leer einlegen und damit zum Ausdruck bringen, dass Sie die Frage nicht beantworten können oder wollen. Wir weisen die leeren Stimmen aus, für die Stimmbeteiligung zählen sie jedoch nicht. Mit anderen Worten: Ein Traktandum gilt als angenommen, wenn mehr als die Hälfte der Personen, die teilgenommen haben, «Ja» gestimmt haben – ohne Berücksichtigung der Enthaltungen.

**Wie sieht der Zeitplan aus?**

- 13. Dezember bis 23. Dezember um Mitternacht: Die Mitglieder von Project R stimmen ab.
- 14. Dezember: Wir geben die Abstimmungsresultate bekannt.

**Statuten und Finanzierung**  
Die detaillierten Abstimmungsbedingungen finden Sie in den [Statuten von Project R](https://www.republik.ch/statuten). Im Newsletter vom November 2017 finden Sie weitere Informationen [zu den beiden Gesellschaften und zur Finanzierung](https://project-r.construction/newsletter/2017-11-22-finanzierung).
  `}</Collapsible>
)}

## Geschäftsbericht

Sie haben uns mit Ihrem Jahresbeitrag viel Geld gegeben. Sie haben ein Recht darauf zu wissen, was damit geschehen ist, und über den Geschäftsbericht abzustimmen. Sie finden darin den Rückblick auf das letzte Geschäftsjahr: Konzernrechnung (Konsolidiert Jahresrechnung von Project R und der Republik), Revisionsbericht und Lagebericht. Über diese drei Teile stimmen Sie ab. Die Lektüre lohnt sich auch wegen den weiteren Teilen: Publizistische Höhepunkte, Impressionen aus der Redaktion und Vorstellung des Teams und des Genossenschaftsrats.


Die Aussage, die in diesem zugegebenermassen für Laien kryptischen Dokument steckt: Loremipsum.... Und zwar:

Loremipsum....

Loremipsum....

Loremipsum....


Der Vorstand und der Genossenschaftsrat von Project R legen Ihnen den Geschäftsbericht 2018/2019 (LINK) vor und bitten um Ihre Zustimmung.

${(
  <Collapsible>{md`
**Was, wenn der Geschäftsbericht abgelehnt wird?**  
Nun, dann wird es richtig kompliziert. Zum Beispiel könnte der Vorstand nicht entlastet werden. Natürlich ist es Ihr gutes Recht, den Geschäftsbericht abzulehnen. Aber wir würden uns sehr wünschen, dass Sie uns in der Abstimmungsdebatte (LINK) dazu vorher kurz anschreiben. Vielleicht finden wir einen gemeinsamen Weg.

**Haben Sie Fragen?**
Schreiben Sie uns in der Abstimmungsdebatte (LINK). Auch wenn Sie von den Revisoren zur Durchführung und zum Ergebnis der Prüfung etwas wissen möchten. Wir sammeln die Fragen an die Revisionsstelle bis zum 18. Dezember, und Sie erhalten in der Abstimmungsdebatte bis zum 20. Dezember eine Antwort.
  `}</Collapsible>
)}

${(
  <Voting
    slug={'gen1819report'}
    dangerousDisabledHTML={dangerousDisabledHTML}
  />
)}

## Jahresrechnung Project R

Die zweite Frage, dreht sich um die Finanzen der Project R Genossenschaft für sich betrachtet. Das wichtigste in Kürze:

Loremipsum....

Loremipsum....

Loremipsum....

Der Vorstand und der Genossenschaftsrat von Project R legen Ihnen die Jahresrechnung 2018/2019 der Project R Genossenschaft (LINK) vor und bitten um Ihre Zustimmung.

${(
  <Collapsible>{md`
**Was, wenn die Jahresrechnung abgelehnt wird?**  
Nun, dann wird es richtig kompliziert. Wir könnten zum Beispiel die Steuererklärung für die Genossenschaft nicht einreichen. Natürlich ist es Ihr gutes Recht, die Jahresrechnung abzulehnen. Natürlich ist es Ihr gutes Recht, den Geschäftsbericht abzulehnen. Aber wir würden uns sehr wünschen, dass Sie uns in der Abstimmungsdebatte (LINK) dazu vorher kurz anschreiben. Vielleicht finden wir einen gemeinsamen Weg.

**Haben Sie Fragen?**  
Schreiben Sie uns in der Abstimmungsdebatte (LINK). Auch wenn Sie von den Revisoren zur Durchführung und zum Ergebnis der Prüfung etwas wissen möchten. Wir sammeln die Fragen an die Revisionsstelle bis zum 18. Dezember, und Sie erhalten in der Abstimmungsdebatte bis zum 20. Dezember eine Antwort.
  `}</Collapsible>
)}

${(
  <Voting
    slug={'gen1819accounts'}
    dangerousDisabledHTML={dangerousDisabledHTML}
  />
)}

## Entlastung

Der Vorstand und die Mitarbeitenden der Project R Genossenschaft haben im Geschäftsjahr 2018/19 mit Ihren Mitgliederbeiträgen gewirtschaftet und sind für diese Tätigkeiten verantwortlich. Stimmen Sie ab, ob Sie dem Vorstand die Entlastung erteilen und ihn damit aus der Haftung entlassen möchten. Der Genossenschaftsrat empfiehlt ein Ja.

${(
  <Collapsible>{md`
**Was bedeutet die Entlastung?**  
Wir müssen hier genau sein. Darum haben wir unseren Anwalt gebeten, diese Erklärung zu formulieren: «In einer Genossenschaft liegt es in der Kompetenz der Gesamtheit der Mitglieder, dem Vorstand die Décharge/Entlastung zu erteilen (Art. 879 Abs. 2 Ziff. 4 OR) (LINK https://www.admin.ch/opc/de/classified-compilation/19110009/index.html#a879 ). Mit der Fassung des Entlastungsbeschlusses verzichtet die Genossenschaft auf die Geltendmachung von Verantwortlichkeitsansprüchen gegenüber dem Vorstand für dessen Tätigkeit während des abgelaufenen Geschäftsjahres. Die Genossenschaft entlässt den Vorstand mit anderen Worten aus der Haftung. Die Wirkung der Décharge ist insofern begrenzt, als sie nur für Sachverhalte gilt, die der Gesamtheit der Mitglieder zum Zeitpunkt der Décharge bekannt waren.

Die Entlastung gilt gegenüber den Mitgliedern des Vorstands sowie gegenüber jenen Personen, welche Weisungen des Vorstands entgegennehmen und ausführen.»

Der Vorstand und er Genossenschaftsrat stellen den Antrag an

**Haben Sie Fragen?**  
Schreiben Sie uns in der Abstimmungsdebatte (LINK).
  `}</Collapsible>
)}

${(
  <Voting
    slug={'gen19discharge'}
    dangerousDisabledHTML={dangerousDisabledHTML}
  />
)}

## Revisionsstelle

Kommen wir zur letzen Frage. Unsere Statuten sehen vor, dass die Revisionsstelle einmal pro Jahr zur Wahl gestellt wird. In den vergangenen zwei Jahren hat die BDO AG unsere Finanzen geprüft und anschliessend den Revisionsberichte verfasst. Wir haben gute Erfahrungen mit diesem Unternehmen gemacht und möchten die Zusammenarbeit fortsetzen. Der Genossenschaftsrat und der Vorstand bitten Sie darum, die BDO AG (Zürich) (https://zh.chregister.ch/cr-portal/auszug/auszug.xhtml?uid=CHE-105.952.747) als Revisionsstelle zu bestätigen.

${(
  <Collapsible>{md`
**Was, wenn der Vorschlag abgelehnt wird?**  
Wir würden das abklären – wahrscheinlich müssten Vorstand und Genossenschaftsrat dann eine weitere Abstimmung mit einem neuen Wahlvorschlag durchführen.

**Warum schon wieder?**  
Sie haben die Revisionstelle im Sommer 2019 bestätigt und damit konnte sie die Finanzen des vergangenen Geschäftsjahres prüfen. In Artikel 35 unserer Statuten (https://www.republik.ch/statuten) ist festgelegt, dass die Revisionsstelle jedes Jahr gewählt werden muss. Heute geht es darum, ob die BDO auch das laufende Geschäftsjahr prüfen und im 2020 die Revisionsberichte erstellen soll.
  `}</Collapsible>
)}

${(
  <Voting
    slug={'gen1920revision'}
    dangerousDisabledHTML={dangerousDisabledHTML}
  />
)}

  `}
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
                  <Link route='meta' passHref>
                    <a {...linkRule}>{vt('vote/201912/back')}</a>
                  </Link>
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

export default compose(
  voteT,
  graphql(query)
)(VotePage)
