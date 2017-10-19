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
      <H2>Kontakt</H2>
      <P>
        Republik<br />
        c/o Hotel Rothaus<br />
        Sihlhallenstrasse 1<br />
        8004 Zürich<br />
        <A href='mailto:kontakt@republik.ch'>
          kontakt@republik.ch
        </A>
      </P>

      <br />
      <H2>Verantwortlich für den Inhalt der Seiten</H2>
      <P>
        Project R Genossenschaft<br />
        Sihlhallenstrasse 1<br />
        8004 Zürich<br />
        <A href='mailto:office@project-r.construction'>
          office@project-r.construction
        </A>
      </P>

      <br />
      <H2>Vorstand</H2>
      <List>
        <Item>Nadja Schnetzler, Präsidentin</Item>
        <Item>Susanne Sugimoto, Geschäftsführerin, +41 79 787 47 65</Item>
        <Item>Laurent Burst</Item>
        <Item>Clara Vuillemin</Item>
      </List>

      <br />
      <H2>Redaktion</H2>
      <List>
        <Item>Christof Moser</Item>
        <Item>Constantin Seibt</Item>
      </List>

      <br />
      <H2>IT-Entwicklung</H2>
      <List>
        <Item>Clara Vuillemin</Item>
        <Item>Thomas Preusse</Item>
        <Item>Patrick Recher</Item>
      </List>

      <br />
      <H2>Gestaltung</H2>
      <List>
        <Item>
          <Highlight>Bodara GmbH</Highlight><br />
          Tobias Peier<br />
          Dominique Schmitz<br />
          Bahar Büyükkavir<br />
        </Item>
        <Item>Thomas Preusse</Item>
      </List>

      <br />
      <H2>Fotos</H2>
      <List>
        <Item>Simon Tanner</Item>
        <Item>Laurent Burst</Item>
        <Item>Jan Bolomey</Item>
      </List>

      <br />
      <H2>Videofilme</H2>
      <List>
        <Item>
          <Highlight>real Film GmbH</Highlight><br />
          Stefan Jung
        </Item>
        <Item>
          <Highlight>Regardez! Entertainment GmbH</Highlight><br />
          Bart Wasem<br />
          Matthias Zurbriggen
        </Item>
        <Item>Martin Skalsky</Item>
        <Item>Marco di Nardo</Item>
        <Item>Risa Chiappori</Item>
        <Item>Severin Bärenbold</Item>
        <Item>Christian Rösch</Item>
        <Item>Fabian Scheffold</Item>
        <Item>Richard Höchner</Item>
        <Item>Christof Moser</Item>
        <Item>Yvonne Kunz</Item>
        <Item>Clara Vuillemin</Item>
      </List>

      <br />
      <H2>Copyright</H2>
      <P>
        Das Copyright für sämtliche Inhalte dieser Website liegt bei der Project R Genossenschaft.
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
