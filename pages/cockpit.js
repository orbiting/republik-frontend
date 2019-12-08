import React from 'react'
import { css } from 'glamor'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'next/router'

import {
  Button,
  Editorial,
  Interaction,
  Loader,
  colors
} from '@project-r/styleguide'
import { ChartTitle, ChartLead, Chart } from '@project-r/styleguide/chart'

import md from 'markdown-in-js'

import Frame from '../components/Frame'
import { light as mdComponents } from '../lib/utils/mdComponents'

import { PackageItem, PackageBuffer } from '../components/Pledge/Accordion'

import { RawStatus } from '../components/CrowdfundingStatus'
import withT from '../lib/withT'

import { ListWithQuery as TestimonialList } from '../components/Testimonial/List'

import { CROWDFUNDING, STATUS_POLL_INTERVAL_MS } from '../lib/constants'
import withMe from '../lib/apollo/withMe'
import { Link, questionnaireCrowdSlug } from '../lib/routes'
import { swissTime } from '../lib/utils/format'

// Quelle «Mitglieder- und Abonnementzahlen» Dashboard
// Stand Verlauf Mitgliedschaften und Verlauf Monatsabonnements per 31.11.2019
// Abgerufen am 07.12.19 um 14:27
const TOTAL_NOV19 = 16799 + 1730
// Question 405 «Can Quite»
const TOTAL_CAN_QUIT = 12896

const END_DATE = '2020-03-31T10:00:00.000Z'

const formatDateTime = swissTime.format('%d.%m.%Y %H:%M')

const Accordion = withT(
  ({
    t,
    me,
    query,
    shouldBuyProlong,
    isReactivating,
    defaultBenefactor,
    questionnaire
  }) => {
    const [hover, setHover] = React.useState()

    return (
      <div style={{ marginTop: 10, marginBottom: 40 }}>
        <Interaction.P style={{ color: '#fff', marginBottom: 10 }}>
          <strong>So können Sie uns jetzt unterstützen:</strong>
        </Interaction.P>
        {shouldBuyProlong ? (
          <>
            <Link
              route='pledge'
              params={{ package: 'PROLONG', token: query.token }}
              passHref
            >
              <PackageItem
                t={t}
                dark
                crowdfundingName={CROWDFUNDING}
                name='PROLONG'
                title={isReactivating ? 'Zurückkehren' : undefined}
                hover={hover}
                setHover={setHover}
                price={24000}
              />
            </Link>
            <Link
              route='pledge'
              params={{ package: 'PROLONG', price: 48000, token: query.token }}
              passHref
            >
              <PackageItem
                t={t}
                dark
                crowdfundingName={CROWDFUNDING}
                name='PROLONG-BIG'
                hover={hover}
                setHover={setHover}
                title={
                  isReactivating
                    ? 'Grosszügig zurückkehren'
                    : 'Grosszügig verlängern'
                }
                price={48000}
              />
            </Link>
            <Link
              route='pledge'
              params={{
                package: 'PROLONG',
                membershipType: 'BENEFACTOR_ABO',
                token: query.token
              }}
              passHref
            >
              <PackageItem
                t={t}
                dark
                crowdfundingName={CROWDFUNDING}
                name='PROLONG-BEN'
                hover={hover}
                setHover={setHover}
                title={defaultBenefactor ? 'Gönner bleiben' : 'Gönner werden'}
                price={100000}
              />
            </Link>
          </>
        ) : (
          <>
            {me && me.activeMembership ? (
              <Link route='pledge' params={{ package: 'ABO_GIVE' }} passHref>
                <PackageItem
                  t={t}
                  dark
                  crowdfundingName={CROWDFUNDING}
                  name='ABO_GIVE'
                  hover={hover}
                  setHover={setHover}
                  price={24000}
                />
              </Link>
            ) : (
              <>
                <Link
                  route='pledge'
                  params={{ package: 'MONTHLY_ABO' }}
                  passHref
                >
                  <PackageItem
                    t={t}
                    dark
                    crowdfundingName={CROWDFUNDING}
                    name='MONTHLY_ABO'
                    hover={hover}
                    setHover={setHover}
                    price={2200}
                  />
                </Link>
                <Link route='pledge' params={{ package: 'ABO' }} passHref>
                  <PackageItem
                    t={t}
                    dark
                    crowdfundingName={CROWDFUNDING}
                    name='ABO'
                    hover={hover}
                    setHover={setHover}
                    price={24000}
                  />
                </Link>
                <Link
                  route='pledge'
                  params={{ package: 'BENEFACTOR' }}
                  passHref
                >
                  <PackageItem
                    t={t}
                    dark
                    crowdfundingName={CROWDFUNDING}
                    name='BENEFACTOR'
                    hover={hover}
                    setHover={setHover}
                    price={100000}
                  />
                </Link>
              </>
            )}
          </>
        )}
        <Link route='pledge' params={{ package: 'DONATE' }} passHref>
          <PackageItem
            t={t}
            dark
            crowdfundingName={CROWDFUNDING}
            name='DONATE'
            title='Spenden'
            hover={hover}
            setHover={setHover}
          />
        </Link>
        <PackageBuffer />
        <br />
        <PrimaryCTA
          me={me}
          query={query}
          questionnaire={questionnaire}
          shouldBuyProlong={shouldBuyProlong}
          isReactivating={isReactivating}
          defaultBenefactor={defaultBenefactor}
          block
        />
      </div>
    )
  }
)

