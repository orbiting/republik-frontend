import React from 'react'
import withData from '../lib/apollo/withData'
import Frame from '../components/Frame'

import {
  STATIC_BASE_URL
} from '../lib/constants'

import {
  A, Interaction
} from '@project-r/styleguide'

const {H1, H2, P} = Interaction

export default withData(({url}) => {
  const meta = {
    title: 'Medien',
    description: ''
  }
  return (
    <Frame url={url} meta={meta}>
      <H1>
        {meta.title}
      </H1>
      <br />
      <P>
        Für Auskünfte kontaktieren Sie Susanne&nbsp;Sugimoto, Geschäftsführung und Kommunikation:
      </P>
      <P>
        <A href='tel:+41788977028'>+41 79 787 47 65</A><br />
        <A href='mailto:susanne.sugimoto@project-r.construction'>
          susanne.sugimoto@project-r.construction
        </A>
      </P>
      <P style={{margin: '20px 0'}}>
        <A download href={`${STATIC_BASE_URL}/static/media/170427_1841.zip`}>
          Medienbilder und Logo herunterladen
        </A><br />
        (Stand 27. April 18 Uhr)
      </P>
      <P>
        Republik ist ein Projekt von Project R.
      </P>
      <H2 style={{marginTop: 20}}>
        Über Project&nbsp;R
      </H2>
      <P>
        Die Project R Genossenschaft nimmt sich der Weiterentwicklung und Stärkung des Journalismus an. Dazu gehören Projekte wie der Bau einer digitalen Open-Source-Infrastruktur, das Durchführen von Veranstaltungen und Debatten, das Entwickeln neuer journalistischer Formate sowie die Ausbildung von jungen Journalistinnen und Journalisten.
      </P>
      <H2 style={{marginTop: 20}}>
        Anschrift
      </H2>
      <P>
        Republik<br />
        c/o Hotel Rothaus<br />
        Sihlhallenstrasse 1<br />
        8004 Zürich
      </P>
    </Frame>
  )
})
