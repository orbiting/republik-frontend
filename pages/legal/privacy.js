import React from 'react'
import withData from '../../lib/apollo/withData'
import Frame from '../../components/Frame'

import md from 'markdown-in-js'
import mdComponents from '../../lib/utils/mdComponents'

export default withData(({url}) => {
  const meta = {
    title: 'Datenschutz',
    description: ''
  }

  return (
    <Frame url={url} meta={meta}>
      {md(mdComponents)`
## Datenschutzbestimmungen
Stand April 2017

Gegenstand: Die Project R Genossenschaft, Sihlhallenstrasse 1, 8004 Zürich, erfasst, verarbeitet, speichert und schützt die Daten von Personen, die auf die Seiten von republik.ch zugreifen, in Übereinstimmung mit dem Gesetz (insbesondere des Datenschutzgesetzes, DSG, SR 235). Zudem gelten die folgenden Grundsätze.

1. Die Project R Genossenschaft ergreift angemessene und notwendige Massnahmen in organisatorischer wie technischer Hinsicht, um die Daten vor unbefugtem Zugriff Dritter zu schützen.

2. Diese Datenschutzbestimmungen sind Teil der allgemeinen Geschäftsbedingungen von republik.ch. Mit der Anmeldung erklärt sich der/die Besucher*in der Website einverstanden mit der Speicherung, Verarbeitung und Nutzung seiner/ihrer persönlichen Daten gemäss diesen Datenschutzbestimmungen. 

3. Bei einem Besuch auf republik.ch protokolliert die Project R Genossenschaft automatisch technische Informationen wie aktuelle IP-Adresse, Betriebssystem oder Angaben zu Browsertyp, Referenzseiten und Verweildauer. Wenn Besucher*innen «do not track» eingeschaltet haben, werden nur Daten in der Session getrackt, wenn Besucher*innen sich einloggen. Diese Daten werden verwendet, um die Nutzung, die Sicherheit und die Systemstabilität sicherzustellen und um allfällige statistische Auswertungen zu tätigen. Mit der Anmeldung (erfolgreichen Registrierung) bei republik.ch erklärt sich die Person einverstanden, dass ihre persönlichen Daten, die für das Funktionieren des Crowdfundings der Project R Genossenschaft und/oder eine allfällige Mitgliedschaft notwendig sind, durch die Project R Genossenschaft erfasst, verarbeitet und gespeichert werden. Zu den persönlichen Daten gehören die in der Anmeldung zwingend erforderlichen Personendaten sowie weitere, freiwillig angegebenen Daten. Diese persönlichen Daten können insbesondere für den Versand von Newslettern und Informationen in Bezug auf das Projekt oder die Mitgliedschaft verwendet werden. Zudem ist die Project R Genossenschaft berechtigt, bei Zahlungen die zur Abwicklung der Zahlung notwendigen Daten an Dritte zu übermitteln. 

4. Die während des Crowdfundings gesammelten persönlichen Daten können an die Republik AG weitergegeben werden. Sie werden niemals an Dritte weiterverkauft.

5. Mit der Anmeldung erklärt der/die Besucher*in die Richtigkeit seiner/ihrer persönlichen Daten.

6. republik.ch verlinkt auf andere Websites, für deren Inhalt die Project R Genossenschaft nicht verantwortlich ist.

7. republik.ch nutzt Cookies. Die Anwendung von Cookies kann in den Einstellungen eines Browserprogramms ausgeschaltet werden. Cookies können automatisch oder manuell gelöscht werden. Es ist möglich, dass die Website republik.ch ohne Cookies nicht korrekt funktioniert. Wer darauf verzichtet, die Cookies auszuschalten, erklärt sich damit einverstanden, dass die republik.ch Cookies nutzt.

8. Angemeldete Personen können bei der Project R Genossenschaft, Sihlhallenstrasse 1, 8004 Zürich, per Brief oder E-Mail an office@project-r.construction Auskunft über die von ihrer Person gespeicherten persönlichen Daten verlangen und diese berichtigen lassen. Verlangt die angemeldete Person die Löschung ihrer Daten, wird dies nur umgesetzt, soweit diesem Ersuchen keine vertraglichen Abmachungen mit ihr entgegenstehen. Die Project R Genossenschaft kann diese Datenschutzbestimmungen jederzeit und ohne vorangehende Ankündigung ganz oder in Teilen ändern, ergänzen oder ersetzen. Es gelten die jeweils beim Besuch auf der Online-Plattform bzw. einer der zugehörigen Webseiten in Kraft stehende Version dieser Datenschutzbestimmungen.
      `}
    </Frame>
  )
})
