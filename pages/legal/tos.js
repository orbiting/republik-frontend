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

Stand Dezember 2017

## 1. Geltungsbereich

Diese allgemeinen Geschäftsbedingungen («AGB») gelten für alle Personen, die bei der Republik AG ein Abonnement des digitalen Magazins «Republik» kaufen («Abonnenten/-innen»), eine Mitgliedschaft bei der Project R Genossenschaft lösen («Mitglieder»), eine Spende tätigen («Unterstützer/-innen») oder die Website www.republik.ch besuchen («Besucher/-innen»), und für alle sonstigen Vertragsverhältnisse, die sie mit der Project R Genossenschaft und der Republik AG eingehen.

Die Republik AG und die Project R Genossenschaft («Betreiberinnen») betreiben die Website www.republik.ch, auf welcher natürliche und juristische Personen ein Abonnement des digitalen Magazins «Republik» bei der Republik AG kaufen, die Project R Genossenschaft finanziell unterstützen und/oder bei ihr Mitglied werden können, und die Website www.project-r.construction.

Abonnenten/-innen, Mitglieder und Unterstützer/-innen müssen voll geschäftsfähige natürliche Personen (Mindestalter 18 Jahre) oder im Handelsregister eingetragene juristische Personen sein. Bei Abonnenten/-innen, Mitgliedern und Unterstützern/-innen, die jünger als 18 Jahre alt sind, ist das schriftliche Einverständnis des/der Erziehungsberechtigten oder des/der gesetzlichen Vertreters/Vertreterin notwendig.

Abonnenten/-innen, Mitglieder, Unterstützer/-innen und Besucher/-innen erklären durch die Nutzung der Websites www.republik.ch und www.project-r.construction oder das Anklicken der Checkbox ihr Einverständnis mit diesen AGB. Eine Nutzung liegt dann vor, wenn die Websites www.republik.ch und www.project-r.construction in einem Internetbrowser aufgerufen werden.


## 2. Leistungsumfang

Die Republik AG betreibt die Website www.republik.ch, auf welcher Besucher/-innen ein digitales Magazin «Republik» abonnieren und/oder Mitglied werden können sowie die Project R Genossenschaft unterstützen können. Für den Inhalt der Website ist die Republik AG verantwortlich. 

Urheber- und Nutzungsrechte bleiben jederzeit bei der Republik AG und richten sich im Einzelnen nach Art. 9 der vorliegenden AGB.

Benutzer/-innen entscheiden ausschliesslich in Eigenverantwortung, ob sie das digitale Magazin «Republik» abonnieren und/oder Mitglied bei der Project R Genossenschaft werden oder mit einer Spende die Project R Genossenschaft unterstützen wollen.

## 3. Kommissionen und Gebühren

Die Zahlungen der Abonnenten/-innen und Unterstützer/-innen laufen im Falle des Abonnements auf das Konto der Republik AG und im Falle des Lösens einer Mitgliedschaft oder bei einer Spende auf das Konto der Project R Genossenschaft, abzüglich Transaktionsgebühren. Die Gebühren sind von den durch die Abonnenten/-innen respektive Unterstützer/-innen gewählten Zahlungsmitteln abhängig.

Die Abonnenten/-innen respektive Mitglieder oder Unterstützer/-innen erklären sich damit einverstanden, dass die Betreiberin unabhängige Dritte mit dem Inkasso der Einzahlungen seitens der Abonnenten/-innen respektive Unterstützer/-innen auf ein Schweizer Konto beauftragen kann. Zu diesem Zweck können die Abonnenten/-innen respektive Unterstützer/-innen auch über ein elektronisches Zahlungs-Gateway an einen Zahlungsprovider weitergeleitet werden.

## 4. Verwendung der Finanzierungsmittel, Einzahlungen und Auszahlungen

Die von Abonnenten/-innen einbezahlten Beträge stehen der Republik AG zur freien Verfügung. 

Die durch Mitglieder und Unterstützer/-innen einbezahlten Beträge stehen der Project R Genossenschaft zur Verfügung, wobei diese der Republik AG einen angemessenen Beitrag für die Abonnemente entrichtet. 

Rückzahlungen an die Abonnenten/-innen und Unterstützer/-innen dürfen nur im Rahmen von Art. 12 der vorliegenden AGB vorgenommen werden und erfolgen innert 30 Tagen über die jeweiligen Konten der entsprechenden Gesellschaft.

## 5. Persönliche Angaben

Mitglieder und Unterstützer/-innen werden aufgefordert, vor der Überweisung Name, Vorname und E-Mail-Adresse, nach der Überweisung ihrer Zahlungen die Adresse, die für eine Mitgliedschaft in der Project R Genossenschaft erforderlich ist, zu erfassen. Finanzielle Unterstützungsleistungen von anonymer Seite werden nicht akzeptiert.

Mitglieder und Unterstützer/-innen der Project R Genossenschaft können selber bestimmen, ob ihre Teilnahme und die Höhe des Beitrags veröffentlicht werden dürfen oder nicht. 

Werden im Profil oder in sonstigen Bereichen des Portals absichtlich falsche, irreführende oder widerrechtliche Angaben gemacht, behält sich die Betreiberin rechtliche Schritte vor.

## 6. Datennutzung und Datenschutz

Die Datenschutzbestimmungen werden in einer separaten Erklärung festgehalten und sind integrierender Bestandteil der vorliegenden AGB.

## 7. Mitgliedschaft bei der Project R Genossenschaft

