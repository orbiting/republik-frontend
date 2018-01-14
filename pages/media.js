import React from 'react'
import withData from '../lib/apollo/withData'
import Frame from '../components/Frame'

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
        <A href='tel:+41788977028'>+41 79 787 47 65</A>{' / '}
        <A href='mailto:susanne.sugimoto@republik.ch'>
          susanne.sugimoto@republik.ch
        </A>
      </P>
      <P style={{margin: '20px 0'}}>
        <A href='https://drive.google.com/open?id=14YQ_IR6HRoXUwrfjc_KJQ_lGjMXjaFO1'>
          Medienbilder und Logo herunterladen
        </A>
      </P>
      <P>
        Republik ist ein Projekt der{' '}
        <A href='https://project-r.construction'>
           Project R Genossenschaft
        </A>
        .
      </P>
      <H2 style={{marginTop: 20}}>
        Anschrift
      </H2>
      <P>
        Republik AG<br />
        Sihlhallenstrasse 1<br />
        8004 Zürich
      </P>
    </Frame>
  )
})
