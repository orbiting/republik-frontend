import {timeParse} from 'd3-time-format'
import {timeYear} from 'd3-time'
import {descending, ascending} from 'd3-array'

import {
  STATIC_BASE_URL
} from './constants'

export const clara = {
  image: `${STATIC_BASE_URL}/static/team/clara_vuillemin.jpg`,
  name: 'Clara Vuillemin',
  dob: '24.01.1992',
  title: 'Head of IT',
  description: `Clara Vuillemin studierte Maschinenbau und Elektrotechnik in Lausanne und Moskau. Daneben arbeitete sie in zahlreichen Jobs: auf dem Bauernhof, bei NGOs in New York, Perm (im Ural) und Kasachstan, war Reporterin bei der «Moskauer Deutschen Zeitung», App-Programmiererin in Winterthur, IT-Verantwortliche im Rotpunktverlag Zürich, Politikerin bei den Jungen Grünen, und gab – ihr bisheriger Lieblingsjob – in Lausanne Physik für Ingenieursstudenten: Mechanik, Elektrotechnik, Quantentheorie. Sie spricht schnell, denkt noch schneller. Einer ihrer Lieblingssätze ist: «Let’s get this shit done!» Wenn Vuillemin etwas nicht versteht, hat nicht sie ein Problem, sondern der, der Unverständliches gesagt hat. Ihr Job bei Project R ist der Aufbau einer IT-Architektur: Open Source, brauchbar auch für andere Medien und Entwickler, anpassbar an Entwicklung und Ideen der Redaktion: «Ich will, dass es schön ist. Ich will, dass es schnell ist. Ich will, dass es sicher ist.»`,
  email: 'clara.vuillemin@project-r.construction'
}

export const susanne = {
  image: `${STATIC_BASE_URL}/static/team/susanne_sugimoto.jpg`,
  name: 'Susanne Sugimoto',
  dob: '15.10.1963',
  title: 'Geschäftsführung',
  description: `Susanne Sugimoto kennt KMUs, Politik, Gewerkschaften und Grosskonzerne von innen. Sie machte eine Lehre als Drogistin (nur einen Steinwurf vom Rothaus entfernt). Danach holte sie die Matura nach und machte ein Studium der Geografie und Wirtschaftsinformatik. (Das erste Kind kam am letzten Tag des ersten Semesters, das zweite am ersten Tag des letzten.) Kurz darauf sass sie im Zürcher Gemeinderat und wurde Zentralsekretärin beim Schweizerischen Kaufmännischen Verband, wo sie unter anderem nach dem Grounding der Swissair das Bodenpersonal vertrat. Dann wechselte sie aus Neugier auf die Seite, mit der sie zuvor zehn Jahre über Löhne verhandelt hatte: zu den Konzernen. Sie wurde Leiterin der Medienstelle bei Coop. Und fünf Jahre später Leiterin des Kommunikationsteams für Zentraleuropa beim Zementmulti Holcim. Heute führt sie eine selbstständige Beraterfirma. Als Geschäftsführerin bei Project R ist ihr Job der Überblick über Budget, Personal, Tagesgeschäft. Kurz: Die Aufgabe der meisten Teammitglieder von Project R ist der Aufbau von Komplexität. Ihre die Reduktion von Komplexität.`,
  email: 'susanne.sugimoto@project-r.construction'
}

export const laurent = {
  image: `${STATIC_BASE_URL}/static/team/laurent_burst.jpg`,
  name: 'Laurent Burst',
  dob: '28.03.1979',
  title: 'Strategie',
  description: `Laurent Burst begann seine Geschäftstätigkeit mit 13 bei seinem Eintritt ins Gymnasium, mit Produktion, Druck und Inserateakquise bei einer Schülerzeitung, programmierte mit 14 in den Ferien professionelle Datenbanken, besass mit 15 das erste Natel der Schule, arbeitete mit 16 als Reporter für die «Zuger Presse», war mit 17 Kommunikationschef der Firma Brainstore, mit 21 Verwaltungsrat, mit 23 übernahm er die Geschäftsleitung. Mit 28 wechselte er – nach 10 Jahren Managementerfahrung – zur Verpackungsfirma Stewo, erst als Produktemanager, dann als Mitglied der Geschäftsleitung (das jüngste aller Zeiten, das erste mit Teilzeitpensum), bekam mit 30 zu Weihnachten das Buch «Annie Leibowitz at Work» geschenkt, verbrachte eine schlaflose Nacht, kündigte in der Silvesternacht und begann mit dem Beruf seines Vaters: Fotograf. Er fotografierte für Publikationen wie «GQ» oder das «Wall Street Journal», reiste im Jahr drei Mal um den Erdball, vermisste das Teamwork – und baut seit 2014 ein Startup auf: «Herr Rizzi», eine Importfirma für exotische Getränke aus der ganzen Welt. Bei Project R ist er für die Konstruktion von Businessplan und Rechtsform zuständig – und für die höflichste Art, die härtesten Fragen zu stellen. (Fragen sind die Spezialität von Burst, dessen Chef einst bei einem Mittagessen eine Ladung Zahnstocher in sein Hemd steckte und verkündete: Bei jeder Frage von Burst werde er einen Zahnstocher herausnehmen, und nach dem letzten Zahnstocher sei für den Rest des Tages Ruhe.) Bei Project R haben wir leider keine Zahnstocher: Burst hat vor, das Projekt im Verwaltungsrat derart hart mit Fragen zu löchern, dass es auch noch in 20 Jahren ausbaufähig bleibt.`,
  email: 'laurent.burst@project-r.construction'
}

