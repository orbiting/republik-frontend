import React from 'react'
import withData from '../../lib/apollo/withData'
import Frame from '../../components/Frame'
import List, {Item, Highlight} from '../../components/List'

import {
  A, Interaction
} from '@project-r/styleguide'

const {H1, H2, P} = Interaction

export default withData(({url}) => {
  const meta = {
    title: 'Impressum',
    description: ''
  }
  return (
    <Frame url={url} meta={meta}>
      <H1>
        {meta.title}
      </H1>

      <br />
      <H2>Verlegerinnen und Verleger</H2>
      <P>
        <A href='/community'>
          Alle Mitglieder
        </A>
        {' '}
        der{' '}
        <A href='https://project-r.construction/'>
          Project R Genossenschaft
        </A>
      </P>

      <br />
      <H2>Herausgeberin</H2>
      <P>
        Republik AG<br />
        Sihlhallenstrasse 1<br />
    8004 Zürich<br />
    Schweiz<br />
        <A href='mailto:kontakt@republik.ch'>
      kontakt@republik.ch
        </A>
      </P>

      <br />
      <P>
      Geschäftsführerin und <A href='/medien'> Medienkontakt:</A><br />
      Susanne Sugimoto, <A href='tel:+41797874765'>+41 79 787 47 65</A>, <A href='mailto:susanne.sugimoto@republik.ch'>susanne.sugimoto@republik.ch</A>
      </P>

      <br />
      <H2>Redaktion</H2>
      <List>
        <Item>
          <Highlight>Rothaus-Redaktion</Highlight><br />
          <A href='/~6ae2733e-1562-47b3-881c-88e9d3d28da9'>
          Adrienne Fichter
          </A>
        , Redaktorin<br />
          <A href='/~e8b718fb-e3fe-4960-85e9-f6a0e594ca33'>
          Andrea Arezina
          </A>
        , Chefin vom Dienst<br />
          <A href='/~f7b5b5bd-b82b-4f82-aee3-082ab1d11e0d'>
      Andreas Wellnitz
          </A>
    , Bildberater<br />
          <A href='/~4040f438-db05-483f-b64c-75e385218a58'>
      Anja Conzett
          </A>
    , Reporterin<br />
          <A href='/~29c289e8-ad86-44a3-9836-4d9ffb3a924f'>
      Ariel Hauptmeier
          </A>
    , Textcoach<br />
          <A href='/~22627cd7-63ee-40c4-abb7-1a0b538adb75'>
      Brigitte Meyer
          </A>
    , Bildchefin<br />
          <A href='/~5b6da6a6-c9fa-4ebb-a020-8dc85258310e'>
      Carlos Hanimann
          </A>
    , Reporter<br />
          <A href='/~b55b2f0a-c919-498b-b742-581c93f53eac'>
      Christian Andiel
          </A>
    , Chef vom Dienst<br />
          <A href='/~a563fa2c-9651-4360-bcb9-98c3d5b5d123'>
      Christof Moser
          </A>
    , Konzeption und Redaktion<br />
          <A href='/~a1f9dfcd-0745-4537-bd43-a592877921d4'>
      Clara Vuillemin
          </A>
    , Head of IT<br />
          <A href='/~f24bd0bc-2dfd-4f98-880c-d74cd27f84a5'>
      Constantin Seibt
          </A>
    , Konzeption und Redaktion<br />
          <A href='/~00051db6-0b8d-4808-9830-efbee0e4d2af'>
      Daniel Binswanger
          </A>
    , Autor Kultur und Politik<br />
          <A href='/~3b8fed85-3c81-4397-bc56-55acb9776ad4'>
      Daniel Pfänder
          </A>
    , Software-Entwickler<br />
          <A href='/~93d6839d-fe3e-491a-bbca-477585e776e4'>
      Elia Blülle
          </A>
    , Reporter und Ausbildung «Unternehmerischer Journalismus»<br />
          <A href='/~1a66c851-3db2-4882-8db4-d6df873ff1ed'>
      Lukas Bünger
          </A>
    , Software-Entwickler<br />
          <A href='/~e87b3289-0ce2-4841-99e9-7cba619f6e9a'>
      Mona Fahmy
          </A>
    , Autorin<br />
          <A href='/~a782b37f-56b7-4451-b5b9-e1fbf41109aa'>
      Mark Dittli
          </A>
    , Wirtschafts-Autor<br />
          <A href='/~dd619613-5a1e-492e-b0cc-3f4bc19870fa'>
      Marco Di Nardo
          </A>
    , Produktion<br />
          <A href='/~6e5d7522-8e67-4306-b416-79eb2f833b62'>
      Michael Rüegg
          </A>
    , Autor<br />
          <A href='/~33be2b6d-e331-4ba5-99e0-6ddc7fb5ca05'>
      Miriam Walther Kohn
          </A>
    , Netzwerk-Organisation<br />
          <A href='/~cdbfa09d-2b1e-402e-8943-30b4b1791139'>
      Olivia Kühni
          </A>
    , Chefin Analyse und Wissenschaft<br />
          <A href='/~b3054752-eefe-4cb4-9da0-b57a9c07d334'>
      Patrick Recher
          </A>
    , Software-Entwickler<br />
          <A href='/~5b5c7e77-f866-4ab5-b242-3ef1874cd4b2'>
      Richard Höchner
          </A>
    , Netzwerk-Organisation<br />
          <A href='/~eca9ee2c-4678-4f63-8564-651293df2b97'>
      Simon Schmid
          </A>
    , Wirtschafts-Autor<br />
          <A href='/~3b1cee6c-cc48-431a-ade7-60f739c66298'>
      Solmaz Khorsand
          </A>
    , Reporterin<br />
          <A href='/~dd782b8d-4eae-4a05-80d8-494760d2d58a'>
      Sylke Gruhnwald
          </A>
    , Rechercheurin<br />
          <A href='/~57ff6996-e3ef-4186-a2e6-95376f2b086b'>
      Thomas Preusse
          </A>
    , Software-Entwickler<br />
        </Item>
        <Item>

          <Highlight>Redaktionssupport</Highlight><br />

          <A href='/~b9ca57b4-274e-4615-b1e1-63f48adfb70c'>
        Christina Heyne
          </A>
      , Korrektorat<br />
          <A href='/~f7fddb6b-bb0a-49e3-ae49-ef747bcbad38'>
      Daniel Meyer
          </A>
    , Korrektorat<br />
          <A href='/~100bfd7e-1fd4-47ec-b9d9-9a46bb80fc97'>
      Lena Trummer
          </A>
    , Assistenz<br />
          <A href='/~e2ec9c10-e96c-47b0-baab-9c6bf13e2f47'>
      Marco Morgenthaler
          </A>
    , Korrektorat<br />
          <A href='/~0441099e-57ba-4c99-a102-eff8ea43d91d'>
      Pascal Kaufmann
          </A>
    , Software-Entwickler<br />
          <A href='/~25e66f69-8fb2-4990-9065-43a2dcb42406'>
      Robin Schwarz
          </A>
    , Social Media<br />
    Tomas Carnecky, Software-Entwickler, Interactive Things<br />
        </Item>

        <Item>
          <Highlight>Regelmässige Mitarbeit</Highlight><br />

          <A href='/~1bdea72a-52d7-4bee-b84e-bdeb80cf1d88'>
        Dominique Strebel
          </A>
      , Gerichtsreporter<br />
          <A href='/~02852b61-aa45-4dab-8d23-a0c71d3e05f7'>
      Brigitte Hürlimann
          </A>
    , Gerichtsreporterin<br />
          <A href='/~95643b75-6374-4fa4-b031-3ca06e380f12'>
      Dominic Nahr
          </A>
    , Fotograf<br />
          <A href='/~45fa4127-59d1-4f46-94ff-305cf1beeed1'>
      Marcel Niggli
          </A>
    , Kolumnist<br />
    Markus Felber, Gerichtsreporter<br />
          <A href='/~c98ecd1b-8a36-46d1-9083-0cb9ad750ce5'>
      Sibylle Berg
          </A>
    , Autorin<br />
    Sina Bühler, Gerichtsreporterin<br />
          <A href='/~0c82b21d-708d-4ec8-80b4-a40a69d85436'>
      Thom Nagy
          </A>
    , Autor<br />
    Viktor Parma, Autor<br />
          <A href='/~c641d9bf-9996-4b38-807b-8c1c1148943c'>
      Yvonne Kunz
          </A>
    , Gerichtsreporterin<br />
    Bart Wasem, Film<br />
        </Item>

        <Item>

          <Highlight>Werden ungeduldig erwartet</Highlight><br />

      Adelina Gashi, Ausbildung «Unternehmerischer Journalismus»<br />
          <A href='/~0c536be1-69a5-4dd3-adb4-9533cb3f7a9d'>
        Isabelle Schwab
          </A>
      , Ausbildung «Unternehmerischer Journalismus»<br />
      Katrin Moser, Produktion<br />
          <A href='/~909e78a3-27c9-40c0-8b95-7814f46f441b'>
      Michael Kuratli
          </A>
    , Ausbildung «Unternehmerischer Journalismus»<br />
    Urs Bruderer, Bundeshaus-Autor

        </Item>

      </List>

      <H2>Gestaltung</H2>

      <List>
        <Item>
        Bodara GmbH (Logo, Schrift Republik Serif, Gestaltung Screen und Print)<br />
          <A href='/~bfbab748-e3a1-4478-a298-fbb4fd79e9cc'>
          Bahar Büyükkavir
          </A>
        , Gestalterin<br />
          <A href='/~92360ee3-b142-44a0-a044-65dbc36d5827'>
          Dominique Schmitz
          </A>
        , Gestalter<br />
          <A href='/~a1bd424d-0388-4966-a430-5b4551ed90e4'>
      Mark Philip Ruoss
          </A>
    , Gestalter<br />
          <A href='/~e8616b28-136f-42c8-a100-efc67342814c'>
      Tobias Peier
          </A>
    , Gesamtkonzeption<br />
        </Item>
      </List>

      <H2>Verlag</H2>
      <List>
        <Item>
          <A href='/~d52d8fa6-8eb9-450b-9bb4-a28f5cdf822d'>
          Susanne Sugimoto
          </A>
        , Geschäftsführung, Medien, Marketingkommunikation<br />
          <A href='/~7687579c-cbbd-4fdf-9257-ad1b69452689'>
          François Zosso
          </A>
        , Finanzchef<br />
          <A href='/~f1d4b3c7-39c5-4d7d-a28a-002f150021db'>
      Philipp von Essen
          </A>
    , Geschäftsstelle<br />
          <A href='/~3bb03cea-04ee-4e83-a414-8127d205e112'>
      Nadine Ticozzelli
          </A>
    , Marketing und Kommunikation<br />
          <A href='/~875ec432-19b3-43d3-8aec-6d848d3bb29e'>
      Manuel Erdös
          </A>
    , IT-Support und Projekte<br />
          <A href='/~e431e41f-fb8b-4b8e-9075-17347db0111d'>
      Nadja Schnetzler
          </A>
    , Entwicklungslabor<br />
          <A href='/~349ef65b-119a-4d3e-9176-26517855d342'>
      Laurent Burst
          </A>
    , Marketing und Fotografie<br />
        </Item>
      </List>

      <H2>Geschäftsleitung</H2>

      <List>
        <Item>
          <A href='/~d52d8fa6-8eb9-450b-9bb4-a28f5cdf822d'>
          Susanne Sugimoto
          </A>
        , Geschäftsführung<br />
          <A href='/~a563fa2c-9651-4360-bcb9-98c3d5b5d123'>
          Christof Moser
          </A>
        , Publizistik<br />
          <A href='/~a1f9dfcd-0745-4537-bd43-a592877921d4'>
      Clara Vuillemin
          </A>
    , IT<br />
          <A href='/~5b5c7e77-f866-4ab5-b242-3ef1874cd4b2'>
      Richard Höchner
          </A>
    , Beisitz, GL Project R Genossenschaft<br />
          <A href='/~e8b718fb-e3fe-4960-85e9-f6a0e594ca33'>
      Andrea Arezina
          </A>
    , Beisitz, Redaktion<br />
          <A href='/~f1d4b3c7-39c5-4d7d-a28a-002f150021db'>
      Philipp von Essen
          </A>
    , Beisitz, Protokoll<br />
        </Item>
      </List>

      <H2>Verwaltungsrat</H2>

      <List>
        <Item>
          <A href='/~349ef65b-119a-4d3e-9176-26517855d342'>
          Laurent Burst
          </A>
        , Präsident<br />
          <A href='/~a563fa2c-9651-4360-bcb9-98c3d5b5d123'>
          Christof Moser
          </A>
          <br />
          <A href='/~f24bd0bc-2dfd-4f98-880c-d74cd27f84a5'>
          Constantin Seibt
          </A>
          <br />
          <A href='/~7687579c-cbbd-4fdf-9257-ad1b69452689'>
          François Zosso
          </A>
          <br />
          <A href='/~b08aa34c-52b9-47b8-a470-37cba12ce89a'>
          Sylvie Reinhard
          </A>
          <br />
          <A href='/~d52d8fa6-8eb9-450b-9bb4-a28f5cdf822d'>
          Susanne Sugimoto
          </A>
        , Beisitz, Geschäftsführung<br />
        </Item>
      </List>

      <H2>Gründerinnenteam</H2>

      <List>
        <Item>
          <A href='/~d52d8fa6-8eb9-450b-9bb4-a28f5cdf822d'>
          Susanne Sugimoto
          </A>
          <br />
          <A href='/~a1f9dfcd-0745-4537-bd43-a592877921d4'>
          Clara Vuillemin
          </A>
          <br />
          <A href='/~e431e41f-fb8b-4b8e-9075-17347db0111d'>
          Nadja Schnetzler
          </A>
          <br />
          <A href='/~349ef65b-119a-4d3e-9176-26517855d342'>
          Laurent Burst
          </A>
          <br />
          <A href='/~f24bd0bc-2dfd-4f98-880c-d74cd27f84a5'>
          Constantin Seibt
          </A>
          <br />
          <A href='/~a563fa2c-9651-4360-bcb9-98c3d5b5d123'>
          Christof Moser
          </A>
          <br />
        </Item>
      </List>
      <br />
      <H2>Aktionariat</H2>
      <P>
        <A href='https://www.republik.ch/aktionariat'>
        republik.ch/aktionariat
        </A>
      </P>

      <br />

      <H2>Mediadaten</H2>
      <P>
      Keine vorhanden. Die Republik ist komplett werbefrei.</P>
      <br />

      <H2>Beteiligungen</H2>
      <P>Bekanntgabe von namhaften Beteiligungen der Republik AG i. S. v. Art. 322 StGB: <br />
      Keine Beteiligungen.</P>

      <br />
      <H2>Handelsregistereintrag</H2>
      <P><A href='https://zh.chregister.ch/cr-portal/auszug/auszug.xhtml?uid=CHE-256.391.251'>Republik AG
      </A></P>

      <br />

      <H2>Publizistische Leitlinien</H2>
      <P><A href='https://www.republik.ch/manifest'>republik.ch/manifest
      </A>
      </P>
      <br />
      <br />

      <H2>Mitgliedschaft und Abonnement</H2>
      <P>
        <A href='https://www.republik.ch/angebote?package=ABO'>Jahresmitgliedschaft: CHF 240
        </A><br />
        <A href='https://www.republik.ch/angebote?package=MONTHLY_ABO'>Monatsabonnement: CHF 22
        </A><br />
        <A href='https://www.republik.ch/angebote?package=BENEFACTOR'>Gönnermitgliedschaft: CHF 1000
        </A><br />
        <A href='https://www.republik.ch/angebote?package=ABO_GIVE'>Jahresmitgliedschaft verschenken: CHF 240
        </A>
      </P>
      <br />
      <H2>Dank</H2>
      <P>
      Die Republik entstand aus einem Projekt, das 2010 begann. Bis zur ersten Publikation haben hunderte Menschen in ihrer Freizeit das Projekt unterstützt und vorangetrieben. Ohne sie gäbe es die Republik nicht. Wir sind jeder einzelnen Komplizin, jedem einzelnen Komplizen von ganzem Herzen dankbar für die Unterstützung. Wir möchten an dieser Stelle die einzelnen Namen auflisten, müssen aber die betreffenden Personen noch um Erlaubnis fragen.
      </P>
      <br />
      <H2>Rechtliches</H2>
      <P>
      Die in diesem Impressum erwähnten Personen dürfen nicht in einer Kartei gespeichert werden und ihre Namen und E-Mail-Adressen nicht ohne Einverständnis der genannten Personen genutzt werden.
      </P>

      <br />
      <H2>Disclaimer</H2>
      <P>
      Alle Texte und Links wurden sorgfältig geprüft und werden laufend aktualisiert. Wir sind bemüht, richtige und vollständige Informationen auf dieser Website bereitzustellen, übernehmen aber keinerlei Verantwortung, Garantien oder Haftung dafür, dass die durch diese Website bereitgestellten Informationen, einschliesslich jeglicher Datenbankeinträge, richtig, vollständig oder aktuell sind.
      </P>
      <P>
      Wir behalten uns das Recht vor, jederzeit und ohne Vorankündigung die Informationen auf dieser Website zu ändern, und verpflichten uns auch nicht, die enthaltenen Informationen zu aktualisieren. Alle Links zu externen Anbietern wurden zum Zeitpunkt ihrer Aufnahme auf ihre Richtigkeit überprüft. Dennoch haften wir nicht für Inhalte und Verfügbarkeit von Websites, die mittels Hyperlinks zu erreichen sind.
      </P>
      <P>
      Für illegale, fehlerhafte oder unvollständige Inhalte und insbesondere für Schäden, die durch die ungeprüfte Nutzung von Inhalten verknüpfter Seiten entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde. Dabei ist es gleichgültig, ob der Schaden direkter, indirekter oder finanzieller Natur ist oder ein sonstiger Schaden vorliegt, der sich aus Datenverlust, Nutzungsausfall oder anderen Gründen aller Art ergeben könnte.
      </P>
    </Frame>
  )
})