const PrimaryCTA = ({
  me,
  questionnaire,
  shouldBuyProlong,
  isReactivating,
  block,
  query,
  children
}) => {
  let target
  let text
  if (shouldBuyProlong) {
    target = {
      route: 'pledge',
      params: { package: 'PROLONG', token: query.token }
    }
    text = isReactivating ? 'Zurückkehren' : 'Treu bleiben'
  } else if (!(me && me.activeMembership)) {
    target = {
      route: 'pledge',
      params: { package: 'ABO' }
    }
    text = 'Mitglied werden'
  } else if (
    questionnaire &&
    questionnaire.userIsEligible &&
    !questionnaire.userHasSubmitted
  ) {
    target = {
      route: 'questionnaireCrowd',
      params: { slug: questionnaireCrowdSlug }
    }
    text = 'Ich möchte der Republik helfen.'
  } else {
    return null
  }
  if (children) {
    return (
      <Link {...target} passHref>
        {children}
      </Link>
    )
  }
  return (
    <Link {...target} passHref>
      <Button primary block={block}>
        {text}
      </Button>
    </Link>
  )
}

const Page = ({
  data,
  t,
  me,
  actionsLoading,
  questionnaire,
  canProlongOwn,
  isReactivating,
  defaultBenefactor,
  router: { query }
}) => {
  const meta = {
    title: '🚀 Cockpit',
    description: ''
  }

  return (
    <Frame meta={meta} dark>
      <Loader
        loading={data.loading || actionsLoading}
        error={data.error}
        style={{ minHeight: `calc(90vh)` }}
        render={() => {
          const { evolution } = data.membershipStats
          const lastMonth = evolution.buckets[evolution.buckets.length - 1]

          const shouldBuyProlong =
            canProlongOwn &&
            (!me ||
              (me.activeMembership &&
                new Date(me.activeMembership.endDate) <= new Date(END_DATE)))

          return (
            <>
              <div style={{ marginBottom: 60 }}>
                <RawStatus
                  t={t}
                  people
                  money
                  crowdfundingName='SURVIVE'
                  crowdfunding={{
                    endDate: END_DATE,
                    goals: [
                      {
                        people: 19000,
                        money: 220000000
                      }
                    ],
                    status: {
                      people:
                        lastMonth.active +
                        lastMonth.new +
                        lastMonth.subscriptionsRenewalPending,
                      money: data.revenueStats.surplus.total,
                      support: data.questionnaire
                        ? data.questionnaire.turnout.submitted
                        : undefined
                    }
                  }}
                />
              </div>
              {md(mdComponents)`

# Die Republik braucht Ihre Unterstützung, Ihren Mut und Ihren Einsatz, damit sie in Zukunft bestehen kann!

      `}
              <Accordion
                me={me}
                query={query}
                shouldBuyProlong={shouldBuyProlong}
                isReactivating={isReactivating}
                defaultBenefactor={defaultBenefactor}
                questionnaire={questionnaire}
              />

              {md(mdComponents)`
Seit zwei Jahren ist die Republik jetzt da – als digitales Magazin, als Labor für den Journalismus des 21. Jahrhunderts.

Drei entscheidende Ziele haben wir uns gesetzt: eine Startfinanzierung zu finden, eine funktionierende Redaktion mit Schlagkraft aufzubauen und ein Geschäftsmodell für unabhängigen, werbefreien und leserfinanzierten Journalismus zu entwickeln.

Sie haben uns bis hier begleitet: mit ihrer Neugier, ihrer Unterstützung, ihrem Lob und ihrer Kritik. Dafür ein grosses Danke! Ohne Sie wären wir nicht hier.

Unser erstes Ziel –  Startfinanzierung – haben wir gemeinsam mit Ihnen und unerschrockenen Investoren erreicht. Das zweite Ziel ebenfalls: eine funktionierende Redaktion aufzubauen, die ordentlichen und immer öfter auch ausserordentlichen Journalismus liefert und sich weiterentwickeln will. Das dritte Ziel leider noch nicht: ein funktionierendes Geschäftsmodell für werbefreien, unabhängigen, leserfinanzierten Journalismus zu etablieren.

An der Notwendigkeit unseres gemeinsamen Projekts hat sich nichts geändert. Die grossen Verlage haben wenig Ideen ausser Fusionen. Und in der Politik sind Institutionen und Fakten weiter unter Beschuss.

Unsere Aufgabe ist, brauchbaren Journalismus zu machen. Einen, der die Köpfe klarer, das Handeln mutiger, die Entscheidungen klüger macht. Und der das Gemeinsame stärkt: die Freiheit, den Rechtsstaat, die Demokratie.

Wir sind überzeugt, dass unsere Existenz einen Unterschied machen kann. Deshalb kämpfen wir für die Republik.  

${(
  <PrimaryCTA
    me={me}
    query={query}
    questionnaire={questionnaire}
    shouldBuyProlong={shouldBuyProlong}
    isReactivating={isReactivating}
  >
    <Editorial.A style={{ color: colors.negative.text }}>
      Kämpfen Sie mit?
    </Editorial.A>
  </PrimaryCTA>
)}

## Wofür wir kämpfen

Im Prinzip funktioniert die Republik wie eine Rakete.

Zunächst braucht man Treibstoff. Den haben wir von Investoren und fast 14'000 Menschen beim Crowdfunding bekommen.

Dann folgen zwei Stufen:

Stufe 1: Du musst das Unternehmen in die Luft bringen. Und dort auf den richtigen Kurs. Das kann länger dauern. Wir haben mehr als ein Jahr gebraucht, bis Produkt, Crew und Organisation vernünftig liefen.

Stufe 2: Den stabilen Orbit erreichen. Also selbstragend werden.

Denn die Republik macht nur dann Sinn, wenn sie aus eigener Kraft überlebt. Erst dann gelingt der Hack des Systems: Wenn wir eine neues Modell für den Schweizer Medienmarkt etablieren können. Und den Beweis liefern, dass kompromissloser Journalismus ohne Werbung funktioniert.

Doch das braucht Zeit, Nerven, frisches Kapital. 

${(
  <PrimaryCTA
    me={me}
    query={query}
    questionnaire={questionnaire}
    shouldBuyProlong={shouldBuyProlong}
    isReactivating={isReactivating}
  >
    <Editorial.A style={{ color: colors.negative.text }}>
      Sind Sie an Bord?
    </Editorial.A>
  </PrimaryCTA>
)}

## Warum jetzt gerade?

«Wie geht's?» Diese Frage bringt uns ins Dilemma. Die Redaktion, das Unternehmen sind endlich gut aufgestellt. Alles läuft präziser. Noch nie hatte die gesamte Crew in der Republik so viel Schwung, Entschlossenheit und Klarheit im Kopf.

Andererseits stimmt die Rechnung nicht. Die Republik hat aktuell rund 18'600 Verlegerinnen. Das deckt mehr als 70 Prozent der Kosten. Die restlichen 30 Prozent reissen ein tiefes Loch in die Bilanz. Wir sind 2019 langsamer gewachsen als budgetiert. Das hat heftige Folgen: Bis Ende März müssen wir den Rückstand aufholen, sonst hat die Republik keine Zukunft. Schaffen wir, die zweite Stufe der Rakete zu zünden, haben wir realistische Chancen, ein tragfähiges Geschäftsmodell zu etablieren. Falls nicht, hat das noch heftigere Folgen: Dann werden wir die Republik am 31. März 2020 schliessen.

Hier einige unfreundliche Zahlen:

*   Wir haben statt wie budgetiert 8100 neue Mitglieder in diesem Jahr bisher 4000 neue Mitglieder gewonnen
*   Wir konnten 2019 neue Investoren gewinnen, Förderbeiträge erhalten und über eine halbe Million fundraisen. Das ist wunderbar. Aber weniger als die geplante 1 Million
*   Wir konnten 10 Prozent der Kosten sparen. Doch dadurch haben wir nun wenig Möglichkeiten, den Aufwand ohne Schaden zu senken.

Das alles riss ein Loch von 1.5 Millionen Franken in den Betrieb. Und das ist unternehmerisch nicht mehr lange tragbar. 

Deshalb muss die Republik jetzt die zweite Stufe zünden.

## Das sind unsere Ziele

Wir wollen weiterhin für Sie Journalismus machen, der Ihnen Hintergründe zur Gegenwart liefert. Dafür

*   müssen wir bis Ende März 19'000 Verlegerinnen an Bord haben. (Ein wenig mehr als heute.) Das ist alles andere als trivial: Wir müssen jene Verleger ersetzen, die uns in den nächsten Monaten verlassen und noch dazu gewinnen.


*   brauchen wir bis Ende März 2,2 Millionen Franken an Investorengeldern, Spenden und Förderbeiträgen. Davon haben wir 535'000 Franken bereits erhalten.

Erreichen wir diese beiden Ziele, haben wir die Ressourcen, unser gemeinsames Unternehmen in eine stabile Zukunft zu führen. 

Doch dafür brauchen wir Sie. An Bord. Und an Deck. 

(Falls Sie übrigens zu etwas noch Fragen haben, [klicken Sie hier für die Antworten](/status/faq))

`}

              <div
                {...css({
                  marginTop: 20,
                  '& text': {
                    fill: '#fff !important'
                  },
                  '& line': {
                    stroke: 'rgba(255, 255, 255, 0.4) !important'
                  },
                  '& div': {
                    color: '#fff !important'
                  }
                })}
              >
                <ChartTitle style={{ color: '#fff' }}>
                  Wie viele werden am 31. März definitiv dabei sein?
                </ChartTitle>
                <ChartLead style={{ color: '#fff' }}>
                  Anzahl bestehende, offene und neue Mitgliedschaften und
                  Monatsabos per Monatsende
                </ChartLead>
                <Chart
                  config={{
                    type: 'TimeBar',
                    color: 'action',
                    numberFormat: 's',
                    colorRange: [
                      '#FFD700',
                      '#CCAC00',
                      '#3CAD00',
                      '#2A7A00',
                      '#333333',
                      '#9970ab'
                    ],
                    x: 'date',
                    timeParse: '%Y-%m',
                    timeFormat: '%b',
                    xTicks: ['2019-12', '2020-01', '2020-02', '2020-03'],
                    height: 300,
                    padding: 55,
                    xAnnotations: [
                      {
                        x1: '2020-03',
                        x2: '2020-03',
                        label: '75% Erneuerung',
                        value:
                          TOTAL_NOV19 - TOTAL_CAN_QUIT + TOTAL_CAN_QUIT * 0.75
                      },
                      {
                        x1: '2020-03',
                        x2: '2020-03',
                        label: '50% Erneuerung',
                        value:
                          TOTAL_NOV19 - TOTAL_CAN_QUIT + TOTAL_CAN_QUIT * 0.5
                      }
                    ]
                  }}
                  values={evolution.buckets.reduce((values, month) => {
                    return values.concat([
                      {
                        date: month.label,
                        action: 'Grosszügige',
                        value: String(month.activeWithDonation)
                      },
                      {
                        date: month.label,
                        action: 'Neue grosszügige',
                        value: String(month.newWithDonation)
                      },
                      {
                        date: month.label,
                        action: 'Bestehende',
                        value: String(
                          month.activeWithoutDonation +
                            month.subscriptionsRenewalPending
                        )
                      },
                      {
                        date: month.label,
                        action: 'Neue',
                        value: String(month.newWithoutDonation)
                      },
                      {
                        date: month.label,
                        action: 'offen',
                        value: String(month.renewalPending)
                      }
                    ])
                  }, [])}
                />
                <Editorial.Note style={{ marginTop: 10, color: '#fff' }}>
                  Als grosszügig gelten alle, die mehr als CHF 240 bezahlt
                  haben. Erneuerungsquoten basierend auf allen
                  Jahresmitgliedschaften die zwischen dem 1. Dezember und 31.
                  März erneuert werden könnten. Als offen gelten
                  Jahresmitgliedschaften wo noch keine Verlängerungszahlung
                  initiiert wurde. Datenstand:{' '}
                  {formatDateTime(new Date(evolution.updatedAt))}
                </Editorial.Note>
              </div>

              {md(mdComponents)`

${(
  <PrimaryCTA
    me={me}
    query={query}
    questionnaire={questionnaire}
    shouldBuyProlong={shouldBuyProlong}
    isReactivating={isReactivating}
    defaultBenefactor={defaultBenefactor}
  >
    <Editorial.A style={{ color: colors.negative.text }}>
      Jetzt Tank füllen
    </Editorial.A>
  </PrimaryCTA>
)}

## Gemeinsam sind wir weit gekommen

Abgesehen von den Finanzen war 2019 ein grossartiges Jahr. Wir sind spürbar ein Stück vorwärts gekommen. Und haben auch einige Dinge erreicht: 

*   immer wieder haben wir aussergewöhnlichen Journalismus gemacht. Schlagkräftige Recherchen, Analysen, Reportagen und Interviews. 
*   wir haben systematisch Expertise wie Themenführerschaft in Justiz, Digitalisierung und in Klimafragen aufgebaut
*   die Redaktion so weiter entwickelt, dass sie beides kann: schnell auf wichtige Ereignisse reagieren und Hintergrund liefern
*   einen permanenten Dialog mit Ihnen aufgebaut. Und gelernt: Die Präsenz der Redaktion in den Debatten ist jetzt die Regel, nicht die Ausnahme
*   wie kein anderes Medienunternehmen berichten wir so viel über die eigene Arbeit und erzählen über die Entwicklung unseres Unternehmens.
*   haben Nachwuchs ausgebildet, – zwar wenig, aber was für einen!
*   waren für den deutschen Grimme-Preis nominiert, gewannen den Schweizer Reporterpreis und den Start-up of the year award.
*   und haben seit knapp einem Jahr ein starkes  
    Gremium, im Rücken, das uns trägt, unterstützt –  
    konstruktiv kritisiert: der Genossenschaftsrat.

## Die drei Phasen der Kampagne

**Bis Ende Januar** geht es darum, quasi die Tanks von Stufe zwei auf zu füllen. Wir haben drei nicht ganz einfache Dinge zu erledigen: 

1.  Dass viele Verleger bestätigen, dass sie trotz Risiko an Bord sind.
2.  Dass möglichst viele von Ihnen auf das Doppelt aufstocken – denn der Treibstoff, der Leben in Projekte bringt, ist: Grosszügikeit und Geld.
3.  Neue unerschrockene Investorinnen und Grossspender finden. (Falls Sie eine grössere Summe investieren wollen, schreiben Sie an: ir@republik.ch)

**Im Februar** geht es darum, den Check Up vor der Zündung zu machen. Wir reden mit Ihnen bei der Was-Sie-von-uns-brauchen-wenn-Sie-nicht-höflich-sein-wollen-Debatte. Und arbeiten an einem neugierigeren, nützlicheren Produkt.

**Im März** zündet das Triebwerk. Wir werden ein paar tausend neue Verlegerinnen gewinnen müssen. Jetzt geht es um: Wachstum. 

Am 31. März ist es dann wie immer bei einer Reise mit einer Rakete: Entweder du bist explodiert oder ein grosses Stück weiter.

Um das Ziel von 19'000 Verlegern zu erreichen, brauchen wir Reichweite. Die können wir uns jedoch weder kaufen (zu teuer), noch allein mit Journalismus erarbeiten.

Wir setzen also auf unsere wichtigste Ressource: Sie. Sie – und ihr Adressbuch, Ihr Netzwerk, Ihre Begeisterung, Ihre Skepsis. 

Wir werden eine Kampagne machen müssen, in der Sie als Multiplikatoren, Botschafter, Komplizen – nennen Sie es wie sie wollen – eine Hauptrolle spielen. 

Unser Job dabei ist, Sie regelmässig, offen und klar über den Stand der Dinge zu informieren. Und ihnen die besten Werkzeuge in die Hand zu geben: Argumente, Flyer, Mailkanonen – kurz: Propagandamaterial.

Falls Sie sich vorstellen könnten, dabei zu sein, haben wir eine kleines Formular für Sie vorbereitet. Es auszufüllen braucht genau eine Minute. Wir wären Ihnen dankbar, wenn Sie sich diese Minute nehmen würden.

${
  questionnaire && questionnaire.userHasSubmitted ? (
    'Vielen Dank fürs Ausfüllen.'
  ) : (
    <Link
      route='questionnaireCrowd'
      params={{ slug: questionnaireCrowdSlug }}
      passHref
    >
      <Button primary>Komplizin werden</Button>
    </Link>
  )
}

## Was wir bisher in der Kampagne erreicht haben:

(Liste wird - hoffentlich regelmässig - aktualisiert)

*   350’000 Franken von neuen Investoren erhalten. Danke, Luzius Meisser, danke Adrian Gasser, danke Schwyzer-Winiker-Stiftung.
*   185’000 Franken von Stiftungen erhalten. Danke, Stiftung für Medienvielfalt, Paul Schiller Stiftung, Volkart Stiftung. 

## Was Sie sofort tun können

*   Falls Sie nur eine Sache tun wollen: Erneuern Sie Ihre Mitgliedschaft! – Wenn möglich grosszügig. Wenn möglich jetzt.
*   Oder – wenn Sie nicht an Bord sind – werden Sie Mitglied der Verlagsetage!
*   Verschenken Sie die Republik, zum Beispiel zu Weihnachten – oder unter einem sonstigen Vorwand.
*   Weiter hilft uns, wenn Sie mit Ihren Freunden über uns reden. Oder unsere interessanteren Geschichten mit ihnen teilen. 

So – das war's fürs Erste. Wir würden uns freuen, wenn Sie in den nächsten vier Monaten Seite an Seite mit uns kämpfen würden.

Einfach wird das nicht – aber das hat auch niemand versprochen.

Aber wir werden guter Laune sein. Und das Unternehmen in einen stabilen Orbit katapultieren.

Wie wir hoffen: mit Ihnen. Wem sonst? 

Denn wir schaffen das nur gemeinsam. Oder gar nicht.

PS: Falls Sie noch **offene Fragen** haben: Wir haben ein rundes Dutzend der wichtigsten hier beantwortet. Falls Sie dort nichts finden, schreiben wir Ihnen gerne zurück: kontakt@republik.ch. 

## Community

## ${lastMonth.active +
                lastMonth.new +
                lastMonth.subscriptionsRenewalPending} sind treu
`}

              <TestimonialList
                membershipAfter={END_DATE}
                ssr={false}
                singleRow
                minColumns={3}
              />
              <br />

              {md(mdComponents)`

[Alle anschauen](/community) – [Statement abgeben](/einrichten)

      `}

              <Accordion
                me={me}
                query={query}
                shouldBuyProlong={shouldBuyProlong}
                isReactivating={isReactivating}
                defaultBenefactor={defaultBenefactor}
                questionnaire={questionnaire}
              />
            </>
          )
        }}
      />
    </Frame>
  )
}