export const nadja = {
  image: `${STATIC_BASE_URL}/static/team/nadja_schnetzler.jpg`,
  name: 'Nadja Schnetzler',
  dob: '24.04.1972',
  title: 'Prozesse und Zusammenarbeit',
  description: `Nadja Schnetzler begann bei einer Schülerzeitung, aus der noch vor der Matura ein Business wurde: die Vermittlung von Inseraten für Schülerzeitungen. Später, in der Ringier-Journalistenschule, machte sie Praktika bei so unterschiedlichen Medien wie «Bild» und «taz». Doch entscheidender war ein Tag im Frühling 1997: Als Schnetzler mit ihrem späteren Mann entschied, während der Herbstferien in einem Ladenlokal in Biel ein neuartiges Geschäft aufzumachen: einen Ideenhandel namens Brainstore. Die ersten Produkte waren noch unschlagbar günstig – für 9 Franken 90 erhielten Passanten gleich drei Ideen. (Eine typische Frage war etwa, wie man den pensionierten Ehemann dazu bringt, wieder ausser Haus zu gehen.) Zur Verblüffung aller entwickelte sich daraus eine international tätige Firma: Auf dem Höhepunkt beschäftigte Brainstore 80 Mitarbeiter und 3000 Freelancer – und entwickelte Ideen für Unternehmen, NGOs, Privatleute und Regierungen auf sämtlichen Kontinenten, mit Ausnahme der Antarktis. (Mehr zu Theorie und Praxis der industriellen Ideenproduktion finden Sie in Schnetzlers Buch «Die Ideenmaschine».) 2012 machte sich Nadja Schnetzler als Kollaborations-Coach mit «Word and Deed» selbstständig. Bei Project R ist ihr Mandat die Entwicklung und Zusammenarbeit: Wie macht man etwas besser? Wie einfacher? Und wie kann man etwas neu denken?`,
  email: 'nadja.schnetzler@project-r.construction'
}

export const patrick = {
  image: `${STATIC_BASE_URL}/static/team/patrick_recher.jpg`,
  name: 'Patrick Recher',
  dob: '18.08.1988',
  title: 'Software-Entwicklung',
  description: `Patrick Recher, der Mann für die Datenbanken, machte seine Informatiker-Lehre bei der Swisscom, wo jeder Lehrling ein Generalabonnement in die Hand gedrückt bekam und die Möglichkeit, sich irgendwo im Unternehmen zu bewerben. Was ihn faszinierte, waren Netzwerke: Er hatte schon mit 12 die Nachbarhäuser verkabelt. Was ihn weniger faszinierte, war das Informatikstudium danach: lauter veraltete Software. («Für Informatiker gehört es zum guten Ton, dass du das Studium abbrichst.») Er wurde trotzdem zwei Mal Schweizer Vizemeister in Informatik. Und erhielt eine Goldmedaille (leider keinen Barren) von der Nationalbank für seine Lehrabschlussarbeit zur Finanzkrise. Seinen grössten Coup landete er mit seiner Maturarbeit: Für das erste iPhone entwickelte er eine App, die ein beliebiges Landschaftsfoto mit Orts-, Fluss- und Bergnamen beschriftete. Recher schlug damit die Entwickler aus der ETH, die mit einem ähnlichen Vorhaben gescheitert waren. Und hatte noch vor dem Abschluss einen Job als App-Entwickler. Bei Project R ist seine Verantwortung, die Programme für alles Verborgene zu entwickeln: Artikelverwaltung, Userverwaltung, Zahlungsabwicklung – «immer mit einem innovativen Twist»`,
  email: 'patrick.recher@project-r.construction'
}

export const thomas = {
  image: `${STATIC_BASE_URL}/static/team/thomas_preusse.jpg`,
  name: 'Thomas Preusse',
  dob: '13.03.1991',
  title: 'Software-Entwicklung',
  description: `Thomas Preusse schaffte es, als Programmierer in Rekordzeit zwei Journalistenpreise zu gewinnen – obwohl er «lieber 100 Zeilen Code schreibt als einen einzigen Satz». 2016 gewann er (mit Markus Häfliger) den Zürcher Journalistenpreis für die Aufdeckung der Kasachstan-Affäre, welche die Berner Nationalrätin Christa Markwalder in Bedrängnis brachte. Preusse hatte die Suchmaschine gebaut, mit der ein Datenleck der kasachischen Regierung durchforstet werden konnte. Im Jahr zuvor hatte er mit einem NZZ-Team den deutschen Reporterpreis für die beste Web-Reportage erhalten: eine Rekonstruktion des Flugs MH370, der spurlos über dem Indischen Ozean verschwand. Seine Laufbahn begann Preusse als Webentwickler bei einer Werbeagentur in Kanada, zuletzt arbeitete er bei der Web-Agentur «Interactive Things» in Zürich. Preusses Hauptjob bei Project R ist der Aufbau des sogenannten Frontends: ein Interface, das für die Leser und Redaktion so vollkommen unauffällig funktionieren soll wie in einem englischen Schloss der Butler.`,
  email: 'thomas.preusse@project-r.construction'
}
export const constantin = {
  image: `${STATIC_BASE_URL}/static/team/constantin_seibt.jpg`,
  name: 'Constantin Seibt',
  dob: '20.02.1966',
  title: 'Konzeption und Redaktion',
  description: `Constantin Seibt war ein Kind, das Abenteurromane las. Und den Plan fasste, eines Tages dasselbe zu machen: Nicht Abenteuer zu erleben. Aber Abenteuerromane zu schreiben. Mit 22 kam er seinem Ziel am nächsten: Er schrieb mit einem Kollegen einen Krimi. Die Folge waren Aufträge von Zeitungen. Seibt blieb im Journalismus, erst bei der Zürcher Studierendenzeitung «ZS», später bei der Wochenzeitung «WoZ» und schliesslich beim «Tages-Anzeiger». Sein Spezialgebiet wurde die Grauzone zwischen Politik und Wirtschaft: von der Finanzkrise bis zur Eurokrise. Für seine Reportagenserie zum Swissair-Prozess erhielt er 2008 den Zürcher Journalistenpreis. Seibt ist einer der wenigen Reporter, die nicht nur eine Praxis, sondern auch eine Theorie haben: 2015 erschien sein Buch «Deadline» über das Handwerk des Schreibens. Die Bilanz ist also, dass Seibt sein Ziel um 180 Grad verfehlt hat: Der Beruf als Reporter verwandelte zwar sein Berufsleben in eine Kette von kleinen Abenteuern. Doch der Abenteuerroman blieb ungeschrieben. Project R soll dafür sorgen, dass es dabei bleibt.`,
  email: 'constantin.seibt@project-r.construction'
}

