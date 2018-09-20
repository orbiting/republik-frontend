import React, {Fragment} from 'react'
import { Heading, Section, Strong, TextMedium, Title } from './text'
import { Router } from '../../lib/routes'
import Collapsible from './Collapsible'

import {
  A, Button, P
} from '@project-r/styleguide'

const F = Fragment

export default () =>
  <div>
    <P>
      <img style={{width: '100%'}} src='/static/genossenschaft/info2.png' />
    </P>
    <Section>
      <Title>Wahlen und Abstimmungen</Title>
      <TextMedium>
        <F>
          Schön, sind Sie hier. Die «Republik» ist ein journalistisches Experiment. Und ein demokratisches. Denn das grösste
          Teilstück der «Republik» gehört einer Genossenschaft: Project R. Und die Genossenschaft, liebe Verlegerinnen und
          Verleger, die gehört Ihnen. Engagieren Sie sich dafür, werden Sie Genossenschaftsrätin oder Genossenschaftsrat!
          Hier auf unserer Wahlplattform, bis zum 16. Oktober.
        </F>
        <F>
          <Button block big onClick={e => { e.preventDefault(); Router.pushRoute(`voteSubmit`).then(() => window.scrollTo(0, 0)) }}>Kandidieren Sie jetzt!</Button>
        </F>
        <F>
          Ab dem 17. Oktober schreiten wir zur Wahl. Urnenschluss ist am 28. Oktober. Sie wählen einerseits, wer im
          Genossenschaftsrat von Project R sitzt – und andererseits, wer diesen Rat präsidiert. Und damit das demokratische
          Paket komplett ist, findet zeitgleich auch eine Reihe von Abstimmungen statt. Diese drehen sich alle um die
          Finanzen der Genossenschaft.
        </F>
      </TextMedium>
      <Collapsible>
        <F>
          Kandidieren, wählen und abstimmen können alle Personen, die am 16. Oktober Mitglieder der Project R
          Genossenschaft sind. Wenn Sie ein Jahresabo der «Republik» abgeschlossen haben, sind Sie das.
        </F>
        <F>
          28.9.–16.10. Interessierte Mitglieder können für den Genossenschaftsrat kandidieren.<br />
          17.10.–28.10. Mitglieder wählen die 30 Genossenschaftsrätinnen und das Ratspräsidium. Und sie stimmen über die Jahresrechnung, den Revisionsbericht des Geschäftsjahres 2017/2018 sowie über das Budget des Jahres 2018/2019 ab.<br />
          31.10. Wir geben die Wahl- und Abstimmungsresultate bekannt.
        </F>
        <F>
          Die detaillierten Wahl- und Abstimmungsbedingungen finden Sie in den <A href='https://assets.project-r.construction/media/statuten_project_r_genossenschaft_unterschrieben.pdf'>Statuten der Project R Genossenschaft</A>.
        </F>
        <F>
          Mehr zum Bauplan von Project R und der «Republik» finden Sie <A href='https://project-r.construction/newsletter/2017-03-15-aufbau'>hier</A>.<br />
          Mehr zur Finanzierung finden Sie <A href='https://project-r.construction/newsletter/2017-11-22-finanzierung'>hier</A>.
        </F>
      </Collapsible>
    </Section>
    <P>
      <img style={{width: '100%'}} src='/static/genossenschaft/info1.jpg' />
    </P>
    <Section>
      <Heading>Genossenschaftsrat</Heading>
      <TextMedium>
        <F>
          Mit dem Genossenschaftsrat haben die Mitglieder von Project R eine Stimme. Als Ratsmitglied werden Sie also viel
          zuhören müssen: uns und allen Mitgliedern der Genossenschaft. Die Redaktion der «Republik» verspricht im
          Gegenzug, Ihnen zuzuhören. Sie wird allerdings nicht alles umsetzen, was der Rat beschliesst. Es gilt die
          Redaktionsfreiheit.
        </F>
        <F>
          Als Genossenschaftsrätin oder -rat repräsentieren Sie die Mitglieder von Project R. Und Sie verbinden die rund
          20’000 Mitglieder mit dem dreiköpfigen Vorstand. Alle Ratsmitglieder engagieren sich ehrenamtlich. Damit der Rat
          seine Aufgabe voll erfüllen kann, muss er vielfältig sein. Das heisst: Wir wünschen uns alte und junge Personen,
          die Geschlechterverteilung soll ausgeglichen sein, und im Rat sollen verschiedene Lebensentwürfe, Herkünfte und
          Fähigkeiten zusammenkommen.
        </F>
        <F>
          Der Rat trifft sich zu mindestens zwei Sitzungen im Jahr, zum ersten Mal am 24. November 2018. Spätestens nach
          drei Jahren sind Neuwahlen. Wir stellen uns den Rat als eine Mischung aus Parlament, Aufsichts- und
          Kontrollgremium, Thinktank, Debattierklub und Ideenentwicklungslabor vor.
        </F>
      </TextMedium>
      <Collapsible>
        <F>
          Der Zweck der Projekt R Genossenschaft ist «die Förderung der Demokratie durch Stärkung, Erhalt und
          Weiterentwicklung des Journalismus als vierte Gewalt». Grosse Worte. Nun etwas konkreter: Wir suchen Menschen,
          die den Genossenschaftsrat mit uns aufbauen – und der Genossenschaft Leben und Geist geben. Das wird Ihnen
          Nerven abverlangen. Und ein wenig Zeit. Sie müssen leidenschaftlich sein, neugierig, interessiert an einer
          konstruktiven Debattenkultur.
        </F>
        <F>
          Es gibt, wie immer im Leben, Pflicht und Musse. Zunächst der wohl eher trockene Teil. Sie werden als Rätin die
          Jahresrechnung, den Geschäftsbericht und das Budget der Genossenschaft genau lesen müssen. Dies, weil Sie dazu
          Empfehlungen abgeben oder Korrekturen anbringen können. Schon alleine dazu sind zwei Sitzungen im Jahr
          Pflicht. Mehr sind möglich, wenn der Rat es für richtig hält. Damit hat der Rat seine Pflicht getan und kann
          sich den wirklich prickelnden Dingen zuwenden. Dazu nämlich, den Journalismus im Allgemeinen und die
          «Republik» im Besonderen weiterzuentwickeln. Wir freuen uns auf Ihre Ideen, Ihre Projektvorschläge, und ja:
          Wir freuen uns auf Ihre Kritik.
        </F>
        <F>
          Hier finden Sie das <A href='https://docs.google.com/document/d/1SgUr4uSZjglgckWeAcW1Oa1V09QO1ReTTIDjw3Lys4Y/edit'>Faktenblatt zum Zweck und den Aufgaben</A>, das wir an den Infoveranstaltungen zwischen dem
          18. Juni und dem 12. September verteilt haben.

          Lesetipp: Wenn Sie es ganz genau wissen wollen, dann legen wir Ihnen ans Herz, die Statuten im Original zu
          lesen. Die sind zwar ziemlich trocken – dafür aber präzise. Alles zum Genossenschaftsrat finden Sie in den <A href='https://assets.project-r.construction/media/statuten_project_r_genossenschaft_unterschrieben.pdf'>Artikeln 26, 27 und 28</A>.
        </F>
      </Collapsible>
      <TextMedium>
        <F>
          Wahlberechtigt sind alle Mitglieder der Genossenschaft. Wenn Sie ein Jahresabo der «Republik» abgeschlossen
          haben, dann sind Sie Mitglied. Dasselbe gilt für alle Kandidaturen für den Rat. Der Vorstand der Genossenschaft
          hat allerdings eine Wahlempfehlung für 30 Kandidatinnen und Kandidaten abgegeben. Nicht weil er sich einen
          besonders umgänglichen Rat wünscht, sondern einen vielfältigen. Es steht Ihnen aber frei, diese Empfehlung zu
          ignorieren. Sie sind nicht einverstanden? Dann kandidieren Sie!
        </F>
      </TextMedium>
      <Collapsible label='Weitere Informationen zur Wahl'>
        <F>
          <Strong>Zur Kandidatur</Strong>
        </F>
        <F>
          Um wählbar zu sein müssen Sie zwei Bedingungen erfüllen. Erstens müssen Sie am 16. Oktober Mitglied der Project
          R Genossenschaft sein (also ein Jahresabonnement der «Republik» haben). Zweitens müssen Sie bis dann Ihre
          Kandidatur auf dieser Wahlplattform online bestätigt haben. Auch Kandidatinnen und Kandidaten, die der Vorstand
          zur Wahl empfiehlt, müssen sich online registrieren.
        </F>
        <F>
          <Strong>Was bisher geschah</Strong>
        </F>
        <F>
          Am 23. Mai 2018 haben wir mit <A href='https://project-r.construction/newsletter/genossenschafts-rat'>diesem Newsletter</A> zum ersten Mal über die Wahl informiert und zu den
          Informationsveranstaltungen eingeladen.
        </F>
        <F>
          Zwischen dem 18. Juni und dem 12. September haben wir sechs Informationsveranstaltungen in sechs Städten
          durchgeführt, und es haben sich 160 Personen für eine Kandidatur interessiert.
        </F>
        <F>
          Am 27. September hat der Vorstand aus diesen Personen eine Wahlempfehlung von 30 Personen zusammengestellt und
          sie informiert. Auch die Interessenten, die nicht zur Wahl vorgeschlagen wurden, wurden informiert. Sie können
          natürlich trotzdem für den Rat kandidieren, so wie überhaupt alle Mitglieder der Genossenschaft.
        </F>
        <F>
          Was als Nächstes geschieht
          Bis zum 16. Oktober haben Sie Zeit, zu kandidieren. Das heisst: Sie müssen sich hier registrieren, Ihr Profil
          ausfüllen und es bestätigen.
        </F>
        <F>
          Zwischen dem 17. und dem 28. Oktober ist Wahlkampf. Sie können sich die Profile aller Kandidatinnen anschauen,
          und Sie sehen auch, wen der Vorstand warum zur Wahl empfiehlt. Wenn Sie Fragen an die Kandidatinnen haben, dann
          können Sie online mit Ihnen debattieren. Sobald Sie überzeugt sind, können Sie Ihren Wunschrat wählen.
        </F>
        <F>
          Am 29. und 30. Oktober werden wir viel Kaffee trinken und in Ruhe die Wahl auswerten. Es gilt das relative Mehr.
          Das heisst: Die 30 Personen mit den meisten Stimmen bekommen einen Sitz.
        </F>
        <F>
          Am 31. Oktober hat die Genossenschaft zum ersten Mal in Ihrer Geschichte einen Rat. Wir werden das Resultat hier
          auf der Plattform verkünden und einen angemessen staatstragenden Newsletter verschicken.
        </F>
        <F>
          <Strong>Zum Wahlsystem</Strong>
        </F>
        <F>
          Für das Wahlsystem haben wir Kritik einstecken müssen. Wenn der Vorstand seine Favoriten empfiehlt, ist das
          Ganze nicht ein reines Abnicken mit unumstösslichem Ausgang? Gelebte Alternativlosigkeit? Warum trauen wir den
          Mitgliedern nicht zu, selber die besten Kandidatinnen zu finden?
        </F>
        <F>
          Die Kritik hat etwas Wahres. Das ist uns bewusst. Darum haben wir auch lange und hart über Alternativen
          nachgedacht. Um Winston Churchill zu paraphrasieren: Dieses Wahlsystem ist für uns die beste aller schlechten
          Varianten. Aus drei Gründen bleiben wir trotz Kritik bei diesem System.
        </F>
        <F>
          1. Repräsentativität<br />
          In den Statuten der Genossenschaft ist festgehalten, dass die Zusammensetzung der Mitgliederstruktur angemessen
          vertreten sein soll: Im Rat sollen verschiedene Alter, Geschlechter, Regionen zusammenkommen. Wir haben bei der
          Wahlempfehlung darauf geachtet. Das erhöht die Wahrscheinlichkeit, dass die Anforderungen der Statuten erfüllt
          werden.
        </F>
        <F>
          2. Einfachheit<br />
          Wäre das nicht auch anders möglich gewesen? Ja, aber alles, was uns dazu eingefallen ist, wäre wahnsinnig
          kompliziert. Nicht für uns, das wäre verkraftbar, sondern für die Wählerinnen und Wähler. Haben Sie eine
          elegantere Lösung? Bitte, her damit. Dann werden wir die nächsten Wahlen so durchführen.
        </F>
        <F>
          3. Legitimität<br />
          Die Wahl mit Empfehlung ist für manche weniger legitim als eine ganz freie Wahl. Wir verstehen den Einwand.
          Aber: Jedes Mitglied kann ohne weitere Hürden kandidieren – ob auf der Liste oder nicht. So ist es zumindest
          möglich, die Irrtümer des Vorstandes zu korrigieren.
        </F>
        <F>
          Die detaillierten Bestimmungen zu den Wahlen finden Sie in <A href='https://assets.project-r.construction/media/statuten_project_r_genossenschaft_unterschrieben.pdf'>den Statuten der Project R Genossenschaft</A> (Art. X–Y).
        </F>
      </Collapsible>
    </Section>
    <F>
      <Button block big onClick={e => { e.preventDefault(); Router.pushRoute(`voteSubmit`).then(() => window.scrollTo(0, 0)) }}>Kandidieren Sie jetzt!</Button>
    </F>
  </div>