const statusQuery = gql`
  query StatusPage {
    revenueStats {
      surplus(min: "2019-11-30T23:00:00Z") {
        total
        updatedAt
      }
    }
    membershipStats {
      evolution(min: "2019-12", max: "2020-03") {
        buckets {
          label
          active
          activeWithDonation
          activeWithoutDonation
          loss
          lossExpired
          lossCancelled
          new
          newWithDonation
          newWithoutDonation
          renewalPending
          subscriptionsRenewalPending
        }
        updatedAt
      }
    }
    questionnaire(slug: "${questionnaireCrowdSlug}") {
      id
      turnout {
        submitted
      }
    }
  }
`

const actionsQuery = gql`
  query StatusPageActions($accessToken: ID) {
    me(accessToken: $accessToken) {
      id
      customPackages {
        options {
          membership {
            id
            user {
              id
            }
            graceEndDate
          }
          defaultAmount
          reward {
            ... on MembershipType {
              name
            }
          }
        }
      }
    }
    questionnaire(slug: "${questionnaireCrowdSlug}") {
      id
      userIsEligible
      userHasSubmitted
    }
  }
`

export default compose(
  withT,
  withMe,
  withRouter,
  graphql(statusQuery, {
    options: {
      pollInterval: +STATUS_POLL_INTERVAL_MS
    }
  }),
  graphql(actionsQuery, {
    props: ({ data: { loading, me, questionnaire } }) => {
      const isOptionWithOwn = o =>
        o.membership && o.membership.user && o.membership.user.id === me.id
      const customPackageWithOwn =
        me &&
        me.customPackages &&
        me.customPackages.find(p => p.options.some(isOptionWithOwn))
      const ownMembership =
        customPackageWithOwn &&
        customPackageWithOwn.options.find(isOptionWithOwn).membership
      return {
        actionsLoading: loading,
        questionnaire,
        canProlongOwn: !!customPackageWithOwn,
        isReactivating:
          ownMembership && new Date(ownMembership.graceEndDate) < new Date(),
        defaultBenefactor:
          !!customPackageWithOwn &&
          me.customPackages.some(p =>
            p.options.some(
              o =>
                isOptionWithOwn(o) &&
                o.defaultAmount === 1 &&
                o.reward.name === 'BENEFACTOR_ABO'
            )
          )
      }
    },
    options: ({ router: { query } }) => ({
      variables: {
        accessToken: query.token
      }
    })
  })
)(Page)