Für Mitgliedschaften bei der Project R Genossenschaft gelten die Statuten der Project R Genossenschaft.

## 8. Pflichten der Unterstützer/-innen und/oder Besucher/-innen

Für den Inhalt ihrer Anmeldung und damit für die Informationen, die sie über sich bereitstellen, sind die Abonnenten/-innen, Mitglieder, Unterstützer/-innen und/oder Besucher/-innen allein verantwortlich, und sie sichern zu, dass die von ihnen gemachten Angaben vollständig sind und der Wahrheit entsprechen.

Die Abonnenten/-innen, Mitglieder, Unterstützer/-innen und/oder Besucher/-innen verpflichten sich, die Betreiberin von jeglicher Art von Kosten, Klagen, Schäden, Verlusten oder sonstigen Forderungen freizuhalten, die durch ihre Anmeldung auf der Website www.republik.ch oder aus anderen Gründen entstehen könnten.

## 9. Immaterialgüterrechte

Die Betreiberin ist immaterial- und leistungsschutzrechtlich umfassend und exklusiv sowie örtlich und zeitlich unbeschränkt an sämtlichen selbst erstellten Inhalten ihrer Internetseiten berechtigt. Eine Vervielfältigung, Verbreitung, Verwertung oder jede andere Nutzung oder Verwendung von Inhalten, in welcher Form auch immer, ist nur mit vorgängiger schriftlicher Zustimmung der Betreiberin gestattet.

Das Herunterladen auf Speichermedien, das Ausdrucken oder jede andere Vervielfältigung von Inhalten der Website zu persönlichen oder privaten Zwecken ist erlaubt unter der Voraussetzung, dass die urheberrechtlichen Hinweise sowie andere Rechtstitel (insbesondere die Quellenangabe) ebenfalls reproduziert werden. Ungeachtet der vorstehenden Benutzung durch Dritte verbleiben sämtliche Rechte bei der Betreiberin.

## 10. Haftung

Die Betreiberin übernimmt keine Verantwortung und Haftung für den eventuellen Missbrauch von Informationen, die ihr von den Abonnenten/-innen, Mitgliedern, Unterstützern/-innen und/oder Besuchern/-innen zur Verfügung gestellt werden. Eine Haftung für technisch bedingte Übertragungsverzögerungen und/oder -fehler sowie für Ausfälle und dergleichen ist ausgeschlossen.

Schadenersatzansprüche aus Unmöglichkeit der Leistung, aus Vertragsverletzung, aus Verschulden bei Vertragsabschluss und aus unerlaubter Handlung sind, soweit nicht vorsätzliches oder grobfahrlässiges Handeln vorliegt, gegen die Betreiberin und gegen deren Erfüllungs- beziehungsweise Verrichtungsgehilfen gänzlich ausgeschlossen.

Eine Haftung für indirekte Schäden oder Folgeschäden wird wegbedungen.

Die Betreiberin übernimmt ferner keine Haftung für Leistungen Dritter, die sie im Rahmen der Vertragserfüllung bezieht. Sie haftet auch nicht für Schäden, die Mitglieder der Project R Genossenschaft, Abonnenten/-innen, Unterstützer/-innen und/oder Besucher/-innen durch das Verhalten von anderen Mitgliedern der Project R Genossenschaft, Unterstützern/-innen und/oder Besuchern/-innen erleiden.

## 11. Salvatorische Klausel

Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder unwirksam werden, wird dadurch die Gültigkeit der übrigen Bestimmungen und die Gültigkeit der darauf beruhenden Verträge im Übrigen nicht berührt. Die unwirksame Regelung ist von den Parteien durch eine wirksame zu ersetzen, die dem wirtschaftlichen Zweck der unwirksamen Regelung soweit wie möglich entspricht. Entsprechendes gilt für etwaige Lücken in den AGB oder den darauf beruhenden Verträgen.

## 12. Rücktrittsrecht

Abonnenten/-innen, Mitglieder und Unterstützer/-innen sind berechtigt, einen Kauf und die damit verbundene Zahlung innert 14 Tagen durch schriftliche Mitteilung an Republik AG, Sihlhallenstrasse 1, CH-8004 Zürich und Project R Genossenschaft Sihlhallenstrasse 1, CH-8004 Zürich ohne Angabe von Gründen zu widerrufen. Rückzahlungen erfolgen durch Gutschrift auf das Konto des/der betreffenden Unterstützers/-in auf dem ursprünglich gewählten Zahlungsweg. Hat die Betreiberin eine Dienstleistung erbracht, so muss ihr der Kunde / die Kundin Auslagen und Verwendungen ersetzen.

## 13. Gerichtsstand, anwendbares Recht

Für die vorliegenden AGB sowie die darauf beruhenden Verträge der Abonnenten/-innen, Mitglieder, Unterstützer/-innen und/oder Besucher/-innen mit der Betreiberin ist, vorbehältlich der Bestimmungen der Datenschutzerklärung und des Rücktrittsrechts gemäss Art. 12 der vorliegenden AGB, ausschliesslich Schweizer Recht anwendbar, unter Ausschluss der kollisionsrechtlichen Bestimmungen und der Bestimmungen des UN-Kaufrechts (CISG).

Ausschliesslicher Gerichtsstand ist Zürich.

## 14. Änderung der AGB

Die Betreiberin behält sich vor, die AGB jederzeit ohne Angabe von Gründen zu ändern. Die geänderten AGB gelten ab Datum der Publikation auf der Website der Betreiberin.
      `}
    </Frame>
  )
})