export const christof = {
  image: `${STATIC_BASE_URL}/static/team/christof_moser.jpg`,
  name: 'Christof Moser',
  dob: '03.04.1979',
  title: 'Konzeption und Redaktion',
  description: `Christof Moser wollte Journalist werden, noch bevor er bis Z buchstabieren konnte – und nachdem sich herausgestellt hatte, dass Regenwaldforscher wegen Arachnophobie keine gute Berufswahl gewesen wäre. Also lancierte er mit 12 seine erste Schülerzeitung, die sich bis zum Ende der Schulzeit in ein Magazin («Nachtisch») weiterentwickelte und dann noch weiter – bis zum mittelgrossen Konkurs. Die Publikation fiel auf einen Betrüger herein. Und Moser zahlte bis 25 Druckereirechnungen ab. Nach einer kaufmännischen Ausbildung stieg Moser als Volontär beim «Brückenbauer» (dem heutigen «Migros-Magazin») in den Journalismus ein. Im Jahr 2000 gehörte er beim Wirtschaftsportal «Moneycab» zu den ersten Onlinejournalisten der Schweiz, danach folgten Stationen als Politik-Reporter bei «Facts», «Weltwoche» und «SonntagsBlick» und eine abgebrochene TV-Stage bei «10vor10». Zuletzt arbeitete er als Bundeshaus-Journalist und Medienkritiker bei der «Schweiz am Sonntag» und als freier Autor für «Literarischer Monat», «Surprise», «Zeit Schweiz» und «Schweizer Illustrierte». Daneben baute er «Infosperber» mit auf und unterrichtet Journalismus-Studentinnen und -Studenten in Politik- und Wirtschaftsjournalismus, Storytelling und Medienethik. Bei Project R kann Moser ein bisher verborgenes Talent ausleben: das Zeichnen von Plänen. Denn davon braucht ein Medienprojekt Unmengen.`,
  email: 'christof.moser@project-r.construction'
}

export const richard = {
  image: `${STATIC_BASE_URL}/static/team/richard_hoechner.jpg`,
  name: 'Richard Höchner',
  dob: '13.05.1987',
  title: 'Netzwerk-Organisation',
  description: 'Das Interessante am Journalismus ist, dass man mit jedem einen Grund zum Reden hat: von der Bundesrätin bis zum Bauarbeiter. Und das Interessante an einer Redaktion ist, dass die verschiedensten Leute vorbeikommen. Leute mit Ideen, mit Interessen, mit Fragen, mit Informationen – kurz: Verrückte aller Art. Richard Höchner ist unser Mann, der diese Vielfalt zusammenbringen wird. Seine Eltern lernten sich in einem kaputten Zug in Italien kennen. Das Resultat dieser Zugpanne, Richard Höchner, wuchs danach in zwei Familien auf: Die schweizerische war ruhig und seriös, die italienische laut, politisch und so herzlich wie chaotisch. Höchner besuchte die Schule in Rheineck SG: einer kleinen Grenzstadt, die nicht nur aussah, als käme sie aus dem Mittelalter. Sondern sich auch so anfühlte. Er floh: erst nach Neuseeland zu einem Auslandjahr, dann – noch im Gymnasium – als Trendscout zur Bieler Firma Brainstore. Höchner machte schnell Karriere: zum Organisator von 3000 freien Mitarbeiterinnen und Mitarbeitern rund um den Planeten. 2010 wechselte er zu Warm Decent Human Beings (WDHB) – einer Firma, die Informationsreisen für andere Firmen organisiert: Höchner führte Ingenieure, Financiers und Manager in Dinge wie digitales Business, Detailhandel oder Marketing ein – an Orten wie Doha, Bangalore oder Bogotá. Sieben Jahre flog er pro Jahr dreimal um den Planeten. (Und veranstaltete als Hobby in Zürich Partys.) Als Resultat, sagt er, haben unter seinen Freunden kaum zwei Leute denselben Pass. Bei Project R wird Höchner zum ersten Mal sesshaft. Er ist zuständig für das, was er schon immer tat: das Zusammenbringen von Leuten und Ideen. Also für die Vernetzung von Experten und Lesern aller Art. Und sonstigen Verrückten.',
  email: 'richard.hoechner@project-r.construction'
}

export const lukas = {
  image: `${STATIC_BASE_URL}/static/team/lukas_buenger.jpg`,
  name: 'Lukas Bünger',
  dob: '29.10.1983',
  title: 'Software-Entwickler',
  description: `Das Buch, das Lukas Bünger noch unbedingt lesen will, ist die Abrechnung mit Oberembrach: Dort lebte er als Sohn der Pfarrerin zwischen  den Söhnen von Bauern und Piloten. Und er wünscht sich als Autor die Auferstehung von Robert Musil. Musil ist kein Zufall – beinahe hätte Bünger sein Leben als Germanist verbracht –, aber er floh schnell, als er merkte, dass man in fünf Jahren Studium dort «bestenfalls ein brutaler Fachidiot» werden konnte. Er erholte seinen Kopf ein Jahr lang an der ETH mit Mathematik – und begann mit dem Job, den er sich selber beigebracht hatte: Programmierer. Nach verschiedenen Agenturen heuerte er beim Start-up Watson an: als Entwickler bei dessen Front-End. Ein gutes Interface, so Bünger, «braucht eine heikle Balance: Es macht die Sache einfach. Aber es verkauft die Leute nicht für blöd. Denn das sind sie nicht.» Obwohl Bünger «Journalisten mit Abstand für die narzisstischste Berufsgruppe» hält, gibt er der Republik eine Chance. Das, weil ihn reizt, etwas von null auf zu entwickeln. «Die Schweiz hat High-Level-Robotik. Und hervorragende Ingenieure. Aber die Professionalisierung der Web-Entwicklung fängt erst an.»`,
  email: 'lukas.buenger@project-r.construction'
}

export const daniel = {
  image: `${STATIC_BASE_URL}/static/team/daniel_pfaender.jpg`,
  name: 'Daniel Pfänder',
  dob: '25.04.1975',
  title: 'Software-Entwickler',
  description: `Daniel Pfänder wuchs im Taubertal auf. Dieses liegt in Bayern. Noch heute spricht er den sanften Dialekt seiner Herkunft. Und ihn umgibt ein Hauch von Ruhe und Provinz. Dem es nichts anhaben konnte, dass er zehn Jahre im internationalsten und elitärsten Konzern des Planeten arbeitete: Google. So ruhig Pfänder wirkt, sein Leben bestand aus drei energischen Fluchten. Als Sohn des Dorfschullehrers ging Pfänder aufs Gymnasium. Aber mit 15 hatte er die Schnauze voll «von dem Schweinesystem: den sadistischen Lehrern». Er beschloss, als Einsiedler zu leben. Doch seine Eltern holten ihn mit einem Kompromiss «zurück in die Zivilisation»: statt auszusteigen, Rudolf-Steiner-Schule. Nach dem Abitur war er erst ratlos, weil ihn zu viele Dinge interessierten. Dann studierte er Biologie. Doch eines Tages, im Labor, als er Bakterien mit radioaktivem Mittel markierte, fragte er sich, ob er das ein Leben lang tun wollte: an einer Fussnote der Forschung mitarbeiten. Das war 1995, die Zeit der ersten Webbrowser. Pfänder verliess das Labor und stieg ins Netz um: Es schien ihm das Tor zur Welt. Er bastelte Websites, begann eine Lehre als Mediengestalter bei einer Druckerei, studierte Multimedia und jede Nacht die Jobseite von Google. Eines Nachts erschien das Inserat: Webmaster gesucht. Pfänder schrieb und bestieg vor der ersten Bewerbungsrunde in Zürich das erste Flugzeug seines Lebens. Er hatte Flugangst, kein Wunder, wirkte er nach der Landung souverän: das Schlimmste lag hinter ihm. Nach fünf Monaten Testreihen (einer davon war das Warten) bekam er den Job. Damals arbeiteten bei Google Zürich noch 150 Leute, zehn Jahre später waren es 3000. Und Pfänder fragte sich, ob er nicht schon wieder eine Fussnote war: obwohl er vielleicht die meistgesehenen Fussnoten des Planeten programmiert hatte – die auf den Videos von Youtube. Er fragte sich, ob er nicht – zusammen mit hochintelligenten Technikern – in einer Blase lebte. Er kündigte. Mit der Begründung, dass er «seine Wäsche wieder selbst waschen» wolle. Und heuerte bei der Republik an, wo er das muss.`,
  email: 'daniel.pfaender@project-r.construction'
}

