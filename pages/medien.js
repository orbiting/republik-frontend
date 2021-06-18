import React from 'react'
import Frame from '../components/Frame'

import { A, Interaction } from '@project-r/styleguide'

const { H1, H2, P } = Interaction

const MediaPage = () => {
  const meta = {
    title: 'Medien',
    description: ''
  }
  return (
    <Frame meta={meta}>
      <H1>{meta.title}</H1>
      <br />
      <P>Für Auskünfte kontaktieren Sie uns:</P>
      <P>
        <A href='tel:+41797874765'>+41 79 787 47 65</A>,{' '}
        <A href='mailto:kontakt@republik.ch'>kontakt@republik.ch</A>
      </P>
      <P style={{ margin: '20px 0' }}>
        <A href='https://drive.google.com/open?id=14YQ_IR6HRoXUwrfjc_KJQ_lGjMXjaFO1'>
          Medienbilder und Logo herunterladen
        </A>
      </P>
      <P>
        Republik ist ein Projekt der{' '}
        <A href='https://project-r.construction'>Project R Genossenschaft</A>.
      </P>
      <H2 style={{ marginTop: 20 }}>Anschrift</H2>
      <P>
        Republik AG
        <br />
        Sihlhallenstrasse 1<br />
        8004 Zürich
      </P>
    </Frame>
  )
}

export default MediaPage
