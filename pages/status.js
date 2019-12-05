import React, { Fragment } from 'react'
import Frame from '../components/Frame'
import { css } from 'glamor'

import md from 'markdown-in-js'
import { light as mdComponents } from '../lib/utils/mdComponents'

import { csvParse } from 'd3-dsv'

import { Button, Interaction } from '@project-r/styleguide'

import { PackageItem } from '../components/Pledge/Accordion'

import { ChartTitle, ChartLead, Chart } from '@project-r/styleguide/chart'

import { RawStatus } from '../components/CrowdfundingStatus'
import { t } from '../lib/withT'

import { ListWithQuery as TestimonialList } from '../components/Testimonial/List'

import { CROWDFUNDING } from '../lib/constants'

export default () => {
  const meta = {
    title: 'Stand der Dinge',
    description: ''
  }

  return (
    <Frame meta={meta} dark>
      <div style={{ marginBottom: 60 }}>
        <RawStatus
          t={t}
          people
          money
          crowdfundingName='SURVIVE'
          crowdfunding={{
            endDate: '2020-03-31T10:00:00.000Z',
            goals: [
              {
                people: 19000, // 17223 + 1700,
                money: 230000000,
                description:
                  'Wenn wir das Ziel von 20‘000 Mitgliedschaften und 4 Millionen erreichen haben wir die Trendwende geschaft.'
              }
            ],
            status: {
              people: 4032 + 1700,
              money: 80211200
            }
          }}
        />
      </div>
      {md(mdComponents)`

# Die Republik braucht Ihre Unterstützung, Ihren Mut und Ihren Einsatz, damit sie in Zukunft bestehen kann

      `}
      <div style={{ marginTop: 20, marginBottom: 40 }}>
        <PackageItem
          t={t}
          style={{ color: '#fff' }}
          crowdfundingName={CROWDFUNDING}
          name='PROLONG'
          setHover={() => {}}
          price={24000}
        />
        <PackageItem
          t={t}
          style={{ color: '#fff' }}
          crowdfundingName={CROWDFUNDING}
          name='PROLONG'
          setHover={() => {}}
          title='Grosszügig verlängern'
          price={48000}
        />
        <PackageItem
          t={t}
          style={{ color: '#fff' }}
          crowdfundingName={CROWDFUNDING}
          name='BENEFACTOR'
          setHover={() => {}}
          title='Gönner werden'
          price={100000}
        />
        <br />
        <Button primary block>
          Treu bleiben
        </Button>
      </div>

      {md(mdComponents)`
Seit zwei Jahren ist die Republik jetzt da – als digitales Magazin, als Labor für den Journalismus.

Drei entscheidende Ziele haben wir uns gesetzt: eine Startfinanzierung zu finden, eine funktionierende Redaktion mit Schlagkraft aufzubauen und ein Geschäftsmodell für unabhängigen, werbefreien und leserfinanzierten Journalismus zu entwickeln.

Sie haben uns bis hier begleitet: mit ihrer Neugier, ihrer Unterstützung, ihrem Lob und ihrer Kritik. Dafür ein grosses Danke! Ohne Sie wären wir nicht hier.

Unser erstes Ziel – die Startfinanzierung – haben wir gemeinsam mit Ihnen und unerschrockenen Investoren erreicht. Das zweite Ziel ebenfalls: eine funktionierende Redaktion aufzubauen, die ordentlichen und immer öfter auch ausserordentlichen Journalismus liefert und sich weiterentwickeln will. Das dritte Ziel leider noch nicht: ein funktionierendes Geschäftsmodell für werbefreien, unabhängigen, leserfinanzierten Journalismus zu etablieren.

Denn an der Notwendigkeit unseres Projekts hat sich nichts geändert. Die grossen Verlage haben wenig Ideen ausser Fusionen. Und in der Politik sind Professionalität und Fakten weiter unter Beschuss.

Unsere Aufgabe ist, brauchbaren Journalismus zu machen. Einen, der die Köpfe klarer, das Handeln mutiger, die Entscheidungen klüger macht. Und der das Gemeinsame stärkt: die Freiheit, den Rechtsstaat, die Demokratie.

Wir sind überzeugt, dass unsere Existenz einen Unterschied machen kann. Deshalb kämpfen wir für die Republik.  
Kämpfen Sie mit?

${(
  <Fragment>
    <Button primary>Klar! Erneuern!</Button>{' '}
    <Button white>Grosszügig sein.</Button>
  </Fragment>
)}

## Darum gehts jetzt

Wie geht's? Diese Frage bringt uns aktuell ins Dilemma. Die Redaktion, der Verlag sind endlich gut aufgestellt. Alles läuft spürbar präziser. Noch nie hatte die gesamte Crew der Republik so viel Schwung und Klarheit im Kopf.

Andererseits stimmt die Rechnung nicht. Die Republik hat aktuell rund 19000 Verlegerinnen. Das deckt leicht mehr als 70 Prozent der Kosten. Die restlichen 30 Prozent reissen ein tiefes Loch in unsere Kasse. Wir sind 2019 langsamer gewachsen als budgetiert. Das hat heftige Folgen: Bis Ende März müssen wir den Rückstand aufholen, sonst hat die Republik keine Zukunft. Schaffen wir diesen Kick, haben wir gute Chancen, ein tragfähiges Geschäftsmodell zu etablieren. Falls nicht, hat das noch heftigere Folgen:  
Wir werden wir die Republik am 31. März 2020 schliessen.

Hier einige unfreundliche Zahlen:

*   Wir haben statt wie budgetiert 8400 neue Mitglieder in diesem Jahr 4000 neue Mitglieder gewonnen
*   Wir konnten 2019 neue Investoren gewinnen und 800000 Franken fundraisen. Das ist wunderbar. Aber 200000 Franken weniger als geplant
*   Das Budget rechnete mit 65% Erneuerung. Es waren 60.
*   Wir konnten 10 Prozent der Kosten sparen. Nur haben wir so kurzfristig nur noch wenig Möglichkeiten, ohne Qualitätseinbussen den Aufwand zu senken 

Das alles riss das ein Loch von 1,5 Millionen Franken in die Firma. Und das ist unternehmerisch nicht mehr lange tragbar.

Deshalb braucht die Republik jetzt einen radikalen Kick.

${(
  <Fragment>
    <Button primary>DA BIN ICH DABEI</Button>{' '}
    <Button white>WAS KANN ICH TUN?</Button>
  </Fragment>
)}

## Das sind unsere Ziele

Wir wollen weiterhin für Sie einen Journalismus der das Komplexe einfach, das Dunke durchschaubar und Tatsachen zu Zusammenhängen macht. Wir wollen Ihnen so schnell wie möglich Hintergründe zur Gegenwart liefern. 

*   Wir müssen bis Ende März 19'000 Verlegerinnen an Bord haben. (So viel wie heute.) Das heisst: Wir müssen jene Verleger ersetzen, die uns in den nächsten Monaten verlassen und noch ein wenig dazu gewinnen.
*   Wir brauchen bis Ende März 2,3 Millionen Franken an Investorengeldern und Spenden. Davon wurden uns 800000 Franken bereits zugesichert.

Erreichen wir diese beiden Ziele, haben wir gute Chancen, unser gemeinsames Unternehmen in eine wirtschaftlich stabile Zukunft zu führen. 

((KAMPAGNE)) Doch dafür brauchen wir Sie. An Bord. Und an Deck.

Button: Da bin ich dabei! \[LINK]  
Button: Grosszügig sein. \[LINK]

(HIER LINKS AUF DEEP LEVEL)  
Die Republik schliessen? Warum so radikal?  
Warum spart ihr nicht einfach?  
Was hat zu dieser schwierigen Situation geführt?  
Warum glaubt ihr weiter ans Überleben?

**Wir sind gemeinsam weit gekommen**

Abgesehen von den Finanzen war 2019 ein grossartiges Jahr. Wir sind ein gutes Stück vorwärts gekommen. Und haben auch ein paar Dinge erreicht: 

*   Wir haben XXX Recherchen publiziert, darunter YYYYY; dazu haben wir systematisch Expertise wie Themenführerschaft in Justiz, Digitalisierung und in Klimafragen aufgebaut
*   die Redaktion so weiter entwickelt, dass sie beides kann: schnell auf wichtige Ereignisse reagieren und Hintergrund liefern
*   einen permanenten Dialog mit Ihnen aufgebaut, Austausch, Weiterentwicklung; die Präsenz der Redaktion in den Debatten ist endlich die Regel, nicht die Ausnahme
*   Nachwuchs ausgebildet, wenig, aber was für einen!
*   unsere Konkurrenz etwa in Sachen Layout oder Newsletter inspiriert. Wir freuen uns über ihre kluge Wahl!
*   wir sind weiter führend in Meta-Artikeln – und erklären Journalismus
*   haben eine erstaunliche Statistik bei unseren nicht immer kurzen Artikeln: xx Prozent werden zu Ende gelesen
*   wir haben uns vernetzt, die Schweiz hat auf der Landkarte der unabhängigen, leserfinanzierten Medien Europas nun ein Fähnchen
*   Frauen in Führungsfunktionen 
*   landeten in einer nationalen Umfrage über das glaubwürdigste Medium in der Kategorie Einzigartigkeit auf Platz 1 
*   waren für den deutschen Grimme-Preis nominiert, gewannen den Schweizer Reporterpreis

**Das sind die Herausforderungen**

Doch anderes schaffen wir nicht allein. Sondern nur zusammen mit Ihnen:

*   Wir müssen: Wachsen. Doch dafür brauchen wir mehr Reichweite. Die können wir uns jedoch weder kaufen (zu teuer), noch mit gutem Journalismus erarbeiten (für Zitate sind wir ärgerlicherweise auf unsere direkte Konkurrenz angewiesen).
*   Wir brauchen Liquidität – die Zeit, um unser Geschäftsmodell weiter zu entwickeln. 
*   Wir brauchen einen soliden, langfristigen Finanzplan, um in einem schrumpfenden, volatilen Markt ein neues Produkt zu etablieren. 

Daran arbeiten wir – und dazu brauchen wir Sie. 

## Was Sie sofort tun können

Nur wie? So:

*   Falls Sie nur eine Sache tun wollen: Erneuern Sie Ihre Mitgliedschaft – wenn möglich grosszügig, wenn möglich jetzt gerade
*   Verschenken Sie die Republik, zum Beispiel zu Weihnachten – oder unter einem sonstigen Vorwand
*   Kaufen Sie das beeindruckend dicke Buch «Republik bei Stromausfall» .  (geliefert mit Kerze und Zündholz) – entweder für Sie selbst oder für ihre besten Freunde oder Feinde
*   Seien an Deck statt nur Bord! Falls Sie mit uns in der März-Kampagne kämpfen wollen, füllen Sie das 1-Minuten-Formular aus (es dauert tatsäclich nicht länger)
*   Teilen die Republik in den sozialen Netzwerken, machen Sie Ihre Freunde darauf aufmerksam
*   Das eigene Herz ist nicht selten der beste Ratgeber. Verbreiten Sie Ihre Lieblingsgeschichten!

CTA

So – das war's fürs Erste. Wir würden uns freuen, wenn Sie in den nächsten drei Monaten Seite an Seite mit uns kämpfen würden.

Einfach wird das nicht – aber das hat auch niemand versprochen.

Aber wir werden guter Laune sein. Und das Ding in die Luft kriegen.  
Wie wir hoffen: mit Ihnen. Wem sonst? 

Denn wir schaffen es nur gemeinsam. Oder gar nicht.

CTA

## Community

      `}
      <div
        {...css({
          '& text': {
            fill: '#fff !important'
          },
          '& div': {
            color: '#fff !important'
          }
        })}
      >
        <ChartTitle style={{ color: '#fff' }}>
          Wie gross ist die Republik Verlegerschaft per 31. April?
        </ChartTitle>
        <ChartLead style={{ color: '#fff' }}>
          Anzahl bestehende, offene und neue Mitgliedschaften und Monatsabos per
          Monatsende
        </ChartLead>
        <Chart
          config={{
            type: 'TimeBar',
            color: 'action',
            numberFormat: 's',
            colorRange: ['#5aae61', '#fdb863', '#a6dba0', '#E7E7E7', '#9970ab'],
            padding: 30,
            x: 'date',
            timeParse: '%d.%m.%Y',
            timeFormat: '%b',
            xTicks: ['31.12.2019', '31.01.2020', '29.02.2020', '31.03.2020'],
            height: 300,
            xAnnotations: [
              {
                x1: '31.03.2020',
                x2: '31.03.2020',
                label: 'durch 75% Erneuerung',
                value: 14875
              },
              {
                x1: '31.03.2020',
                x2: '31.03.2020',
                label: 'durch 50% Erneuerung',
                value: 11250
              }
            ]
          }}
          values={csvParse(`date,action,value
31.12.2019,Bestehende,16060
31.12.2019,Grosszügige,2060
31.12.2019,Neue,38
31.12.2019,offen,300
31.01.2020,Bestehende,13940
31.01.2020,Grosszügige,2060
31.01.2020,offen,2500
29.02.2020,Bestehende,5940
29.02.2020,Grosszügige,2060
29.02.2020,offen,10500
31.03.2020,Bestehende,3940
31.03.2020,Grosszügige,2060
31.03.2020,offen,12500`)}
        />
      </div>

      {md(mdComponents)`
## 5732 sind treu
`}

      <TestimonialList singleRow minColumns={3} />
      <br />

      {md(mdComponents)`

[Alle anschauen](/community)  
[Statement abgeben](/~me)

Contact us: Haben Sie Fragen? Anmerkungen? Wollen Sie sich mit anderen Verlegern austauschen? [Kontaktieren Sie uns](mailto:kontakt@republik.ch) oder nehmen Sie an der [Debatte über die Zukunft der Republik teil](/dialog).

${(
  <Fragment>
    <Button primary block>
      Ich möchte der Republik helfen.
    </Button>
  </Fragment>
)}

      `}
    </Frame>
  )
}