export const anja = {
  image: `${STATIC_BASE_URL}/static/team/anja_conzett.jpg`,
  name: 'Anja Conzett',
  dob: '10.08.1988',
  title: 'Reporterin',
  description: `Anja Conzett wuchs in Schiers auf, mit Mehl, Bibel und einem vollgestopften Estrich. Sie war die Tochter eines Bäckers und Missionars und als solche von den Bauernkindern geächtet, obwohl sie sie an Wildheit oft übertraf. Sie hielt sich an endlose Stapel von «Spiegel»- und «Geo»-Heften im Estrich. Mit 16 enttäuschte sie ihre Eltern, weil sie ein weltliches Leben plante: Sie wollte Journalismus machen. In Zürich langweilte sie sich fürchterlich im Germanistik-Studium; sie überlegte, was tun. Ein halbes Jahr Indien langweilte sie auch – das taten alle. Sie entschloss sich, einen richtigen Job zu machen: Sie ging zurück nach Graubünden, ins Prättigau, und unterschrieb einen Arbeitsvertrag im Schlachthaus. Sie war die erste Praktikantin, die je dort arbeitete. Die Männer steckten ihr Kuhaugen und Hoden in den Overall. Das als Zeichen der Akzeptanz – sie taten dasselbe auch untereinander. In der Pause wurde über Politik debattiert: Die SVP-Anhänger galten unter den Schlachtern als der linke Flügel. Conzett lernte in diesem halben Jahr mehr als je sonst wo: zurückgeben. Und zuhören. Obwohl sie das Studium wieder aufnahm, blieb das Schlachthaus die beste Universität, die sie je besuchte: Sie gewann ein Ohr für den Slang. Seither kommt sie überall durch, und Milieureportagen sind das, was sie am liebsten macht. Sie schrieb für «Hochparterre», «Südostschweiz» und die «Schweizer Illustrierte» über Dealer, Prostituierte, Fernfahrer, Flüchtlinge und Bauarbeiter. Zu Letzteren erschien 2016 im Rotpunkt-Verlag der Reportageband «Lohndumping – eine Spurensuche auf dem Bau». Sie hat vor, ein furchtloses Leben zu führen.`,
  email: 'anja.conzett@project-r.construction'
}

export const adrienne = {
  image: `${STATIC_BASE_URL}/static/team/adrienne_fiechter.jpg`,
  name: 'Adrienne Fichter',
  dob: '12.04.1984',
  title: 'Redaktorin',
  description: `Adrienne Fichter kennt Start-ups aus Erfahrung: 2009 war sie bei der Gründung von Politnetz an Bord – und ging drei Jahre durch die faszinierende Hölle von Schlaflosigkeit, Pizzaschachteln und Testen von Ideen. Politnetz.ch war der erste Versuch in der Schweiz, eine digitale Plattform für die demokratische Debatte zu bauen. Und kein schlechter Ort für Fichter, denn ihre Themen waren exakt diese: Politik und Netz. Fichter ist studierte Politologin und Social-Media-Expertin. Von 2014 bis 2017 leitete sie die Social-Media-Abteilung der NZZ: verantwortlich für Konzepte, Debatten, Trolls und Essays zum Thema. Diesen Januar kündigte sie, um als Autorin und Herausgeberin an einem Buch zu arbeiten: «Smartphone-Demokratie» zur Politik im 21. Jahrhundert: zu Fake-News, Bots, Filterblasen, Empörungswellen und den neuesten Strategien der Spin-Doktoren. Es erscheint Mitte September im Verlag NZZ Libro – und diesen Herbst wird Fichter zwecks Vorstellung kreuz und quer durchs Land reisen. Eine Debatte mit ihr lohnt sich. Nicht nur wegen ihrer Kompetenz. Sondern auch, weil Fichters Mutter aus Russland einwanderte. Und ihre Tochter trotz einer Kindheit in Luzern zwei Schweizer Nationaltugenden nie begriffen hat: den Geiz. Und die Zurückhaltung bei der Äusserung der eigenen Ideen.`,
  email: 'adrienne.fichter@project-r.construction'
}

