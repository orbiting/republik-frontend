import React from 'react'
import Frame from '../../components/Frame'

import md from 'markdown-in-js'
import mdComponents from '../../lib/utils/mdComponents'

import { H1, P, A } from '@project-r/styleguide'

import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'

export const Content = () => md(mdComponents)`
## I. Firma, Sitz und Zweck

**Artikel 1 – Firma und Sitz**

Unter der Firma Project R Genossenschaft (Project R Cooperative; Project R Société Coopérative; Project R società cooperativa; Project R Societad Cooperativa) besteht mit Sitz in Zürich auf unbestimmte Dauer eine Genossenschaft gemäss Art. 828 ff. OR.

**Artikel 2 – Zweck**

1. Die gemeinnützige Genossenschaft und ihre Mitglieder bezwecken die Förderung der Demokratie durch Stärkung, Erhalt und Weiterentwicklung des Journalismus als vierte Gewalt; mutig, neugierig, der Wahrhaftigkeit und Unabhängigkeit verpflichtet. 
2. Die Genossenschaft setzt sich für die Vermittlung aller relevanter Informationen ein, die Bürgerinnen und Bürgern eine kritische Wissens- und Meinungsbildung und fundierte Entscheidungen ermöglichen.
3. Der öffentlichen Sache und dem Gemeinwohl verpflichtet, fördert die Genossenschaft die Teilnahme am konstruktiven Diskurs; zur Stärkung des gegenseitigen Verständnisses, diskriminierungsfrei und vielfältig.
4. Die Genossenschaft ist frei in der Wahl ihrer Mittel zur Erfüllung ihres Zwecks. Sie kann dazu unter anderem in folgenden Bereichen tätig werden: im Verlagswesen, in der Informatik, in der Rechts- und sonstigen Beratung, in der Ausbildung und in Finanzierungsaktivitäten, wie auch in allen anderen Bereichen, welche zur Erreichung ihres Zwecks dienlich sind.
5. Die Genossenschaft ist konfessionell neutral und politisch unabhängig.
6. Die Mitglieder der Genossenschaft sind bereit, die Genossenschaft und sich gegenseitig in konstruktiver Weise bei der Erreichung ihrer Ziele zu unterstützen. 
7. Die Genossenschaft will mit ihrer Tätigkeit eine positive Wirkung auf das Gemeinwohl erzielen.
8. Die Genossenschaft kann Zweigniederlassungen und Tochtergesellschaften errichten und sich an anderen Unternehmen beteiligen sowie alle Geschäfte tätigen, die direkt oder indirekt mit ihrem Zweck in Zusammenhang stehen.

**Artikel 3 – Zielerreichung**

1. Die Genossenschaft erfüllt ihren Zweck insbesondere durch:
    - a. die Entwicklung und Lancierung von neuen journalistischen Formaten;
    - b. Unterstützung von Projekten, die dem Genossenschaftszweck entsprechen;
    - c. Mittelbeschaffung;
    - d. Entwicklung von IT-Applikationen, bevorzugt Open Source;
    - e. Zurverfügungstellung und Finanzierung von Infrastruktur;
    - f. Übersetzung und Verbreitung von journalistischen Inhalten;
    - g. Erbringung und Ermöglichung von Rechts- und anderer Beratung, wie auch der Durchsetzung von rechtlichen und anderen Ansprüchen;
    - h. Ausbildung von journalistischem Nachwuchs;
    - i. Entwicklung von neuen Verbreitungskanälen für journalistische Inhalte, sei dies als Eigenentwicklung oder durch Unterstützen von Drittentwicklungen;
    - j. Unterstützung hervorragender Recherchen und journalistischer Projekte;
    - k. Anschubfinanzierung von Projekten, die dem Zweck der Genossenschaft dienen;
    - l. und Durchführung von Ausbildungs-, Informations- und Debattenveranstaltungen, insbesondere auch an Schulen und in der Öffentlichkeit.
2. Die Genossenschaft kann ihre Leistungen entgeltlich oder unentgeltlich erbringen, wobei sie die wirtschaftlichen Verhältnisse des Empfängers der Leistungen gebührend berücksichtigt. 
3. Die Genossenschaft strebt ein ausgewogenes finanzielles Resultat an, ist aber nicht gewinnstrebend. Ein allfälliger Überschuss fällt vollumfänglich in das Genossenschaftsvermögen und ist im Rahmen der Weiterentwicklung der genossenschaftlichen Aktivitäten und deren Zweckbestimmung zu verwenden. 
4. Die Genossenschaft kann sich auch über Spenden, Subventionen, Leistungsvereinbarungen und Zuwendungen finanzieren.

## II. Mitgliedschaft

**Artikel 4 – Voraussetzungen**

Die Mitgliedschaft bei der Genossenschaft ist persönlich und nicht übertragbar. Sie steht jeder natürlichen oder juristischen Person offen, die den Zweck der Genossenschaft aktiv unterstützt; ein Anspruch zur Aufnahme besteht nicht. 

**Artikel 5 – Mitgliederkategorien**

Die Genossenschaft hat nur eine Mitgliederkategorie (ordentliche Mitglieder).

**Artikel 6 – Mitgliedschaftsbeiträge**

1. Unter Vorbehalt von Artikel 8 Absatz 3 obliegt es dem Genossenschaftsrat, die Mitgliederbeiträge und die sonstigen von den Mitgliedern zu erbringenden Leistungen festzulegen. Der Genossenschaftsrat kann diese Kompetenz, wie auch die Kompetenz gemäss Artikel 8 Absatz 3, innerhalb von ihm festzulegenden Rahmenbedingungen an den Vorstand delegieren. Falls erforderlich, erlässt der Vorstand ein Beitragsreglement. 

2. Der Vorstand ist befugt, aufgrund der individuellen wirtschaftlichen Rahmenbedingungen der Mitglieder Ausnahmen bei der Höhe und den Modalitäten der Begleichung der Mitgliederbeiträge einzelner Mitglieder oder von bestimmten Gruppen von Mitgliedern zu machen. 

3. Zur Erfüllung von statutarischen Genossenschaftszwecken kann der Vorstand zusätzliche besondere Beiträge mit sachbezogener Zweckbestimmung beschliessen.

**Artikel 7 – Aufnahme und Eintritt**

1. Die Aufnahme als Mitglied erfolgt durch Abgabe einer Beitrittserklärung auf elektronischem Weg über die Website der Genossenschaft. Alternativ kann ein Beitrittsgesuch auch auf schriftlichem Weg an den Vorstand gerichtet werden. 
2. Erfolgt die Beitrittserklärung auf elektronischem Weg, so wird der Beitritt unter der (auflösenden) Bedingung der Zahlung des Mitgliederbeitrags (elektronisch über Kreditkarte oder andere Zahlungsmethoden) sofort wirksam. Bei schriftlichem Aufnahmegesuch wird die Mitgliedschaft mit Zahlung des Mitgliederbeitrags (Valuta der Gutschrift auf dem Bankkonto der Genossenschaft) wirksam.
3. Während sechzig (60) Tagen nach dem Termin der Wirksamkeit des Beitritts (vorstehend Absatz 2) kann der Vorstand einen Beitritt ohne Angabe von Gründen rückwirkend auf den Beitrittszeitpunkt für ungültig erklären. Dies erfolgt durch E-Mail (bei elektronisch erklärtem Beitritt) oder durch Brief mit Zustellbestätigung (bei schriftlichem Beitritt). Das Datum des Versands der entsprechenden Mitteilung ist für die Wahrung der Frist gemäss dieser Ziffer massgeblich. Ein bereits geleisteter Mitgliederbeitrag wird in der Regel vollumfänglich zurückerstattet.
4. Der Vorstand führt ein Mitgliederverzeichnis, das zwingend die für Zustellungen im Rahmen des Mitgliedschaftsverhältnisses gültige E-Mail-Adresse des Mitglieds (gemäss Artikel 39 Absatz 2) enthalten muss. Als Mitglied der Genossenschaft wird nur anerkannt, wer darin eingetragen ist.

**Artikel 8 – Mitgliedschaftsdauer**

1. Die Mitgliedschaft dauert genau ein Jahr ab dem Tag des Beitrittszeitpunkts (Artikel 7 Absatz 2). 
2. Vorbehältlich einer ausdrücklichen Erklärung des Mitglieds, dass die Mitgliedschaft nicht fortgesetzt werden soll, verlängert sich die Mitgliedschaft jeweils um ein weiteres Jahr. Eine Verlängerung erfolgt vorbehältlich der Zahlung des Mitgliedschaftsbeitrags (Kreditkartenbelastung zum Zeitpunkt der Verlängerung oder Zahlung des Mitgliedschaftsbeitrags mit Valuta vor dem Erneuerungsdatum); bei einer Verlängerung gilt Artikel 7 Absatz 3 analog. Die Nichtverlängerung der Mitgliedschaft ist vom betreffenden Mitglied elektronisch (E-Mail oder über das Mitgliedschaftsportal) bis spätestens zwei (2) Arbeitstage vor der Erneuerung der Genossenschaft zu übermitteln.
3. Die Dauer der Mitgliedschaft (vorstehend Absatz 1) kann vom Genossenschaftsrat einmalig oder für bestimmte Gruppen von Mitgliedern (z.B. für Mitglieder, die der Genossenschaft als Erste beigetreten sind) erstreckt werden. Dem Vorstand obliegt es, die Modalitäten festzulegen.
4. Ein Mitglied kann jederzeit elektronisch (E-Mail oder über das Mitgliedschaftsportal) den Austritt erklären.
5. Der Vorstand kann Mitglieder im Mitgliederregister streichen, denen Korrespondenz der Genossenschaft mehrmals an die im Mitgliederregister verzeichnete E-Mail-Adresse nicht zugestellt und deren Adresse mit vernünftigem Aufwand nicht ermittelt werden kann. Die Streichung tritt am Ende des laufenden Geschäftsjahrs in Rechtskraft und fällt ohne weiteres dahin, wenn die neue E-Mail-Adresse des Mitglieds bis zu diesem Zeitpunkt bekannt wird.

**Artikel 9 – Rechte der Mitglieder**

1. Die Mitglieder erwerben mit der Mitgliedschaft die ihnen als Genossenschafter/Genossenschafterinnen nach Gesetz und Statuten zustehenden Rechte. 
2. Massgeblich für das Recht zur Teilnahme an einer Urabstimmung oder Mitgliederversammlung (ordentliche oder ausserordentliche) oder für die Ausübung eines anderen Rechts ist, dass das Mitglied zum Zeitpunkt der Ankündigung der Urabstimmung bzw. der Ausübung eines anderen Rechts im Mitgliederregister aufgeführt ist. Als Mitglied wird nur anerkannt, wer darin eingetragen ist.
3. Die Mitglieder geniessen unter gleichen Bedingungen grundsätzlich die gleichen Rechte und Vorteile, welche die Genossenschaft bietet. 
4. Der Vorstand ist befugt, mit den Mitgliedern schriftliche Vereinbarungen zur Konkretisierung der individuellen Bedingungen der Nutzung der Dienstleistungen der Genossenschaft (Rechte und Pflichten) abzuschliessen. Dabei darf sie die individuellen Rahmenbedingungen und die wirtschaftliche und sonstige Leistungsfähigkeit der Mitglieder gebührend berücksichtigen. Die Fördervereinbarungen stehen den Abgeordneten des Genossenschaftsrats zur Einsicht offen.
5. Den Mitgliedern steht kein Anspruch auf Anteil am Reingewinn zu.
6. Allfällige Darlehen der Mitglieder an die Genossenschaft oder andere finanzielle Beiträge werden in der Regel nicht verzinst.
7. Die Genossenschaft leistet keine Bürgschaften.
8. Das Mitgliederregister ist nicht öffentlich, und es besteht für die Mitglieder und Dritte kein Einsichtsrecht. Der Vorstand trifft alle für den Schutz dieser Daten erforderlichen Vorkehrungen. Die Mitglieder können allerdings jederzeit erklären, dass ihre Mitgliedschaft in einem öffentlich einsehbaren Auszug aus dem Register der Mitglieder auf der Website der Genossenschaft aufgeführt wird. Diese Zustimmung kann jederzeit widerrufen werden.

**Artikel 10 – Pflichten der Mitglieder**

1. Die Mitglieder sind verpflichtet, die Zwecke der Genossenschaft aktiv zu verfolgen, ihre Interessen in guten Treuen zu wahren, eine konstruktive Debatten- und Gesprächskultur zu fördern und die Ziele der Genossenschaft zu unterstützen. Sofern abgeschlossen, haben sich die Mitglieder an individuelle Vereinbarungen mit der Genossenschaft auch bei ihrer übrigen Tätigkeit zu halten.
2. Werden den Mitgliedern ausnahmsweise Darlehen gewährt, so verpflichten sich die Mitglieder, diese entsprechend den Bestimmungen des jeweiligen Darlehensvertrags zu tilgen oder, wenn dies so vereinbart ist, durch Leisten von Arbeitstätigkeit zu amortisieren.
3. Die Mitglieder sind verpflichtet, dem Vorstand alle für die Wahrung der Genossenschaftsinteressen nötigen Angaben zu machen und im Streitfall die entsprechenden Belege und Unterlagen vorzulegen. 

**Artikel 11 – Erlöschen der Mitgliedschaft**

1. Die Mitgliedschaft erlischt:  
    * a. durch Austritt des Mitglieds (Artikel 8 Absatz 4);  
    * b. durch Nichterneuerung der Mitgliedschaft (Artikel 8 Absatz 2) oder bei Nichtbezahlen der Mitgliedschaftsbeiträge;  
    * c. durch Streichung aus dem Mitgliederregister (Artikel 8 Absatz 5);  
    * d. durch Widerruf der Mitgliedschaft durch den Vorstand bei Neueintritt (Artikel 7 Absatz 3) oder Erneuerung der Mitgliedschaft (Artikel 8 Absatz 2 i.V.m. Artikel 7 Absatz 3);  
    * e. durch Ausschluss gemäss Artikel 12;  
    * f. durch Auflösung oder Umwandlung der Genossenschaft;  
    * g. durch Liquidation oder Konkurs (anwendbar bei Mitgliedern, die juristische Personen sind); oder  
    * h. durch Tod (anwendbar bei Mitgliedern, die natürliche Personen sind).
2. In den Fällen von vorstehend Litera f und g wird der anteilige Mitgliederbeitrag zurückerstattet, der dem nicht genutzten Anteil des laufenden Mitgliedschaftsjahres des betroffenen Mitglieds entspricht. Im Falle von Litera d findet Artikel 7 Absatz 3 (letzter Satz) Anwendung. In allen übrigen Fällen verfällt ein bezahlter Mitgliederbeitrag der Genossenschaft vollumfänglich und ohne Ersatzanspruch.

**Artikel 12 – Ausschluss**

1. Der Vorstand kann ein Mitglied mit sofortiger Wirkung aus der Genossenschaft ausschliessen, wenn vom betreffenden Mitglied oder von dessen Organen statutarische Verpflichtungen missachtet oder sonst gegen die Genossenschaftsinteressen oder die Statuten verstossen wird. Dasselbe gilt beim Wegfall der Mitgliedschaftsvoraussetzungen nach Artikel 4 oder beim Nichterbringen der Beitragsverpflichtungen gemäss Artikel 6. Der Vorstand wahrt das rechtliche Gehör.
2. Gegen den Ausschluss kann das betroffene Mitglied innert dreissig (30) Kalendertagen an die nächste Sitzung des Genossenschaftsrats rekurrieren, die endgültig entscheidet. Der Vorstand bestimmt im Übrigen das Verfahren.
3. Der begründete Rekurs, zusammen mit allen erforderlichen Belegen und sonstigen Beweismitteln, ist dem Vorstand innert der in Absatz 2 genannten Frist schriftlich einzureichen und hat aufschiebende Wirkung. 

**Artikel 13 – Auslösungssumme**

Soweit mit dem betreffenden Mitglied schriftlich vereinbart, kann die Genossenschaft finanzielle Unterstützungsleistungen oder Beihilfen ganz oder anteilig zurückfordern, die an ein Mitglied geleistet wurden.

## III. Handlungsgrundsätze

**Artikel 14 – Handlungsgrundsätze**

1. Der Vorstand, die Mitglieder sowie sämtliche Organe der Genossenschaft, insbesondere auch die Abgeordneten des Genossenschaftsrats, haben im Rahmen ihrer Tätigkeit für die Genossenschaft als auch im Rahmen ihrer übrigen Aktivitäten die Auswirkungen ihres Handelns auf folgende Interessengruppen (gemeinsam als «Stakeholder» bezeichnet) zu berücksichtigen: 
die übrigen Genossenschafter/Genossenschafterinnen; 
die Mitarbeiter/Mitarbeiterinnen der Genossenschaft, ihrer Tochtergesellschaften und ihrer Zulieferer;
die Empfänger/Empfängerinnen der Dienstleistungen der Genossenschaft, ob Mitglieder oder nicht; 
die Gemeinwesen, in denen die Genossenschaft, ihre Tochtergesellschaften oder ihre Zulieferer ansässig sind; und
die kurz-, mittel- und langfristigen Interessen der Genossenschaft. 

2. Sämtliche Entscheidungsträger/Entscheidungsträgerinnen und Organe der Genossenschaft haben im Rahmen ihrer Tätigkeit den Erfolg der Genossenschaft nach bestem Wissen und Gewissen zu fördern, ohne dass von ihnen verlangt werden kann, die Belange einzelner Stakeholder oder Stakeholder-Gruppen vorrangig zu berücksichtigen.

## IV. Organisation

**Artikel 15 – Organe**

Die Organe der Genossenschaft sind:

- a. die Gesamtheit der Mitglieder (Urabstimmung);
- b. die Mitgliederversammlung;
- c. der Genossenschaftsrat;
- d. der Vorstand (Verwaltung);
- e. die Geschäftsleitung (sofern eingesetzt); und
- f. die Revisionsstelle.

## A. Gesamtheit der Mitglieder; Urabstimmung

**Artikel 16 – Oberstes Organ**

1. Die Gesamtheit der Mitglieder ist das oberste Organ der Genossenschaft. 
2. Sofern die Genossenschaft über mehr als 300 Mitglieder verfügt, fasst die Gesamtheit der Mitglieder ihre Beschlüsse in der Regel durch schriftliche Stimmabgabe (Urabstimmung). Das Ansetzen einer Mitgliederversammlung anstelle einer Urabstimmung bleibt jedoch auch dann zulässig, und sämtliche Bestimmungen, die für Urabstimmungen gelten, gelten analog auch für die Durchführung einer Mitgliederversammlung. 
3. Der schriftlich durchgeführten Urabstimmung ist die elektronische Beschlussfassung gemäss Artikel 39 Absatz 3 gleichgestellt.
4. Das Recht zur Stimmabgabe sowie zur Wahrnehmung der übrigen Rechte, die der Gesamtheit der Mitglieder zustehen, besitzen alle Mitglieder, die am Tag der ersten Einladung zur entsprechenden Urabstimmung im Mitgliederregister eingetragen sind. 
5. Jedes Mitglied hat eine Stimme.

**Artikel 17 – Einberufung**

1. Urabstimmungen finden bei Bedarf statt.
2. Urabstimmungen können durch den Vorstand, den Genossenschaftsrat, die Revisionsstelle oder die Liquidatoren/Liquidatorinnen angesetzt werden. 
3. Die Ankündigung einer Urabstimmung erfolgt gemäss Artikel 39 Absatz 2 unter Angabe der Abstimmungstraktanden und der gestellten Anträge an alle im Mitgliederverzeichnis aufgeführten Mitglieder mindestens zehn (10) Tage vor dem Datum der Urabstimmung. Die Einladung kann für zusätzliche Dokumente auf Downloads auf der Website der Genossenschaft (öffentlich zugänglicher Bereich oder geschützter Bereich, der nur den Mitgliedern zugänglich ist) verweisen.
4. Der Vorstand ist für die ordnungsgemässe Durchführung der Urabstimmung verantwortlich.


**Artikel 18 – Befugnisse**


1. Der Gesamtheit der Mitglieder stehen folgende unübertragbaren Befugnisse zu:
    - Auflösung der Genossenschaft;
    - Statutenänderungen
    - Wahl der Mitglieder des Genossenschaftsrats (Artikel 26) und dessen Präsidentin/Präsidenten;
    - Wahl der Mitglieder des Vorstands;
    - Wahl der Revisionsstelle; 
    - Abnahme der Jahresrechnung, des Revisionsberichts und des Budgets;
    - Beschlussfassung über Mitgliederinitiativen (Artikel 19); und
    - Beschlussfassung über alle Gegenstände, die der Gesamtheit der Mitglieder durch das Gesetz oder die Statuten vorbehalten sind. 
2. Überdies fasst die Gesamtheit der Mitglieder Beschluss über alle sonstigen Gegenstände, die der Vorstand, der Genossenschaftsrat, die Revisionsstelle oder die Liquidatoren/Liquidatorinnen ihr unterbreiten.
3. Der Gesamtheit der Mitglieder können auch konsultative Fragen unterbereitet werden (konsultative Urabstimmung).
4. Die Traktanden von Urabstimmungen dürfen öffentlich bekannt gegeben werden.

**Artikel 19 – Mitgliederinitiativen und Petitionen**

1. Fünf Prozent (5%) der Mitglieder, aber mindestens hundert (100) Mitglieder, können gemeinsam verlangen, dass der Gesamtheit der Mitglieder ein in ihre Kompetenz fallender Gegenstand oder eine konsultative Fragestellung unterbreitet wird («Mitgliederinitiative»). 
2. Zwei Prozent (2%) der Mitglieder, aber mindestens zwanzig (20) Mitglieder, können gemeinsam dem Vorstand ein Anliegen vortragen, mit dem Ersuchen, dieses zu prüfen, allenfalls die ihm richtig erscheinenden Schritte zu treffen oder Entscheidungsprozesse in Gang zu setzen und darüber Bericht zu erstatten («Petition»). Sofern Petitionen die Befugnisse des Genossenschaftsrats betreffen, hört der Vorstand dazu den Genossenschaftsrat an. 
3. Der Vorstand und/oder der Genossenschaftsrat können zu Mitgliederinitiativen und Petitionen zusätzliche Informationen abgeben, Annahme oder Verwerfung einer Mitgliederinitiative empfehlen oder Gegenvorschläge unterbreiten. Allfällige Gegenvorschläge gelangen zugleich mit der entsprechenden Mitgliederinitiative zur Abstimmung.
4. Der Vorstand kann den Zeitpunkt einer Abstimmung über eine Mitgliederinitiative frei bestimmen; sie hat innert zwölf (12) Monaten nach der gültigen Einreichung stattzufinden. Petitionen sind durch den Vorstand zeitnah zu behandeln. Auf offensichtlich nicht konstruktive Mitgliederinitiativen und Petitionen muss nicht eingetreten werden.
5. Mitgliederinitiativen und Petitionen sind über die zu diesem Zweck eingerichteten Interaktionsplattformen der Genossenschaft abzuwickeln (Artikel 39 Absatz 4). 

**Artikel 20 – Wahlvorschläge**

1. Ein Prozent (1%) der Mitglieder, aber mindestens zehn (10) Mitglieder, können bei Erneuerungswahlen für den Genossenschaftsrat Wahlvorschläge einreichen. 
2. Wahlvorschläge sind gültig, wenn sie acht (8) Wochen vor Ablauf der Amtsdauer des Genossenschaftsrats (Artikel 26 Absatz 2) eingereicht werden, von der erforderlichen Anzahl Mitglieder unterstützt werden und die/der Vorgeschlagene gleichzeitig bestätigt, dass sie/er dem Wahlvorschlag zustimmt. Vorgeschlagene können ihre eigene Wahl nicht unterstützen; niemand darf gleichzeitig mehr als einen Wahlvorschlag unterstützen.
3. Wahlvorschläge sind über die zu diesem Zweck eingerichteten Interaktionsplattformen der Genossenschaft einzureichen (Artikel 39 Absatz 4).
4. Unabhängig voneinander können zudem der Genossenschaftsrat und der Vorstand Wahlvorschläge machen. Sie hören sich gegenseitig zu ihren Wahlvorschlägen vorgängig an, sind aber in ihren Wahlvorschlägen frei.
5. Der Vorstand ist für die Gestaltung der Wahllisten verantwortlich. Er darf gegenüber den Mitgliedern zu den Wahlvorschlägen Empfehlungen abgeben.

**Artikel 21 – Beschlussfassung**

1. Jedes Mitglied hat eine Stimme. Bei Wahlen kann jedes Mitglied für so viele Kandidaten/Kandidatinnen stimmen, als Mandate zu vergeben sind; Kumulation ist nicht zulässig.
2. Bei der Urabstimmung sind Stellvertretung oder das Wahrnehmen von Stimmrechten für andere Mitglieder ausgeschlossen.
3. Sofern nicht das Gesetz oder diese Statuten etwas anderes bestimmen, ist eine Urabstimmung unabhängig von der Anzahl der abgegebenen Mitgliederstimmen gültig.
4. Beschlüsse werden durch die absolute Stimmenmehrheit der stimmenden Mitglieder gefasst; leere Stimmabgaben werden dabei für die Ermittlung der Stimmbeteiligung, nicht aber bei der Ermittlung der abgegebenen Stimmen oder des Stimmergebnisses mitgezählt. Zwingende gesetzliche Vorschriften oder abweichende Bestimmungen der Statuten bleiben vorbehalten. 
5. Bei Wahlen gilt das relative Mehr.
6. Beschlüsse über eine Änderung der Statuten sind mit zwei Dritteln (2/3) der abgegebenen Stimmen zu fassen.
7. Der Vorstand dokumentiert die Durchführung einer Urabstimmung in einer Weise, welche eine Überprüfung des Einhaltens der gesetzlichen und statutarischen Bestimmungen über deren Durchführung durch die Revisionsstelle möglich macht.

## B. Mitgliederversammlung

**Artikel 22 – Mitgliederversammlung anstelle einer Urabstimmung**

1. Das Ansetzen einer Mitgliederversammlung anstelle einer Urabstimmung ist zulässig, und sämtliche Bestimmungen, die für Einberufung, Befugnisse und Durchführung von Urabstimmungen gelten, gelten in diesem Fall analog, sofern anwendbar und sofern nachstehend keine besonderen Bestimmungen bestehen, auch im Falle der Durchführung einer Mitgliederversammlung. 
2. Zu Mitgliederversammlungen ist analog zu Artikel 17 Absatz 3 einzuladen, allerdings unter Einhaltung einer Einladungsfrist von mindestens zwanzig (20) Tagen (ab Versand der Einladung).

**Artikel 23 – Durchführung und Beschlussfassung**

1. Bei Durchführung einer Mitgliederversammlung können sich die Mitglieder an der Mitgliederversammlung mittels schriftlicher Vollmacht durch ein anderes Mitglied vertreten lassen. Solange die Genossenschaft nicht mehr als hundert (100) Mitglieder hat, kann ein Bevollmächtigter/eine Bevollmächtigte nicht mehr als ein Mitglied vertreten; bei mehr als hundert (100) Mitgliedern darf sich ein Mitglied nicht von mehr als zehn (10) Mitgliedern bevollmächtigen lassen.
2. Sofern nicht das Gesetz oder diese Statuten etwas anderes bestimmen, ist eine Mitgliederversammlung unabhängig von der Anzahl der vertretenen Mitgliederstimmen beschlussfähig.
3. Beschlüsse werden durch die absolute Stimmenmehrheit der vertretenen Mitglieder gefasst; jedes Mitglied hat eine Stimme. Enthaltungen werden dabei für die Ermittlung der Stimmbeteiligung, nicht aber bei der Ermittlung der abgegebenen Stimmen oder des Stimmergebnisses mitgezählt. Zwingende gesetzliche Vorschriften oder abweichende Bestimmungen der Statuten bleiben vorenthalten. 
4. Über Geschäfte, die nicht auf der Traktandenliste angekündigt worden sind, können keine Beschlüsse gefasst werden, ausser über den Antrag auf Einberufung einer ausserordentlichen Mitgliederversammlung oder Ansetzung einer Urabstimmung.
5. Bei Stimmengleichheit hat der/die Vorsitzende in der Mitgliederversammlung den Stichentscheid.
6. Im Falle der Durchführung einer Mitgliederversammlung als Universalversammlung im Sinne von Art. 884 OR kann auf die Beachtung der Formvorschriften verzichtet werden.

**Artikel 24 – Antragsrecht**

1. Jedes Mitglied hat das Recht, Anträge an die Mitgliederversammlung zu stellen. Anträge müssen zehn (10) Tage vor der Mitgliederversammlung begründet an den Vorstand eingereicht werden.
2. Über Anträge und Geschäfte, die nicht auf der Traktandenliste stehen, kann nicht Beschluss gefasst werden. 

**Artikel 25 – Tagesordnung**

1. Den Vorsitz in der Mitgliederversammlung führt die/der Vorsitzende des Vorstands, bei deren/dessen Verhinderung ein anderes Mitglied des Vorstands oder ein/eine von der Versammlung gewählter Tagespräsident/gewählte Tagespräsidentin (Versammlungsleiter/Versammlungsleiterin). Er/sie ist für die Versammlungsleitung verantwortlich und darf sämtliche Massnahmen ergreifen, die für einen geordneten Versammlungsablauf und für eine zweckmässige Verhandlung und Entscheidungsfindung erforderlich sind.
2. Der Versammlungsleiter/die Versammlungsleiterin bezeichnet einen Protokollführer/eine Protokollführerin, der/die nicht Mitglied sein muss. Über die Verhandlung und Beschlüsse der Mitgliederversammlung ist ein Protokoll zu führen, das durch den Versammlungsleiter/die Versammlungsleiterin und den Protokollführer/die Protokollführerin zu unterzeichnen ist. 
3. Die Mitglieder der Geschäftsleitung nehmen an der Mitgliederversammlung mit beratender Stimme teil. Sofern aufgrund der Tagesordnung erforderlich, soll eine Vertretung der Revisionsstelle anwesend sein.

## C. Genossenschaftsrat

**Artikel 26 – Zusammensetzung**

1. Der Genossenschaftsrat setzt sich aus mindestens zehn (10) und maximal dreissig (30) Abgeordneten zusammen, die durch die Gesamtheit der Mitglieder aus dem Kreis der Mitglieder gewählt werden. Pro fünfhundert (500) Mitglieder ist ein Abgeordneter/eine Abgeordnete zu wählen; sobald die Genossenschaft mehr als sechstausend (6000) Mitglieder hat, wird die Anzahl Abgeordneter auf dem vorgenannten Maximum von dreissig (30) Abgeordneten festgelegt.
2. Bei der Zusammensetzung des Genossenschaftsrats sind die Geschlechter, Altersgruppen, Sprachregionen und übrigen wesentlichen Kennzeichen der Mitgliederstruktur in der Zusammensetzung des Genossenschaftsrats angemessen zu berücksichtigen.
3. Die Amtsdauer des gesamten Genossenschaftsrats beträgt drei (3) Jahre; es werden jeweils Gesamterneuerungswahlen durchgeführt. Scheiden im Laufe der Amtsdauer mehr als zwanzig Prozent (20%) der Abgeordneten aus, so sind für die laufende Amtsdauer Nachwahlen durchzuführen, sofern nicht innert zwölf (12) Monaten sowieso eine Gesamterneuerung ansteht. 
4. Ein Abgeordneter/eine Abgeordnete scheidet aus dem Genossenschaftsrat aus, wenn er/sie die Mitgliedschaft in der Genossenschaft verliert. Bei Pflichtverletzungen können Abgeordnete durch den Genossenschaftsrat mittels Beschluss mit einfacher Mehrheit ausgeschlossen werden Ein Rekurs gegen einen Ausschlussbeschluss besteht nicht. Der Genossenschaftsrat wahrt das rechtliche Gehör.
5. Abgeordnete sind für maximal drei (3) aufeinanderfolgende Amtsdauern wählbar. Nach einer Amtsdauer ist mindestens ein Drittel (1/3) des Genossenschaftsrats für die nächste Amtsdauer nicht wiederwählbar. Während der Amtsdauer ausgeschiedene Abgeordnete werden diesem Drittel zugerechnet; im Übrigen entscheidet das Los. Ausgeschiedene Abgeordnete können nach einer Wartefrist von einer ganzen Amtsdauer wieder neu gewählt werden.
6. Abgeordnete dürfen nicht zugleich Mitglieder des Vorstands sein.
7. Abgeordnete erhalten kein Zeichnungsrecht für die Genossenschaft und werden nicht im Handelsregister eingetragen. 
8. Abgeordnete sind ehrenamtlich für die Genossenschaft tätig; sie erhalten Sitzungsgelder und Spesenentschädigung. Der Vorstand kann der Präsidentin/dem Präsidenten des Genossenschaftsrats zudem für ihre/seine Tätigkeit eine angemessene Aufwandentschädigung ausrichten. Der Vorstand erlässt ein Reglement über die Entschädigung des Genossenschaftsrats.

**Artikel 27 – Befugnisse**

1. Der Genossenschaftsrat hat folgende selbständige Befugnisse:
    * a. Vorberatung der zur Urabstimmung gelangenden Gegenstände und Beschlussfassung über Anträge an die Gesamtheit der Mitglieder, inklusive konsultativer Abstimmungen und Antragstellen zu Mitgliederinitiativen;
    * b. Abnahme des jährlichen Berichts des Vorstands über die Geschäftstätigkeit;
    * c. Aktivitäten im Rahmen seines eigenen Budgets; und
    * d. Beschlussfassung über die ihm vom Vorstand im Rahmen seiner Kompetenzen unterbreiteten Gegenstände.
2. Übereinstimmende Beschlüsse des Genossenschaftsrats und des Vorstands sind in folgenden Fällen erforderlich, wobei betreffend Geschäften in der alleinigen Kompetenz der Gesamtheit der Mitglieder (Artikel 18) die nachfolgenden Befugnisse nur das Recht zur Antragstellung an die Gesamtheit der Mitglieder umfasst:
    - a. Unter Vorbehalt von nachstehend Absatz 3: Einberufung von Urabstimmungen und Festlegung der Traktanden und Wahlvorschläge für den Genossenschaftsrat und für die Präsidentin/den Präsidenten des Genossenschaftsrats. 
    - b. Fusionen und Abspaltungen;
    - c. Grundsätzliche Änderungen der Geschäftspolitik;
    - d. Statutenänderungen (unter Vorbehalt von Artikel 18 Absatz 1 Litera b);
    - e. Abnahme der Jahresrechnung und des Revisionsstellenberichts und des Budgets der Genossenschaft;
    - f. Ausschluss von Abgeordneten;
    - g. Wahl oder Abberufung der Revisionsstelle; 
    - h. Festlegung der Mitgliederbeiträge und Erstreckung der Mitgliedschaftsdauer (Artikel 8 Absatz 3);
    - i. Bestimmen von Kommissionen oder Beizug von Externen (Artikel 28 Absatz 1);
    - e. Bestimmung der Anzahl der Mitglieder des Vorstands und Wahl der Mitglieder des Vorstands;
    - j. Beschlüsse über Liegenschaftengeschäfte, soweit nicht der Vorstand zuständig ist; und
    - k. Entscheidungen über Rekurse gemäss Artikel 12 Absatz 2 (Ausschluss von Mitgliedern). 
3. Können sich Genossenschaftsrat und Vorstand bei Traktanden oder Wahlvorschlägen nicht einigen, sind die Abstimmung auf jeden Fall gemäss den Weisungen des Vorstands anzusetzen. Bei der Einladung ist auf die Differenz in der Auffassung zwischen Genossenschaftsrat und Vorstand ausdrücklich hinzuweisen, und jedem dieser Organe ist angemessen Gelegenheit zum schriftlichen Darlegen seines Standpunktes in der Einladung zur Urabstimmung zu geben.
4. Der Genossenschaftsrat soll konsultativ zu wichtigen Fragen der Geschäftstätigkeit der Genossenschaft Stellung nehmen, insbesondere soll er:
    - a. den Vorstand unterstützen, ihm Anregungen geben und ihm neue Betätigungsfelder für die Genossenschaft aufzeigen und aktiv ermöglichen;
    - b. dem Vorstand Anregungen zur Mittelbeschaffung und zum Mitteleinsatz geben;
    - c. mindestens jährlich einen Bericht des Vorstands über die Tätigkeit der Genossenschaft beraten; und
    - d. jährlich einen Bericht über seine eigenen Aktivitäten zur Unterstützung der Genossenschaft verfassen.
5. Überdies fasst der Genossenschaftsrat Beschluss im Rahmen des gesetzlich Zulässigen über alle sonstigen Gegenstände, die der Vorstand, die Revisionsstelle oder die Liquidatoren/Liquidatorinnen ihm zur Beschlussfassung oder konsultativ unterbreiten.
6. Der Vorstand und die Geschäftsleitung beantworten in den Sitzungen des Genossenschaftsrats alle Fragen über den Stand der Angelegenheiten der Genossenschaft, sofern nicht höherstehende Vertraulichkeitsverpflichtungen bestehen. Der Vorstand darf bestimmte Informationen als vertraulich bezeichnen oder andere Massnahmen zur Wahrung von Vertraulichkeitsverpflichtungen treffen.
7. Die Mitglieder des Genossenschaftsrats haben auch nach ihrem Austritt aus dem Genossenschaftsrat das Sitzungsgeheimnis zu wahren.
8. Dem Genossenschaftsrat wird im Budget der Genossenschaft ein angemessener Betrag zur freien Verwendung zugesprochen, um ihm eigene Aktivitäten zu ermöglichen. Der Ausschuss entscheidet über deren Verwendung.

**Artikel 28 – Konstituierung, Einberufung und Beschlussfassung**

1. Nach einer Erneuerungswahl beruft der Vorstand den Genossenschaftsrat innert drei (3) Monaten nach seiner Wahl zu einer ersten Sitzung ein. Bis auf die Präsidentin/den Präsidenten, die/der von der Gesamtheit der Mitglieder gewählt wird (Artikel 18 Absatz 1 Litera c), konstituiert sich der Genossenschaftsrat selbst. Er wählt mindestens einen Vizepräsidenten/eine Vizepräsidentin, und er kann einen Ausschuss bezeichnen, der sich aus drei (3) bis fünf (5) Abgeordneten zusammensetzt. Die Präsidentin/der Präsident und der Vizepräsident/die Vizepräsidentin dürfen dem Ausschuss angehören. Unter Vorbehalt der Zustimmung des Vorstands und des erforderlichen Budgets kann der Genossenschaftsrat für bestimmte Aufgaben Kommissionen ernennen oder Externe beiziehen.
2. Jeweils nach Rücksprache mit dem Vorstand und dem Ausschuss beruft die Präsidentin/der Präsident des Genossenschaftsrats diesen periodisch zu Sitzungen ein; der Vorstand unterstützt ihn. Es sollen mindestens zwei Sitzungen im Jahr physisch stattfinden, die übrigen Sitzungen können über geeignete elektronische Medien stattfinden, die eine aktive Teilnahme an der Meinungsbildung durch die Teilnehmenden ermöglichen. Vor einer Urabstimmung oder Mitgliederversammlung ist in jedem Fall eine Sitzung durchzuführen. Die Mitglieder des Vorstands und die Vertreter der Revisionsstelle sind grundsätzlich berechtigt, an Sitzungen des Genossenschaftsrats mit beratender Stimme teilzunehmen. In begründeten Ausnahmefällen können auch Sitzungen ganz oder teilweise ohne Teilnahme des Vorstands oder der Revisionsstelle stattfinden; dem Vorstand ist das Protokoll dieser Sitzungen zuzustellen.
3. Die Präsidentin/der Präsident führt den Vorsitz und leitet die Verhandlungen. Der Vorstand orientiert sie/ihn laufend über wichtige Aktivitäten der Genossenschaft und Entwicklungen, welche die Genossenschaft betreffen. Der Vorstand lädt die Präsidentin/den Präsidenten des Genossenschaftsrats nach seinem eigenen Gutdünken an Sitzungen des Vorstands ein, wo sie/er mit beratender Stimme teilnimmt.
4. Der Ausschuss vertritt den Genossenschaftsrat und bereitet gemeinsam mit dem Vorstand die Sitzungen vor. Dabei stehen dem Ausschuss die administrativen Ressourcen der Genossenschaft kostenlos zur Verfügung.
5. In der Regel werden die Mitglieder des Genossenschaftsrats in der Form gemäss Artikel 39 Absatz 2 zehn (10) Tage vor einer Sitzung eingeladen; in dringenden Fällen ausnahmsweise fünf (5) Tage vor der Sitzung.
6. Der Genossenschaftsrat ist beschlussfähig, wenn mindestens die Hälfte seiner Mitglieder anwesend ist. Beschlüsse werden mit der einfachen Mehrheit der abgegebenen Stimmen gefasst; bei Stimmengleichheit hat die Präsidentin/der Präsident den Stichentscheid. Jede/jeder Abgeordnete hat eine Stimme. Stellvertretung oder Stimmen aufgrund von Instruktionen ist nicht zulässig.
7. Lehnt der Genossenschaftsrat Anträge des Vorstands gemäss Artikel 27 Absatz 1 Litera h ab, so kann der Vorstand diese Anträge der Urabstimmung unterbreiten.

## D. Vorstand

**Artikel 29 – Zusammensetzung, Konstitution und Amtsdauer**

1. Der Vorstand übt die Funktionen der Verwaltung gemäss Art. 894 OR aus und besteht aus mindestens drei (3) Mitgliedern der Genossenschaft. Der Vorstand konstituiert sich selbst, bezeichnet aber mindestens eine Vorsitzende/einen Vorsitzenden des Vorstands.
2. Vorbehältlich der Amtsdauer des ersten Vorstands (siehe Absatz 3) werden die Mitglieder des Vorstands vom Genossenschaftsrat für eine Amtsdauer von einem Geschäftsjahr gewählt, die mit dem Tag ihrer Wahl beginnt; sie verbleiben, sofern sie nicht ausscheiden, bis zur Ernennung ihres Nachfolgers/ihrer Nachfolgerin oder bis zu ihrer Wiederwahl im Amt. Wird ein Mitglied vor Ablauf seiner Amtsdauer ersetzt, so tritt sein Nachfolger/seine Nachfolgerin in dessen Amtsdauer ein. Wiederwahl ist unbeschränkt möglich.
3. Die Amtsdauer der Mitglieder des ersten Vorstands der Genossenschaft beträgt drei (3) Geschäftsjahre; die übrigen Bestimmungen Absatzes 2 gelten analog.

**Artikel 30 – Aufgaben**

1. Dem Vorstand obliegt die oberste Leitung der Geschäfte der Genossenschaft und die Aufsicht und Kontrolle über die Geschäftsführung. Der Vorstand ist für die Behandlung aller Geschäfte zuständig, die nicht durch Gesetz oder diese Statuten einem anderen Organ vorbehalten sind. Der Vorstand vertritt die Genossenschaft gegen aussen.
2. Der Vorstand ist berechtigt, die Geschäftsführung und Vertretung durch Erlass eines Organisationsreglements ganz oder zum Teil an einzelne Mitglieder (Delegierte) oder an Dritte (Direktoren/Direktorinnen) zu übertragen.
3. Der Vorstand kann alle erforderlichen Reglemente und Weisungen erlassen.

**Artikel 31 – Kompetenzen**

Der Vorstand hat folgende unübertragbaren und unentziehbaren Aufgaben:

- a. die Ausgestaltung des Rechnungswesens, der Finanzkontrolle sowie der Oberleitung der Genossenschaft und die Erteilung der nötigen Weisungen;
- b. die Festlegung der Organisation der Geschäftsleitung;
- c. Finanzplanung, sofern diese für die Führung der Genossenschaft notwendig ist, insbesondere auch Genehmigung und Überwachung der für die Geschäftstätigkeit erforderlichen Budgets im Rahmen des jährlich durch den Genossenschaftsrat genehmigten Budgets;
- d. Finanzführung, inklusive des Festlegens der anwendbaren Rechnungslegungsstandards und der Rechnungslegungsgrundsätze, wie auch der Verantwortlichkeit für eine allfällige Fondsbuchhaltung;
- e. die Ernennung und Abberufung der mit der Geschäftsführung und der Vertretung betrauten Personen und die Regelung ihrer Zeichnungsberechtigung;
- f. die Oberaufsicht über und die personelle Führung der mit der Geschäftsführung betrauten Personen, namentlich im Hinblick auf die Befolgung der Gesetze, Statuten, Reglemente und Weisungen; 
- g. die Erstellung des Geschäftsberichts sowie die Vorbereitung der Urabstimmungen, Mitgliederversammlungen und Sitzungen des Genossenschaftsrats, wie auch Ausführung ihrer Beschlüsse;
- h. die Führung des Mitgliederregisters;
- i. Beschlüsse über Miete von Geschäftsräumlichkeiten und beweglichen Geräten;
- j. Beschlüsse über Beteiligungen und Zweigniederlassungen, insbesondere auch das Ausüben von Aktionärs- oder Gesellschafterrechten bei Beteiligungen;
- k. die Festlegung der geschäftlichen und ideellen Ziele der Genossenschaft unter Berücksichtigung der Interessen der Genossenschaft, unter Vorbehalt der diesbezüglichen Befugnisse des Genossenschaftsrats;
- l. die Beschlüsse über Unterstützungsleistungen und besondere Leistungen an Mitglieder; 
- m. Beschlussfassung über bzw. im Zusammenhang mit der Durchführung von Urabstimmungen; 
- n. Genehmigung von Reglementen (insbesondere Personal- und Spesenreglement); 
- o. Abschluss und Anpassungen von Vereinbarungen mit Organisationen der Arbeitnehmer/Arbeitnehmerinnen, Versicherungs- und Vorsorgeeinrichtungen; und
- p. die Benachrichtigung des Richters/der Richterin im Falle der Überschuldung.

**Artikel 32 – Einberufung**


1. Die Sitzungen des Vorstands werden von der/dem Vorsitzenden oder, im Falle seiner/ihrer Verhinderung, von einem anderen Mitglied des Vorstands einberufen, sooft dies als notwendig erscheint. Eine Sitzung ist auch einzuberufen, wenn ein Mitglied des Vorstands dies schriftlich und unter Angabe der Gründe verlangt. 
2. Über die Verhandlungen und Beschlüsse des Vorstands ist ein Protokoll zu führen, das durch die Vorsitzende/den Vorsitzenden und den Sekretär/die Sekretärin zu unterzeichnen ist.
3. Mitglieder der Geschäftsleitung haben auf Aufforderung des Vorstands an den Sitzungen des Vorstands mit beratender Stimme teilzunehmen.

**Artikel 33 – Beschlussfassung**


1. Der Vorstand ist beschlussfähig, wenn wenigstens die Hälfte der Vorstandsmitglieder anwesend ist. Als anwesend gilt ein Vorstandsmitglied auch, wenn es in anderer Weise (z.B. über Video-, Web- oder Telefonkonferenz) aktiv an den Verhandlungen, der Meinungsbildung und der Beschlussfassung teilnehmen kann.
2. Beschlüsse werden durch die Mehrheit der stimmenden Vorstandsmitglieder gefasst. Stellvertretung ist ausgeschlossen, ebenso Stimmenthaltung, ausser in Fällen von Interessenkollisionen. Falls Vorstandsmitglieder abwesend sind, sind ihnen (zur Wahrung der Rechte gemäss Absatz 6) durch die/den Vorsitzende/n die Beschlüsse innert längstens vierundzwanzig (24) Stunden nach Abschluss der Sitzung zur Kenntnis zu bringen.
3. Beschlüsse des Vorstands können auch auf schriftlichem Wege (einschliesslich Post, E-Mail oder anderen Kommunikationssystemen, die eine schriftliche Dokumentation zulassen) getroffen werden, sofern nicht ein Vorstandsmitglied mündliche Beratung oder Beratung in einer Sitzung mit physischer Anwesenheit verlangt; jeder so gefasste Beschluss hat die gleiche Gültigkeit wie die an einer Sitzung gefassten Beschlüsse und muss gemäss Artikel 25 Absatz 2 protokolliert werden.
4. Die/der Vorsitzende des Vorstands hat bei Stimmengleichheit den Stichentscheid.
5. Beschlüsse über Gegenstände, die nicht auf der Traktandenliste verzeichnet sind, dürfen nur gefasst werden, wenn kein Vorstandsmitglied dagegen Einsprache erhebt.
6. Falls Beschlüsse in Abwesenheit eines oder mehrerer Vorstandsmitglieder gefasst wurden, kann jedes Vorstandsmitglied, das bei der Beschlussfassung abwesend war, innert vierundzwanzig (24) Stunden, nachdem ihm das Ergebnis der Beschlussfassung gemäss Absatz 2 bekannt gegeben wurde, bei der/dem Vorsitzenden verlangen, dass dieser Beschluss suspendiert wird und dem Vorstand im Sinne einer Wiedererwägung zur neuerlichen Beschlussfassung vorgelegt wird. Eine Wiedererwägungsbeschlussfassung hat innert kürzestmöglicher Frist in einer Sitzung unter Anwesenheit des entsprechenden Vorstandsmitglieds stattzufinden. Der Beschluss in dieser Sitzung ist endgültig. Das Analoge gilt für Beschlüsse, die durch Stichentscheid der/des Vorsitzenden zustande gekommen sind; diesfalls sind die in der Beschlussfassung durch den Stichentscheid überstimmten Vorstandsmitglieder berechtigt, den Antrag auf eine Wiedererwägungsbeschlussfassung zu stellen.

## E.  Geschäftsleitung

**Artikel 34 – Wahl, Zusammensetzung und Aufgaben**


1. Zur Leitung der Tagesgeschäfte der Genossenschaft kann der Vorstand eine Geschäftsleitung einsetzen, die als geschäftsführendes Organ in eigener Verantwortlichkeit handelt.
2. Der Vorstand legt die Zahl der Mitglieder der Geschäftsleitung fest und bezeichnet deren Vorsitzenden/Vorsitzende und die Organisation der Geschäftsleitung.
3. Die Geschäftsleitung vertritt die Geschäfte der Genossenschaft unter Vorbehalt der Befugnisse des Vorstands nach Artikel 31. Im Rahmen ihrer Befugnisse trifft die Geschäftsleitung alle Massnahmen, die die geschäftlichen und ideellen Ziele der Genossenschaft fördern.
4. Die Mitglieder der Geschäftsleitung müssen nicht Mitglieder der Genossenschaft sein.

## F.  Revisionsstelle

**Artikel 35 – Anforderungen und Aufgaben**

1. Die Gesamtheit der Mitglieder wählt eine Revisionsstelle. Als Revisionsstelle können eine oder mehrere natürliche oder juristische Personen oder Personengesellschaften gewählt werden. Die Revisionsstelle muss ihren Wohnsitz, ihren Sitz oder eine eingetragene Zweigniederlassung in der Schweiz haben. 
2. Muss die Genossenschaft ihre Jahresrechnung durch eine Revisionsstelle ordentlich prüfen lassen oder ist sie zur eingeschränkten Revision verpflichtet, wählt der Genossenschaftsrat einen zugelassenen Revisionsexperten nach den Vorschriften des Revisionsaufsichtsgesetzes vom 16. Dezember 2005 als Revisionsstelle. Vorbehalten bleibt der Verzicht auf die Wahl einer Revisionsstelle.
3. Die Revisionsstelle wird für eine Amtsdauer von einem Geschäftsjahr gewählt. Letztere endet mit der Versammlung (bzw. Urabstimmung) der Gesamtheit der Mitglieder, welcher der Revisionsbericht zu erstatten ist. Eine Wiederwahl ist möglich; eine Abberufung ist jederzeit und fristlos möglich. 
4. Der Revisionsstelle obliegt die Prüfung gemäss Art. 728 bis 729c OR.

## V. Geschäftsjahr und Gewinnverwendung

**Artikel 36 – Geschäftsjahr, Buchführung und Gewinnverwendung**


1. Das Geschäftsjahr der Genossenschaft wird vom Vorstand festgelegt.
2. Die Bücher müssen je auf das Ende eines Geschäftsjahres abgeschlossen und die Jahresrechnung innert vier (4) Monaten nach Abschluss des Geschäftsjahres der Revisionsstelle zur Prüfung vorgelegt werden.
3. Ein allfälliger Reinertrag fällt vollumfänglich in das Genossenschaftsvermögen und ist im Rahmen der Weiterentwicklung der genossenschaftlichen Aktivität und deren Zweckbestimmung zu verwenden. 

## VI. Übergangsbestimmungen

**Artikel 37 – Übergang von der bisherigen Organstruktur**


1. Bis die Genossenschaft mindestens 300 Mitglieder hat, bildet die Mitgliederversammlung das oberste Organ und vereinigt die Befugnisse der Gesamtheit der Mitglieder und des Genossenschaftsrats auf sich. 
2. Sobald die Genossenschaft mehr als 300 Mitglieder hat, bildet die Gesamtheit der Mitglieder gemäss den statutarischen Bestimmungen das oberste Organ. Bis zur Konstituierung des ersten Genossenschaftsrats vereinigt der Vorstand die Befugnisse des Genossenschaftsrats und des Vorstands auf sich. Ausgenommen davon sind die Befugnisse gemäss Artikel 27 Absatz 1 Litera c und Artikel 27 Absatz 2 Literae b, d, e, f und k, über welche vorübergehend auf Antrag des Vorstands die Gesamtheit der Mitglieder mittels Urabstimmung oder Mitgliederversammlung entscheidet.
3. Der erste Genossenschaftsrat muss bis spätestens 30. Juni 2018 konstituiert sein.
4. Die Amtsdauer des ersten Vorstands dauert fort; er wird nicht neu gewählt.

## VII. Auflösung und Liquidation

**Artikel 38 – Auflösungsbeschluss und Liquidation**


1. Die Genossenschaft wird in den vom Gesetz vorgesehenen Fällen oder durch Beschluss der Gesamtheit der Mitglieder in einer Urabstimmung oder in einer Mitgliederversammlung mit einer Mehrheit von zwei Dritteln der abgegebenen Stimmen aufgelöst.
2. Die Liquidation erfolgt nach den gesetzlichen Vorschriften.
3. Ein allfälliger Liquidationserlös wird vollumfänglich einer steuerbefreiten Organisation mit ähnlicher Zwecksetzung überwiesen; den Mitgliedern steht kein Anteil am Liquidationserlös zu.

## VIII. Schlussbestimmungen

**Artikel 39 – Mitteilungen und Bekanntmachungen; Partizipation**


1. Alle Mitteilungen der Genossenschaft an die Mitglieder erfolgen schriftlich (einschliesslich Telefax oder E-Mail) unter Vorbehalt abweichender gesetzlicher oder statutarischer Bestimmungen.
2. Der schriftlichen Kommunikation ist die elektronische Kommunikation gleichgestellt; Zustellungen an Mitglieder über die im Mitgliederregister verzeichnete E-Mail-Adresse gelten als gültig vorgenommen.
3. Beschlussfassungen aller Organe (auch bei Urabstimmungen) wie auch rechtlich relevante Erklärungen der Mitglieder (z.B. Beitritts- oder Austrittserklärungen, Erklärungen über Verlängerung oder Nichtverlängerung der Mitgliedschaft etc.) können auch über geeignete Online-Plattformen oder Apps erfolgen, solange der Vorstand angemessene Massnahmen trifft, um die Identität der Abstimmenden und das Ergebnis festzustellen und sicherzustellen, dass es nicht zu mehrfacher Stimmabgabe oder anderen Missbräuchen kommt. Der Vorstand darf auch E-Mail-Nachrichten akzeptieren. Die Identifikation über die bei der Genossenschaft vom Mitglied hinterlegte E-Mail-Adresse, auch ohne dass die E-Mail zertifiziert ist, genügt als Mittel zur Feststellung der Identität des/der Erklärenden oder des Absenders/der Absenderin einer Willensäusserung oder Nachricht.
4. Der Vorstand stellt über die Website der Genossenschaft ein Instrument für Mitgliederinitiativen, Petitionen und Wahlvorschläge zur Verfügung, das die Partizipation zwischen den Mitgliedern ermöglicht und insbesondere auch die Sicherung der Identifikation der betreffenden Mitglieder entsprechend vorstehend Absatz 3 sicherstellt.
5. Publikationsorgan der Genossenschaft ist das Schweizerische Handelsamtsblatt.

**Artikel 40 – Mediationsvorbehalt und Gerichtsstand**


1. Die Mitglieder der Genossenschaft unterwerfen sich für den Fall von Konflikten, die das Gesellschafts- und/oder Mitgliedschaftsverhältnis betreffen, der Verpflichtung, anstelle des Schlichtungsverfahrens eine Mediation gemäss Art. 213 ff. ZPO durchzuführen. Falls sich die Konfliktparteien nicht innert dreissig (30) Kalendertagen nach Stellen eines Mediationsgesuchs durch die klagende Partei einigen können, wird der Mediator/die Mediatorin durch die Schweizerische Kammer für Wirtschaftsmediation (SKWM), Sektion Zürich, bestimmt. Der Mediator/die Mediatorin ist frei, einen Co-Mediator/eine Co-Mediatorin zu bestimmen.
2. Der Gerichtsstand für sämtliche aus dem Gesellschafts- und/oder Mitgliedschaftsverhältnis entstehenden Streitigkeiten befindet sich am Sitz der Genossenschaft.
      `

export default () => {
  const meta = {
    title: 'Statuten',
    description: ''
  }

  return (
    <Frame meta={meta}>
      <H1>{meta.title}</H1>

      <P>
        <A
          download
          href={`${CDN_FRONTEND_BASE_URL}/static/statuten_project_r_genossenschaft_unterschrieben.pdf`}
        >
          PDF herunterladen
        </A>
      </P>

      <Content />
    </Frame>
  )
}
