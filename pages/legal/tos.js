import React from 'react'
import withData from '../../lib/apollo/withData'
import Frame from '../../components/Frame'

import md from 'markdown-in-js'
import mdComponents from '../../lib/utils/mdComponents'

export default withData(({url}) => {
  const meta = {
    title: 'AGB',
    description: ''
  }

  return (
    <Frame url={url} meta={meta}>
      {md(mdComponents)`
## Allgemeine Geschäftsbedingungen 
Stand April 2017

## 1. Geltungsbereich

Diese allgemeinen Geschäftsbedingungen («AGB») gelten für alle Personen, die am Crowdfunding der Project R Genossenschaft teilnehmen («Unterstützer*innen») oder die Seite republik.ch besuchen («Besucher*innen»), und für alle Vertragsverhältnisse, die sie mit der Project R Genossenschaft und der Republik AG eingehen. 

Die Project R Genossenschaft («Betreiberin») betreibt die Website republik.ch, die es natürlichen und juristischen Personen ermöglicht, mittels Crowdfunding das Projekt «digitales Magazin Republik» der Project R Genossenschaft finanziell zu unterstützen und/oder Mitglied zu werden. 

Bei diesen Unterstützungen handelt es sich jeweils um aufschiebend bedingte Verträge zur Spende, zum Erwerb oder zur Schenkung einer Mitgliedschaft in der Project R Genossenschaft, die nur dann wirksam werden, wenn folgende zwei Bedingungen («Finanzierungsziel») kumulativ eintreten: Bis zum 31. Mai 2017 beteiligen sich a) mindestens 3000 Personen am Crowdfunding, und es kommen dadurch b) gesamthaft mindestens CHF 750\u2009000 an Spenden (Schenkungen i. S. v. Art. 239 ff. des Schweizer OR) oder Mitgliedschaftsbeiträgen zusammen. Werden die beiden Bedingungen bis zum 31. Mai 2017 nicht erfüllt, kommt kein Vertrag zustande. Das Wirksamwerden respektive das Nicht-Wirksamwerden der bedingten Verträge wird von der Project R Genossenschaft per E-Mail mitgeteilt. Nach dem Eintritt der beiden Bedingungen sind die getätigten Spenden und/oder die erworbenen und verschenkten Mitgliedschaften sofort wirksam. 

Unterstützer*innen müssen voll geschäftsfähige natürliche Personen (Mindestalter 18 Jahre) oder im Handelsregister eingetragene juristische Personen sein. Bei Unterstützer*innen, die jünger als 18 Jahre alt sind, ist das schriftliche Einverständnis des/der Erziehungsberechtigten oder des/der gesetzlichen Vertreters/Vertreterin notwendig.

Unterstützer*innen und Besucher*innen erklären durch die Nutzung der Website republik.ch und das Anklicken der Checkbox ihr Einverständnis mit diesen AGB. Eine Nutzung liegt dann vor, wenn republik.ch in einem Internetbrowser aufgerufen wird.

## 2. Leistungsumfang

Die Project R Genossenschaft betreibt die Website republik.ch, auf welcher Besucher*innen das Projekt «digitales Magazin Republik» finanziell unterstützen und/oder Mitglied werden können. Für deren Inhalt, für die offerierten Belohnungen und für die Realisierung ist die Project R Genossenschaft verantwortlich. Urheber- und Nutzungsrechte bleiben jederzeit bei der Project R Genossenschaft und richten sich im Einzelnen nach Ziff. 9. Benutzer*innen entscheiden ausschliesslich in Eigenverantwortung, ob sie das Projekt «digitales Magazin Republik» unterstützen und/oder Mitglied werden wollen. 

## 3. Kommissionen und Gebühren

Die Zahlungen der Unterstützer*innen laufen während des Crowdfundings auf das Konto der Project R Genossenschaft, abzüglich Transaktionsgebühren. Die Gebühren sind von den durch die Unterstützer*innen gewählten Zahlungsmitteln abhängig.

Die Unterstützer*innen erklären sich damit einverstanden, dass die Betreiberin unabhängige Dritte mit dem Inkasso der Einzahlungen seitens Unterstützer*innen auf einem Schweizer Konto beauftragen kann. Zu diesem Zweck können die Unterstützer*innen auch über ein elektronisches Zahlungs-Gateway an einen Zahlungsprovider weitergeleitet werden. 

Diese Gebühren-Aufteilung gilt auch für den Fall, dass das Finanzierungsziel übertroffen wird, wobei in diesem Fall keine Rückerstattung der das Finanzierungsziel übertreffenden Spenden oder Mitgliedsbeiträgen an die Unterstützer*innen erfolgt.

Wird das Finanzierungsziel nicht erreicht, werden die einbezahlten Beträge den Unterstützer*innen zurückerstattet, abzüglich der Transaktionsgebühren.

## 4. Verwendung der Finanzierungsmittel, Einzahlungen und Auszahlungen

Die von den Unterstützer*innen einbezahlten Beträge werden für die Dauer des Crowdfundings von der Betreiberin auf einem eigenen Konto verwaltet.

Nach erfolgreichem Abschluss des Crowdfundings (Erreichung oder Übertreffung des Finanzierungsziels) stehen diese Mittel der Project R Genossenschaft zur freien Verfügung.

Rückzahlungen an die Unterstützer*innen dürfen nur im Rahmen von Ziff. 3 Abs. 4 und Ziff. 12 vorgenommen werden und erfolgen innert 30 Tagen über das Konto der Betreiberin.

## 5. Persönliche Angaben

Die Unterstützer*innen werden aufgefordert, nach der Überweisung ihrer Zahlungen persönliche Angaben, die für eine Mitgliedschaft in der Project R Genossenschaft erforderlich sind, zu erfassen. Finanzielle Unterstützungsleistungen von anonymer Seite werden nicht akzeptiert. Spender*innen und Mitglieder der Project R Genossenschaft können selber bestimmen, ob ihre Teilnahme und die Höhe des Beitrags veröffentlicht werden dürfen oder nicht.

Werden im Profil oder in sonstigen Bereichen des Portals absichtlich falsche, irreführende oder widerrechtliche Angaben gemacht, behält sich die Betreiberin rechtliche Schritte vor.

## 6. Datennutzung und Datenschutz

Die Datenschutzbestimmungen werden in einem separaten Reglement festgehalten.

## 7. Mitgliedschaft bei Project R Genossenschaft

Für Mitgliedschaften bei der Project R Genossenschaft gelten die Statuten der Project R Genossenschaft.

## 8. Pflichten der Unterstützer- und/oder Besucher*innen

Für den Inhalt ihrer Anmeldung zur Teilnahme am Crowdfunding und damit für die Informationen, die sie über sich bereitstellen, sind die Unterstützer- und/oder Besucher*innen allein verantwortlich und sichern zu, dass die von ihnen gemachten Angaben vollständig sind und der Wahrheit entsprechen.

Die Unterstützer- und/oder Besucher*innen verpflichten sich, die Betreiberin von jeglicher Art von Kosten, Klagen, Schäden, Verlusten oder sonstigen Forderungen freizuhalten, die durch ihre Anmeldung auf der Website republik.ch bzw. Teilnahme am republik.ch-Crowdfunding oder aus anderen Gründen entstehen könnten.

## 9. Immaterialgüterrechte

Die Betreiberin ist immaterial- und leistungsschutzrechtlich umfassend und exklusiv sowie örtlich und zeitlich unbeschränkt an sämtlichen selbst erstellten Inhalten ihrer Internetseiten berechtigt. Eine Vervielfältigung, Verbreitung, Verwertung oder jede andere Nutzung oder Verwendung von Inhalten, in welcher Form auch immer, ist nur mit vorgängiger schriftlicher Zustimmung der Betreiberin gestattet. 

Das Herunterladen auf Speichermedien, das Ausdrucken oder jede andere Vervielfältigung von Inhalten der Website zu persönlichen oder privaten Zwecken ist erlaubt unter der Voraussetzung, dass die urheberrechtlichen Hinweise sowie andere Rechtstitel (insbesondere Quellenangabe) ebenfalls reproduziert werden. Ungeachtet der vorstehenden Benutzung durch Dritte verbleiben sämtliche Rechte bei der Betreiberin.

## 10. Haftung

Die Betreiberin übernimmt keine Verantwortung und Haftung für den eventuellen Missbrauch von Informationen, die ihr von den Unterstützer- und/oder Besucher*innen zur Verfügung gestellt werden. Eine Haftung für technisch bedingte Übertragungsverzögerungen und/oder -fehler sowie für Ausfälle und dergleichen ist ausgeschlossen.

Schadenersatzansprüche aus Unmöglichkeit der Leistung, aus Vertragsverletzung, aus Verschulden bei Vertragsabschluss und aus unerlaubter Handlung sind, soweit nicht vorsätzliches oder grobfahrlässiges Handeln vorliegt, gegen die Betreiberin und gegen deren Erfüllungs- bzw. Verrichtungsgehilfen gänzlich ausgeschlossen.

Eine Haftung für indirekte Schäden oder Folgeschäden wird wegbedungen.

Die Betreiberin übernimmt ferner keine Haftung für Leistungen Dritter, die sie im Rahmen der Vertragserfüllung bezieht. Sie haftet auch nicht für Schäden, die Mitglieder der Project R Genossenschaft oder Unterstützer- und/oder Besucher*innen durch das Verhalten von anderen Mitgliedern der Project R Genossenschaft, Unterstützer- und/oder Besucher*innen erleiden.

## 11. Salvatorische Klausel

Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder unwirksam werden, wird dadurch die Gültigkeit der übrigen Bestimmungen und die Gültigkeit der darauf beruhenden Verträge im Übrigen nicht berührt. Die unwirksame Regelung ist von den Parteien durch eine wirksame zu ersetzen, die dem wirtschaftlichen Zweck der unwirksamen Regelung soweit wie möglich entspricht. Entsprechendes gilt für etwaige Lücken in den AGB oder den darauf beruhenden Verträgen.

## 12. Rücktrittsrecht

Unterstützer*innen, die in einem Mitgliedstaat der Europäischen Union wohnhaft sind, sind berechtigt, einen Kauf und die damit verbundene Zahlung innert 14 Tagen durch schriftliche Mitteilung an Project R Genossenschaft, Sihlhallenstrasse 1, 8004 Zürich, Schweiz, ohne Angabe von Gründen zu widerrufen. Rückzahlungen erfolgen durch Gutschrift auf das Konto der betreffenden Unterstützer*in auf dem ursprünglich gewählten Zahlungsweg.

## 13. Gerichtsstand, anwendbares Recht

Für die vorliegenden AGB sowie die darauf beruhenden Verträge der Unterstützer- und/oder Besucher*innen mit der Betreiberin ist, vorbehältlich des Rücktrittsrechts gemäss Ziff. 12, ausschliesslich Schweizer Recht anwendbar, unter Ausschluss der kollisionsrechtlichen Bestimmungen und der Bestimmungen des UN-Kaufrechts (CISG).

Ausschliesslicher Gerichtsstand ist Zürich.

## 14. Änderung der AGB

Die Betreiberin behält sich vor, die AGB jederzeit ohne Angabe von Gründen zu ändern. Die geänderten AGB gelten ab Datum der Publikation auf der Website der Betreiberin.

      `}
    </Frame>
  )
})