export const brigitte = {
  image: `${STATIC_BASE_URL}/static/team/brigitte_meyer.jpg`,
  name: 'Brigitte Meyer',
  dob: '31.12.1969',
  title: 'Bildchefin',
  description: `Die zukünftige Bildchefin der Republik tat, was kein Mensch vor ihr tat: Sie renovierte 2009 die NZZ. Die letzte nennenswerte Veränderung der «Neuen Zürcher Zeitung» lag damals über 60 Jahre zurück: 1946 hatte man die Frakturschrift abgeschafft. Was viele schon damals nach nur 166 Jahren als überhastet empfanden. Meyer verbrachte ihre Kindheit in Schaffhausen: Dort war nur der Rhein gross. Und alles andere niedlich. Sie verliess die Stadt Richtung Zürich mit einer «Aversion gegen alles Pittoreske». Eigentlich war ihr Plan, an der Uni zu studieren, um Journalistin zu werden. Doch dann bestand sie die Prüfung zur Kunstgewerbeschule. Und landete dann doch im Journalismus, nur anders: als Layouterin beim Magazin «Facts». Danach stieg sie schnell auf, weil sie «kein Problem hatte, Verantwortung zu übernehmen». Das erste Magazin, dass sie komplett neu gestaltete, war das Frauenmagazin «Meyer’s». Als dieses drei Jahre später in Konkurs ging, pendelte sie als Art-Direktorin von 2002 bis 2006 zwischen «Weltwoche» und «Magazin» hin und her. (Sie war dort, wo Roger Köppel nicht war.) Ihre Philosophie bei Bild wie Layout war: Kein Chichi, kein Bullshit, keine Schnörkel. Und vor allem: keine durchgezogene Bildsprache. Sondern das präzise Bild von Fall zu Fall, je nach Text. Und das nicht als Illustration, sondern als Statement. Im Zweifel hält sich Meyer an die Klassik – oder die Idee, die die Klassik in die Luft sprengt: «Ich mag Grenzen und das Ausbrechen aus Grenzen.» Beim Relaunch der NZZ reduzierte sie mit einer Hamburger Agentur das Layout auf das Skelett, entfernte alle Schlacken und baute es wieder auf: ohne Schnörkel, ohne Überflüssiges, nur mit einem winzigen Hauch Exzentrischem. Sie blieb als Bildchefin bis 2017. Bei der NZZ hatte Meyer ein Team von 15 Leuten und 237 Jahre Tradition im Rücken. Bei der Republik startet sie nun mit leichtem Gepäck: mit 0 Leuten und 0 Jahren Tradition.`,
  email: 'brigitte.meyer@project-r.construction'
}

export const mona = {
  image: `${STATIC_BASE_URL}/static/team/mona_fahmy.jpg`,
  name: 'Mona Fahmy',
  age: 50,
  title: 'Autorin',
  description: `Mona Fahmy wuchs zwischen New York und Beirut auf. Ihr Vater, ein Ägypter, starb, als sie 4 war. Ihre Mutter, eine Schweizerin, war Geschäftsfrau. Ihr Gebiet waren schlüsselfertige Grossprojekte – komplette Spitäler oder Pipelines. Auf Fotos stand sie oft als einzige Frau zwischen 150 Männern. Als der Golfkrieg ausbrach, telefonierte sie den Kindern aus Bagdad, mit Explosionen im Hintergrund. «Das war Mami.» Doch was immer auch passierte, die Kinder kamen zuerst. Ihre Telefone wurden direkt durchgestellt: Wenn Fahmy Ärger in der Schule hatte, mussten die anwesenden Minister warten. Als der Bürgerkrieg Beirut erreichte, zog die Familie in die Schweiz. Fahmy war 11 und die Liberalität des nahen Ostens gewohnt. Die Schweiz war ein Schock, ein Land der Unfreiheit: mit Pünktlichkeit, Lärmverbot, Schlafenszeiten. Plus einer neuen Sprache. Sie brauchte drei Jahre, bis sie ihre Frechheit wieder fand. Nach der Matur, in Südfrankreich, krachte ein betrunkener Fahrer mit 160 km/h in Fahmys Wagen. Ein Polizist zog sie aus dem brennenden Auto, sie lag ein halbes Jahr im Spital. Die Story kam im «Blick» – es war ihre erste Erfahrung mit Journalismus. Drei Jahre später studierte sie Betriebswirtschaft – so gelangweilt wie ehrgeizig. Danach schlug sie alle Jobangebote von Banken aus – und rettete Delfine. Und entdeckte das Rezept, wie man als Idealistin seine Geld- und Vergeblichkeitsprobleme löst. Sie gründete eine Eventagentur zwecks Fundraising und hatte mit Musikern viele Einnahmen, Action, Spass und Reisen. Dann starb ihre Mutter. Fahmy schloss ihre Agentur und ging auf die Journalistenschule. Es war der Anfang einer 17 Jahre währenden Flipperball-Karriere zwischen «Blick», «SonntagsBlick», «Facts», «Annabelle», «SonntagsZeitung» und «Tages-Anzeiger»/Newsnetz, mal als Reporterin, mal als Chefin. Fahmys Spezialität waren «die weite Welt und die bösen Jungs». Sie schrieb über Terroristen, Gauner, Guerilleros, Geldwäscher, Mörder, Kriege und den Nahen Osten; ihre Recherchen führten sie an Orte wie Kolumbien, Tschad und Libyen. Von 2007 bis 2009 machte sie an der Hochschule Luzern den Master in «Economic Crime Investigation» – Stunden vor der Geburt ihres ersten Kindes las sie Strafrechtsartikel zur Bekämpfung der Geldwäscherei. Sie hatte den Plan gefasst, ihren Job zu verlassen: «Denn kaum jemand wühlt noch im Dreck.» 2013 beerdigte sie den Journalismus. Sie machte sich als Risikoanalystin selbstständig. Sie recherchierte nun für Firmen. Ihr Job wurden Backgroundchecks zu möglichen Geschäftspartnern, Mitarbeitern, Märkten und Parnerfirmen – zu Bonität, Ruf und kriminellen Verwicklungen. Daneben gab sie Recherchekurse für Profiermittler. 2015 erschien ihr Buch «Der Tod, das Verbrechen und der Staat» über organisierte Kriminalität in der Schweiz. Im Herbst 2017 entschloss sich Fahmy zu zwei neuen Abenteuern. Sie gründete eine eigene Firma: Universal Risk Consulting. Und sie schreibt wieder, nun für die Republik: zu Politik und Verbrechen.`,
  email: 'mona.fahmy@republik.ch'
}

