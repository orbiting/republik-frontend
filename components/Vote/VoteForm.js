import React, {Fragment} from 'react'
import { css } from 'glamor'
import { Heading, Section, Strong, TextMedium, Title } from './text'
import Collapsible from './Collapsible'
import Poll from './Poll'
import Election from './Election'
import {
  mediaQueries,
  A
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

const F = Fragment

const styles = {
  anchor: css({
    display: 'block',
    position: 'relative',
    visibility: 'hidden',
    top: -HEADER_HEIGHT_MOBILE,
    [mediaQueries.lUp]: {
      top: -HEADER_HEIGHT
    }
  })
}

const options = [
  {value: 'yes', label: 'Ja'},
  {value: 'no', label: 'Nein'},
  {value: 'abstain', label: 'Leer einlegen'}
]

export default () =>
  <div style={{marginTop: 0}}>
    <Section>
      <Title>Wahlen und Abstimmungen</Title>
      <TextMedium>
        <F>
          Schön, sind Sie hier. Die «Republik» ist ein journalistisches Experiment. Und ein demokratisches. Denn das
          grösste Teilstück der «Republik» gehört einer Genossenschaft: Project R. Und die Genossenschaft, liebe
          Verlegerinnen und Verleger, die gehört Ihnen.
          Sie können mitbestimmen! Wählen Sie den Genossenschaftsrat, und stimmen Sie über die Finanzen ab. Bis zum
          28. Oktober 2018 sind die virtuellen Urnen offen.
        </F>
        <F>
          Sie wählen einerseits, wer im Genossenschaftsrat von Project R sitzt – und andererseits, wer diesen Rat
          präsidiert. Zudem können Sie über einen Wahlvorschlag für den Vorstand abstimmen. Und damit das
          demokratische Paket komplett ist, finden zeitgleich eine Reihe von Abstimmungen über die Finanzen der
          Genossenschaft statt. Sie haben also zu tun.
        </F>
        <F>
          Wählen und abstimmen können alle Personen, die am 16. Oktober Mitglieder der Project R Genossenschaft
          waren (und bis zur Stimmabgabe sind). Wenn Sie ein Jahresabo der «Republik» abgeschlossen haben, sind Sie
          das.
        </F>
      </TextMedium>
      <Collapsible>
        <F>
          <Strong>Der Zeitplan</Strong>
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
    <Section>
      <a {...styles.anchor} id='jahresrechnung' />
      <Heading>Jahresrechnung</Heading>
      <TextMedium>
        <F>
          Bevor wir zu den Köpfen kommen, gehen wir zuerst ins Geld. Sie haben uns mit Ihrem Jahresabonnement viel
          Geld gegeben. Sie haben ein Recht darauf, zu wissen, was damit geschehen ist, und als Genossenschafter
          über die Jahresrechnung abzustimmen.
        </F>
        <F>
          Wenn Sie es genau wissen möchten, dann empfehlen wir Ihnen, den <A href='/static/genossenschaft/placeholder.pdf'>integrierten Geschäftsbericht</A> der
          beiden Gesellschaften Republik AG und Project R Genossenschaft zu lesen. Ein Teil davon ist die <A href='/static/genossenschaft/placeholder.pdf'>Jahresrechnung 2017/18 der Project R Genossenschaft</A>, über die Sie abstimmen.
        </F>
      </TextMedium>
      <Collapsible>
        <F>
          Sie haben, wie jedes Mitglied, eine Stimme für diese Frage. Wählen Sie eine der Alternativen «Ja», «Nein» oder
          «Leer einlegen», und klicken Sie auf «Abstimmen». Wenn Sie Ihre Stimme einmal abgegeben und bestätigt haben,
          können Sie sie nicht mehr ändern oder zurücknehmen.
        </F>
        <F>
          Sie können Ihre Stimme leer einlegen und damit zum Ausdruck bringen, dass Sie die Frage nicht beantworten
          können oder wollen. Wir weisen die leeren Stimmen aus, und sie zählen für die Stimmbeteiligung. Für die
          Beschlussfassung zählen sie jedoch nicht. Mit anderen Worten: Ob die Jahresrechnung angenommen wird,
          entscheidet das Verhältnis zwischen den Ja-Stimmen und den Nein-Stimmen.
        </F>
      </Collapsible>
      <Poll
        proposition='Wollen Sie die Jahresrechnung 2017/18 annehmen?'
        options={options}
      />
    </Section>

    <Section>
      <a {...styles.anchor} id='revisionsbericht' />
      <Heading>Revisionsbericht</Heading>
      <TextMedium>
        <F>
          Vertrauen ist gut, Kontrolle ist besser. Und das in zweierlei Hinsicht. Erstens haben die Revisoren der
          BDO AG unsere Jahresrechnung sehr genau gelesen. Sie haben kritische Fragen dazu gestellt und sie
          schliesslich für gut befunden. Und zweitens ist es nun an Ihnen, die Wächter zu überwachen. Sie stimmen
          über den Revisionsbericht ab. Lesen können Sie diesen <A href='/static/genossenschaft/placeholder.pdf'>hier</A>.
        </F>
      </TextMedium>
      <Collapsible>
        <F>
          Auch zu dieser Fragen haben Sie, wie jedes Mitglied, eine Stimme. Wählen Sie eine der Alternativen «Ja»,
          «Nein» oder «Leer einlegen», und klicken Sie auf «Abstimmen». Wenn Sie Ihre Stimme einmal abgegeben und
          bestätigt haben, können Sie sie nicht mehr ändern oder zurücknehmen.
        </F>
        <F>
          Sie können Ihre Stimme leer einlegen und damit zum Ausdruck bringen, dass Sie die Frage nicht
          beantworten
          können oder wollen. Wir weisen die leeren Stimmen aus, und sie zählen für die Stimmbeteiligung. Für die
          Beschlussfassung zählen sie jedoch nicht. Mit anderen Worten: Ob der Revisionsbericht angenommen wird,
          entscheidet das Verhältnis zwischen den Ja-Stimmen und den Nein-Stimmen.
        </F>
      </Collapsible>
      <Poll
        proposition='Wollen Sie den Revisionsbericht 2017/18 annehmen?'
        options={options}
      />
    </Section>

    <Section>
      <a {...styles.anchor} id='budget' />
      <Heading>Budget</Heading>
      <TextMedium>
        <F>
          Nun zur letzten Finanzfrage. Für das nächste Geschäftsjahr legt Ihnen der Vorstand dieses Budget
          inklusive <A href='/static/genossenschaft/placeholder.pdf'>Erläuterungen</A> vor. Es zeigt, wie das Geld der rund 20’000 Verlegerinnen und Verleger
          verwendet werden soll. Stimmen Sie darüber ab.
        </F>
      </TextMedium>
      <Collapsible>
        <F>
          Für diejenigen, die schon zur Jahresrechnung und zum Revisionsbericht mehr Informationen wollten, nichts
          Neues: Sie haben für diese Frage, wie jedes Mitglied, eine Stimme. Wählen Sie eine der Alternativen
          «Ja», «Nein» oder «Leer einlegen», und klicken Sie auf «Abstimmen». Wenn Sie Ihre Stimme einmal
          abgegeben und bestätigt haben, können Sie sie nicht mehr ändern oder zurücknehmen.
        </F>
        <F>
          Sie können Ihre Stimme leer einlegen und damit zum Ausdruck bringen, dass Sie die Frage nicht
          beantworten können oder wollen. Wir weisen die leeren Stimmen aus, und sie zählen für die
          Stimmbeteiligung. Für die Beschlussfassung zählen sie jedoch nicht. Mit anderen Worten: Ob das Budget
          angenommen wird, entscheidet das Verhältnis zwischen den Ja-Stimmen und den Nein-Stimmen.
        </F>
      </Collapsible>
      <Poll
        proposition='Wollen Sie das Budget 2018/19 annehmen?'
        options={options}
      />
    </Section>

    <Section>
      <a {...styles.anchor} id='präsidium' />
      <Heading>Präsidium</Heading>
      <TextMedium>
        <F>
          Der Genossenschaftsrat wird eine Präsidentin oder einen Präsidenten haben. Sie oder er leitet den Rat
          und arbeitet eng mit dem Vorstand zusammen. Wir schlagen Ihnen drei (vier, fünf) Personen für das
          Präsidium vor. Informieren Sie sich hier über die Kandidatinnen und Kandidaten, und debattieren Sie mit
          ihnen. Wem geben Sie Ihre Stimme?
        </F>
      </TextMedium>
      <Collapsible>
        <F>
          Für diese Wahl haben Sie eine Stimme. Es gilt das relative Mehr, das heisst, die Kandidatin oder der
          Kandidat mit den meisten Stimmen ist für das Präsidium gewählt. Dazu müssen Sie auch in den
          Genossenschaftsrat gewählt sein. Wählen Sie also unbedingt jemanden, den Sie auch in den
          Genossenschaftsrat wählen. Wenn Sie sich nach unserer Wahlempfehlung richten, ist das kein Problem. Wir
          haben alle Kandidatinnen und Kandidaten auch für den Genossenschaftsrat zur Wahl empfohlen.
        </F>
        <F>
          Was genau macht der Präsident oder die Präsidentin eigentlich? Nun, eine ganze Menge. Die ganzen
          Ratssitzungen organisieren zum Beispiel. All das, was der Rat tut, vor- und nachbereiten. Vernetzen,
          vermitteln, verbinden. Daneben wird Madame oder Monsieur le Président eng mit dem Vorstand
          zusammenarbeiten. Sie oder er nimmt an dessen Sitzungen als Berater teil. Beschliesst der Vorstand also
          beispielsweise, künftig statt Journalismus klassisch-gregorianische Chöre zu fördern, ist es an der
          Präsidentin, Alarm zu schlagen.
        </F>
      </Collapsible>
      <Election
        slug='genossenschaftsrat2018-president'
      />
    </Section>

    <Section>
      <a {...styles.anchor} id='genossenschaftsrat' />
      <Heading>Genossenschaftsrat</Heading>
      <TextMedium>
        <F>
          Und nun zum letzten und vielleicht interessantesten Teil dieser Wahl. Schön, dass Sie bis hier
          durchgehalten haben. Sie können <Strong>30 Personen wählen</Strong>, die sich ehrenamtlich für Project R engagieren. <Strong>Der
          Genossenschaftsrat repräsentiert Sie</Strong> und die rund 20’000 anderen Mitglieder. Und er verbindet die
          Mitglieder mit dem dreiköpfigen Vorstand. Dafür kann er Ihnen z. B. Anträge unterbreiten, über die Sie
          abstimmen können. Wie heute über die Finanzen.
        </F>
        <F>
          Wir empfehlen Ihnen 30 Personen zur Wahl. Nicht weil wir uns einen besonders umgänglichen Rat wünschen,
          sondern einen vielfältigen. Wir haben darauf geachtet, dass verschiedene Altersgruppen, Regionen und
          Fähigkeiten vertreten sind und dass das Geschlechterverhältnis ausgeglichen ist. Es steht Ihnen aber
          frei, diese Empfehlung zu ignorieren und andere Personen zu wählen.
        </F>
        <F>
          Lernen Sie hier die Kandidatinnen und Kandidaten kennen, und debattieren Sie mit Ihnen. Und geben Sie
          Ihre 30 Stimmen bis zum 23. Oktober 2018 ab.
        </F>
      </TextMedium>
      <Collapsible>
        <F>
          <Strong>Zum Rat</Strong>
        </F>
        <F>
          Der Rat trifft sich zu mindestens zwei Sitzungen im Jahr, zum ersten Mal am 24. November 2018.
          Spätestens nach drei Jahren sind Neuwahlen. Wir stellen uns den Rat als eine Mischung aus Parlament,
          Aufsichts- und Kontrollgremium, Thinktank, Debattierklub und Ideenentwicklungslabor vor. Wie genau der
          Rat arbeit und mit Ihnen in Kontakt tritt, wird eine der ersten Aufgaben für die Rätinnen und Räte sein.
        </F>
        <F>
          Lesetipp: Wenn Sie es ganz genau wissen wollen, dann legen wir Ihnen ans Herz, die Statuten im Original
          zu lesen. Die sind zwar ziemlich trocken – dafür aber präzise. Alles zum Genossenschaftsrat finden Sie
          in den <A href='https://assets.project-r.construction/media/statuten_project_r_genossenschaft_unterschrieben.pdf'>Artikeln 19, 26 bis 28</A>.
        </F>
        <F>
          <Strong>Zum Wahlsystem</Strong>
        </F>
        <F>
          Für diese Wahl gilt das relative Mehr, das heisst, die 30 Kandidatinnen und Kandidaten mit den meisten
          Stimmen sind für den Genossenschaftsrat gewählt.
        </F>
        <F>
          Kandidieren konnten alle Mitglieder, die sich bis zum 16. Oktober online registriert haben. Der Vorstand
          der Genossenschaft hat allerdings eine Wahlempfehlung für 30 Kandidatinnen und Kandidaten abgegeben.
          Sind Sie damit nicht einverstanden? Debattieren Sie hier (LINK Wahldebatte) mit uns und den anderen
          Mitgliedern.
        </F>
        <F>
          Für das Wahlsystem haben wir schon im Vorfeld Kritik einstecken müssen. Wenn der Vorstand seine
          Favoriten empfiehlt, ist das Ganze nicht ein reines Abnicken mit unumstösslichem Ausgang? Gelebte
          Alternativlosigkeit? Warum trauen wir den Mitgliedern nicht, selber die besten Kandidatinnen zu finden?
        </F>
        <F>
          Die Kritik hat etwas Wahres. Das ist uns bewusst. Darum haben wir auch lange und hart über Alternativen
          nachgedacht. Um Winston Churchill zu paraphrasieren: Dieses Wahlsystem ist für uns die beste aller
          schlechten Varianten. Aus drei Gründen blieben wir trotz Kritik bei diesem System.
        </F>
        <F>
          1. Repräsentativität<br />
          In den Statuten der Genossenschaft ist festgehalten, dass die Zusammensetzung der Mitgliederstruktur
          angemessen vertreten sein soll: Im Rat sollen verschiedene Alter, Geschlechter, Regionen zusammenkommen.
          Wir haben bei der Wahlempfehlung darauf geachtet. Das erhöht die Wahrscheinlichkeit, dass die
          Anforderungen der Statuten erfüllt werden.
        </F>
        <F>
          2. Einfachheit<br />
          Wäre das nicht auch anders möglich gewesen? Ja, aber alles, was uns dazu eingefallen ist, wäre
          wahnsinnig kompliziert. Nicht für uns, das wäre verkraftbar, sondern für die Wählerinnen und Wähler.
          Haben Sie eine elegantere Lösung? Bitte, her damit. Dann werden wir die nächsten Wahlen so durchführen.
        </F>
        <F>
          3. Legitimität<br />
          Die Wahl mit Empfehlung ist für manche weniger legitim als eine ganz freie Wahl. Wir verstehen den
          Einwand. Aber: Jedes Mitglied kann ohne weitere Hürden kandidieren – ob auf der Liste oder nicht. So ist
          es zumindest möglich, die Irrtümer des Vorstandes zu korrigieren.
        </F>
        <F>
          <Strong>Zum Wahlablauf</Strong>
        </F>
        <F>
          Am 23. Mai 2018 haben wir mit diesem Newsletter zum ersten Mal über die Wahl informiert und zu
          Informationsveranstaltungen eingeladen: https://project-r.construction/newsletter/genossenschafts-rat
        </F>
        <F>
          Zwischen dem 18. Juni und dem 12. September haben wir sechs Informationsveranstaltungen in sechs Städten
          durchgeführt, und es haben sich 160 Personen für eine Kandidatur interessiert.
        </F>
        <F>
          Am 27. September hat der Vorstand aus diesen Personen eine Wahlempfehlung von 30 Personen
          zusammengestellt und sie informiert. Auch die Interessenten, die nicht zur Wahl empfohlen wurden, wurden
          informiert. Sie konnten trotzdem für den Rat kandidieren, so wie überhaupt alle Mitglieder der
          Genossenschaft.
        </F>
        <F>
          Bis zum 16. Oktober hatten die Interessierten Zeit, zu kandidieren. Das heisst: Sie haben sich hier
          registriert und ihr Profil ausgefüllt.
        </F>
        <F>
          Nun ist bis zum 28. Oktober Wahlkampf. Wenn Sie Fragen an die Kandidatinnen haben, dann können Sie
          online mit Ihnen debattieren. Sobald Sie überzeugt sind, können Sie Ihren Wunschrat wählen.
        </F>
        <F>
          Am 29. und 30. Oktober werden wir viel Kaffee trinken und in Ruhe die Wahl auswerten. Es gilt das
          relative Mehr. Das heisst: Die 30 Personen mit den meisten Stimmen bekommen einen Sitz.
        </F>
        <F>
          Am 31. Oktober hat die Genossenschaft zum ersten Mal in Ihrer Geschichte einen Rat. Wir werden das
          Resultat hier auf der Plattform verkünden und einen angemessen staatstragenden Newsletter verschicken.
        </F>
      </Collapsible>
      <Election
        slug='genossenschaftsrat2018-members'
        isSticky
      />
    </Section>

  </div>