export const ariel = {
  image: `${STATIC_BASE_URL}/static/team/ariel_hauptmeier.jpg`,
  name: 'Ariel Hauptmeier',
  age: 47,
  title: 'Textchef',
  description: `Ariel Hauptmeier ist der geborene Textchef. Sein Job ist, steinige Artikel so lang zu polieren, bis sie die Schärfe eines Diamanten haben. Diese Begabung zeigte sich schon mit 21. Hauptmeier hatte zwar noch nicht die geringste Ahnung, dass er als Textchef geboren wurde. Er hatte eine Kleinstadtjugend in der westdeutschen Provinz hinter sich, als er sich auf einer seiner ersten grossen Reisen an seine Arbeit als Textchef machte: Er beschloss, sich ab sofort Ariel zu nennen. In den Jahren darauf studierte er Philosophie an der Sorbonne, war Deutschlehrer in Granada, Fotograf bei einer Tageszeitung in San Salvador und betrieb in Berlin den «Blue Room», eine der vielen heimlichen Kneipen jener Zeit. 1997 schloss er sein Germanistik-Studium ab, strategisch geschickt mit einer Arbeit über Reportagen. Und wurde dann selber Reporter. Er besuchte die Henri-Nannen-Schule in Hamburg, danach zog er als freier Journalist um die Welt: Nach Japan und Botswana, zu Kokabauern in Kolumbien und Rappern in Rio de Janeiro, er zeltete auf einer Eisscholle vor Ostgrönland und schlich nachts mit jungen Afrikanern zum Grenzzaun von Melilla. Mit 35 wurde er Redakteur bei «Geo», zweifacher Vater und Hobbyfussballtrainer beim Traditionsclub Altona 93. In dieser Zeit gründete er zusammen mit Cordt Schnibben und Stephan Lebert das Reporter-Forum. Die Grundidee: «Lasst uns über Texte reden.» 2014 wechselte er als Textchef zum neu gegründeten Start-up «Correctiv», spezialisiert auf Investigativ-Journalismus. Und arbeitete im Nebenjob als Schreibcoach und Ausbilder. Damals dachte er, dass die Zeit zum Reisen und Selberschreiben zu Ende sei. Und dass sein Job nun wäre, Jüngeren das Handwerk beizubringen. Er irrte, ein wenig. Dieses Jahr schrieb er zusammen mit einer Kollegin das Buch «Und die Vögel werden singen» – die Autobiografie des syrischen Pianisten Aeham Ahmad, der berühmt wurde, weil er mitten in den Trümmern von Damaskus Mozart spielte. Das Buch erscheint diesen Herbst im Fischer-Verlag. Und er reist wieder. Wenn auch nur nach Zürich.`,
  email: 'ariel.hauptmeier@republik.ch'
}

export const mark = {
  image: `${STATIC_BASE_URL}/static/team/mark_dittli.jpg`,
  name: 'Mark Dittli',
  age: 43,
  title: 'Wirtschafts-Autor',
  description: `Der Wirtschaftsjournalist Mark Dittli wuchs in Kloten auf. Und machte die kaufmännische Lehre beim «Grössten, was es gab»: der Swissair. Sein wahres Berufsziel war Pilot. (Er machte das Flugbrevet für Einmotorige, später auch für Akrobatikflüge.) Die Swissair schickte ihn auf Praktika nach Brüssel, London, Stockholm. Zurück in Zürich landete er im Marketing bei Atraxis, verkaufte Flugmanagementsoftware und studierte Betriebswirtschaft an der HWV in Zürich. Dort schrieb er in der Studentenzeitung «Susi». («Meist Albernes.») Auf der Reise danach, in Chile, erreichte ihn eine E-Mail seiner Französischlehrerin, die «Finanz und Wirtschaft» suche Leute. Dittli bewarb sich. Und wurde 2000 Redaktor. Eine seiner ersten grossen Storys war eine, die ihm das Herz brach: der Untergang der Swissair. 2003 schickte man ihn als Korrespondenten nach New York. Dittli blieb fünf Jahre, fasziniert von Amerika, dem Boom, den Zeitschriften «New Yorker» und «Atlantic» und den cleveren Köpfen überall. Kaum zurück in Zürich, brach das Bankensystem zusammen – und hinterliess mehrere Tausend Milliarden Verluste, ein faszinierendes Rätsel (wie konnte das passieren?) und für Dittli die Erkenntnis, «dass wir grundsätzlich weniger wissen, als wir glauben». 2012 wurde Dittli Chefredaktor: Er übernahm eine Zeitung mit viel Staub, altem Publikum, null Onlinepräsenz – in einem Verlag, der sparte. Dittli renovierte das Blatt. Die «Finanz und Wirtschaft» war im Kern ein Fachblatt für Anleger – und Dittli entschied, dass ohne Zusammenhänge kein Investor mehr vernünftig entscheiden konnte: Er brachte mehr und mehr Makroökonomie. Und baute fast ohne Budget eine Onlineseite auf. Seine Philosophie als Chefredaktor war: Als Boss musste er doppelt überzeugen. Erstens seine Leute von seinen Ideen, zweitens persönlich: beim Schreiben. Er tat dies meist nachts, für die eigene Zeitung wie für den ökonomischen Nerd-Blog «Never Mind the Markets». Dittli war in den USA ein eleganter Stilist geworden, so lässig wie klar: 2014 erhielt er den Zürcher Journalistenpreis für einen Artikel über die verpassten Chancen nach der Finanzkrise. 2017 kündigte Dittli. Er hatte gesehen, was zu sehen war: Strategien, Dienstpläne, Sparrunden, den «ganzen administrativen Irrsinn». Ihn interessierte Neues. Ab Januar schreibt er halb für die Republik, halb entwickelt er eigene Projekte.`,
  email: 'mark.dittli@republik.ch'
}

export const sylke = {
  image: `${STATIC_BASE_URL}/static/team/sylke_gruhnwald.jpg`,
  name: 'Sylke Gruhnwald',
  age: 36,
  title: 'Rechercheurin',
  description: `Eigentlich hätte Sylke Gruhnwald lukrativere Möglichkeiten als Journalismus: Sie kennt genug Leute. Sie weiss, wie man es anstellen müsste, Schwarzgeld über diverse Stationen zu verschieben, Schläger in Aserbaidschan anzuheuern, im Nahen Osten zu verschwinden. Mit ihrem Netz aus Informanten von Russland bis ins südliche Afrika und ihrer Kenntnis von Gesetzeslücken könnte sie auch erfolgreich ein Verbrechersyndikat aufbauen. Schon deshalb, weil sie extrem gerne organisiert. Doch die Welt im Schatten macht ihr nur Freude beim Betrachten. Darin zu leben wäre keine Option: «Selbst die, die Geld angehäuft haben, sind unzufrieden. Ich habe keinen Plan B.» Sie wuchs in München auf, studierte in Wien Betriebswirtschaft und chinesische Hochsprache und blieb im Studentenjob beim «Economist» hängen. 2012 kam sie zur NZZ – und baute dort als Chefin von Journalistinnen, Programmierern, Designerinnen das Datenteam auf. Und dazu ein Netzwerk von internationalen Rechercheuren: Sie wurde Mitglied in diversen Recherchierclubs. Und lernte die Journalismusstile (und -gesetze) im Ausland kennen: Am rauesten sind und leben die Kollegen im Osten. («Wir in der Schweiz sind dagegen wirklich nur First-World-Journalisten.») 2014 wechselte sie als Teamleiterin des Datenteams zum Schweizer Fernsehen, 2016 als Reporterin zum «Beobachter». Von ihren zahlreichen, fast immer vielköpfigen Recherchen wurden «The Migrants’ Files» am häufigsten ausgezeichnet: eine Übersicht über alle, die auf der Flucht nach Europa starben.`,
  email: 'sylke.gruhnwald@republik.ch'
}

export const carlos = {
  image: `${STATIC_BASE_URL}/static/team/carlos_hanimann.jpg`,
  name: 'Carlos Hanimann',
  age: 35,
  title: 'Reporter',
  description: `Sollten Sie Carlos Hanimann kennenlernen, werden Sie beeindruckt sein: von seiner Höflichkeit, seiner Freundlichkeit, seiner guten Laune. Aber Sie haben Pech: Sie werden ihn lesen. Hanimann ist der Mann für Geschichten ohne Happy End, sein Gebiet ist das Zähe, Finstere, Uferlose: Justiz, Steuervermeidungsindustrie, Geheimdienste, Lobbys. Er schrieb etwa über die Profiteure im Asylbusiness, die St. Galler Heroinszene (wofür er den Ostschweizer Medienpreis erhielt) oder über den Versuch einer Todesschwadron aus Bangladesch, in der Schweiz Überwachungstechnik zu kaufen (was sein Artikel dann verhinderte). Dabei begann sein Einstieg in den Beruf denkbar friedlich: Hanimann studierte Zeitgeschichte in Freiburg und entdeckte, dass er als Mitarbeiter im «St. Galler Tagblatt» ohne Anstrengung etwas Geld verdienen konnte. Die Stadt St. Gallen verdankt dieser Erkenntnis gefühlte 10'000 Artikel zu Eröffnungen von Secondhandshops, Nagelstudios und Coiffeursalons. Vor 10 Jahren wechselte Hanimann dann zur «Wochenzeitung» (WOZ). Erst zur Sportseite, dann zu Wirtschaft und Politik – seitdem fehlt seinen Geschichten das Happy End. Hanimanns Höflichkeit drückt sich für seine Leser vor allem indirekt aus: durch Stil. Egal wie finster der Fall ist, er liest sich hell. Denn Hanimann ist einer der wenigen Spürhunde, die auch erzählen können. Er schreibt so elegant, zielbewusst und fettfrei wie eine Strassenkatze. Wer das nachprüfen will, kaufe Hanimanns Buch «Elmer schert aus» über den Whistleblower Rudolf Elmer. Es erschien 2016 im Echtzeit-Verlag.`,
  email: 'carlos.hanimann@republik.ch'
}

export const andrea = {
  image: `${STATIC_BASE_URL}/static/team/andrea_arezina.jpg`,
  name: 'Andrea Arezina',
  age: 32,
  title: 'Chefin vom Dienst',
  description: `Die Republik holte sie, als es um Tod und Leben ging: in den zwei Monaten des Crowdfundings. Denn Andrea Arezina ist klar eine Frau, die den Unterschied macht als erfolgreichste Campaignerin des Landes. Dabei wuchs sie in Banja Luka im ehemaligen Jugoslawien auf – nicht der klassische Weg dafür, in der Schweiz politische Kampagnen zu machen. Sie führte Wahlkämpfe, etwa für Min Li Marti oder Jacqueline Fehr. Und war der Kopf hinter den zwei härtesten Abstimmungskampagnen der letzten Jahre. Sie gewann beide: Die Unternehmenssteuerreform III scheiterte trotz Millionen der Wirtschaft. Ebenso wie die anfangs noch unbesiegbar scheinende SVP-Durchsetzungsinitiative. Kurz: Arezina ist eine Spezialistin für das Unwahrscheinliche. Und blieb es bei der Republik, die beim Start ebenfalls ein Projekt gegen die Wahrscheinlichkeit war. Beim Crowdfunding schlug die Republik dann mit 3,4 Millionen den Weltrekord für Mediencrowdfundings um das Doppelte. (Und den Schweizer Rekord für Crowdfundings, den ebenfalls Arezina gehalten hatte: mit 1,2 Millionen gegen die Durchsetzungsinitiative.) Es war ein Ergebnis jenseits aller Planung – und wer dabei war, sah, wie sie es tat: durch Planung, konzentriert, mit Nerven aus Stahl. Das war, was eine Redaktion braucht – Journalistinnen und Journalisten können vieles, aber kaum je Organisation. So wechselt Arezina nun die Seite: von der Politik in den Journalismus. Sie gab alle politischen Mandate ab – und wird nun die Chefin vom Dienst: für Pünktlichkeit, Timing, Deadlines. Sie wird zum zentralen Teil des Motors einer neu zusammengesetzten Redaktion – von allen Jobs, die ihr angeboten wurden, war es der härteste. Deshalb nahm sie ihn. Und aus Abenteuerlust. Und weil sie im Leben immer drei Dinge interessieren: Politik. Sport. Journalismus. Das härteste Opfer dabei ist der Verzicht auf Witz. In politischen Sitzungen war sie die Frau, die auflockerte. In der Redaktion ist ihr Job, die Witze zu beenden. Und für das zu sorgen, worum es geht: Produktion.`,
  email: 'andrea.arezina@republik.ch'
}

const francois = {
  image: `${STATIC_BASE_URL}/static/team/francois_zosso.jpg`,
  name: 'François Zosso',
  age: 55,
  title: 'Finanzchef',
  description: `Zosso sah, wie sein Vater um halb neun aus dem Haus ging und um halb sechs wieder da war. Und wusste, was er wollte: einen Job im Büro. Auf dem Weg dazu ging er fast ohne Zögern vor. Kaum hatte er das Wirtschaftsstudium begonnen, brach er ab und heuerte in einer Treuhandbude an. In den zwanzig Jahren danach erlebte er fast alles, was Firmen sein konnten: 1. Kontinuität: Zosso arbeitete als Controller bei Hilti, einem Bohrmaschinenunternehmen «mit Superführung». Der Ton war zwar rau, «weil der Handwerker, der flucht» – dafür war Hilti durch die Nähe zu den Bauarbeitern immer bestens über die eigenen Produkte informiert. 2. Abstieg. Der Schuhkonzern Bally, berühmt für seine solide Ware, versuchte fancy zu werden – «ein klassischer Strategiefehler: Du stösst von dir, was dich stark macht.» Bally schrumpfte in Zossos Zeit als Finanzchef von 150 auf 50 Filialen. 3. Gründung: Zosso baute den gesamten Finanzbereich für Mediamarkt auf, der in die Schweiz einmarschierte: «Es war extrem lehrreich, alles neu zu überlegen, jeden Ablauf, jedes Formular.» 4. Boom: Bei Alcatel sah Zosso, ebenfalls als Finanzchef, den Tech-Hype (der Chef wurde Manager des Jahres, alle kassierten übertriebene Löhne) und den Absturz (der Manager des Jahres wurde entlassen). 2002 verwirklichte Zosso den Plan, selbstständig zu werden. Den Löwenanteil verdient er mit der Beratung von Spitälern für Betriebssoftware, daneben hat er diverse Mandate. Seit 2016 ist Zosso Finanzchef für Project R und die Republik.`,
  email: 'francois.zosso@republik.ch'
}

const nadine = {
  image: `${STATIC_BASE_URL}/static/team/nadine_ticozzelli.jpg`,
  name: 'Nadine Ticozzelli',
  age: 34,
  title: 'Marketing und Kommunikation',
  description: `Nadine Ticozzelli wuchs in Zürich-Seebach auf, zwischen Betonblöcken und Waldrand. Sie startete mit 15 ins Berufsleben: Sie machte eine Lehre bei Foto Bäumli. Dort lernte sie, was sie wollte: Fotografie – sie hat mittlerweile 67 Hochzeiten hinter sich. (Ihr Tipp: Man soll seine Hochzeit nicht übertrieben über Niveau planen, sonst wird alles steif.) Und sie entdeckte ein Talent: Verkauf. Nach der Lehre verkaufte sie fünf Jahre Profikameras. Danach arbeitete sie als Kommunikationsplanerin und Beraterin für eine Reihe von Agenturen, darunter Wirz und Hochspannung. Sie suchte einen Job der Sinn stiftet, wechselte zu World Vision und dann als Marketingverantwortliche in den Bio-Fachhandel zu Terra Verde. Dass sie die Sekundarschule mit 15 aus Langeweile verliess, rettete sie nicht vor dem Lernen: die Handelsschule, das Diplom für Kommunikationsplanung, aktuell steckt sie im Lernen auf die Matur. Zur Republik kam sie diesen Monat: Sie hat die Aufgabe, von den zehn Bällen des Unternehmens «etwa fünf» mit in der Luft zu halten.`,
  email: 'nadine.ticozzelli@republik.ch'
}

const philipp = {
  image: `${STATIC_BASE_URL}/static/team/philipp_von_essen.jpg`,
  name: 'Philipp von Essen',
  age: 35,
  title: 'Geschäftsstelle',
  description: `Von Essen lebte seine ersten sieben Jahre in Ostberlin. Dann reiste seine Mutter mit ihm aus, zwei Tage vor dem Fall der Mauer. In den ersten Wochen in Volketswil staunte von Essen über die vielen Farben und fragte sich, warum in der Schule gespielt wurde statt gelernt. Er brauchte zehn Jahre, um wirklich anzukommen. Nach der Matur zog er nach Zürich und sah sich bei Theater und Film um – dann studierte er Betriebswirtschaft. Gleichzeitig mit dem Abschluss wurde er Vater, arbeitete für die Stadt, erst im Stadthaus, dann im Zentrum Karl der Grosse. Danach ging er als Zimmermann ein Jahr auf die Baustelle. (Von Essen ist gut mit Holz, in seiner Jugend baute er ein kleines, aber zweistöckiges Holzhaus im Garten.) Nach einem Jahr als Assistenz des Rektorats bei der F+F-Schule wechselte er zur Republik, an der er das Tempo schätzt, «das Tempo des Irrtums, das Tempo der Korrektur des Irrtums». In dem Wirbel des Aufbaus ist von Essen der Mann für den Kundendienst, das Büromaterial, alles Konkrete. Andere machen Architektur und Pläne, er ist der Unternehmenszimmermann.`,
  email: 'philipp.vonessen@republik.ch'
}

const sylvie = {
  image: `${STATIC_BASE_URL}/static/team/sylvie_reinhard.jpg`,
  name: 'Sylvie Reinhard',
  age: 37,
  title: 'Verwaltungsrätin',
  description: `Keine von allen Herausforderungen der Republik AG ist für sie neu: Reinhard hat drei Start-ups von innen, Hunderte Start-ups von aussen und tausend Start-up-Gründer von Nahem gesehen. Kaum aus dem Gymnasium, gründete sie die Web-Security-Firma Dreamlab mit und arbeitete bis 25 durch, bevor sie nach New York ging, um dort zur Abwechslung zu leben (und Schokolade und Alkohol zu verkaufen). Ein Jahr später kehrte sie wieder zurück in die Schweiz, zog in Genf die Konferenzfirma Lift hoch – und organisierte Techkonferenzen für Nerds, Unternehmerinnen und Künstler an Orten wie Seoul oder Shanghai. 2014 wechselte sie die Seite, vom Aufbauen zum Unterstützen kühner Pionierprojekte mit dem Förderfonds der Migros-Gruppe. Nach zwei Jahren machte sie ein doppeltes Spin-off: Sie gründete die Firma crstl, die soziale und kreative Start-Ups findet, testet und coacht (auch, aber nicht nur für die Migros). Und sie wurde Mutter einer Tochter. Bei der Republik AG arbeitet Reinhard im Verwaltungsrat, als Spezialistin für unbarmherzige Fragen.`,
  email: 'sylvie.reinhard@republik.ch'
}

const team = [
  constantin,
  christof,
  brigitte,
  adrienne,
  anja,
  clara,
  thomas,
  patrick,
  lukas,
  daniel,
  richard,
  mona,
  ariel,
  mark,
  sylke,
  carlos,
  andrea
]

const admin = [
  susanne,
  nadja,
  laurent,
  francois,
  nadine,
  philipp,
  sylvie
]

const parseDob = timeParse('%d.%m.%Y')
const age = (dob) => {
  const dateOfBirth = parseDob(dob)
  const now = new Date()
  let age = timeYear.count(dateOfBirth, now)
  var months = now.getMonth() - dateOfBirth.getMonth()
  if (months < 0 || (months === 0 && now.getDate() < dateOfBirth.getDate())) {
    age -= 1
  }
  return age
}

team.forEach(person => {
  person.age = person.dob ? age(person.dob) : person.age
})
team.sort((a, b) => descending(a.age, b.age) || ascending(a.name, b.name))

admin.forEach(person => {
  person.age = person.dob ? age(person.dob) : person.age
})
admin.sort((a, b) => descending(a.age, b.age) || ascending(a.name, b.name))

export default team.concat(admin)
