import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import { Editorial, A } from '@project-r/styleguide'

import withT from '../lib/withT'

import Frame, { MainContainer, Content } from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { PUBLIC_BASE_URL } from '../lib/constants'

const { P } = Editorial

export default compose(
  withT,
  withRouter
)(({ router, t }) => {
  const meta = {
    pageTitle: t('jobs/pageTitle'),
    title: t('jobs/title'),
    description: t('jobs/description'),
    image:
      'https://cdn.republik.space/s3/republik-assets/assets/images/jobs.jpg?resize=2000x',
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }

  return (
    <Frame meta={meta} raw>
      <ImageCover
        image={{
          src: meta.image,
          alt:
            'Weitwinkelfoto von vielen Republik-Mitarbeitern und Freunden mit brennender Geburtstagstorte in Mitte.'
        }}
      />
      <MainContainer>
        <Content>
          <P>
            Die Republik ist ein täglich erscheinendes digitales, werbefreies
            Magazin für Politik, Wirtschaft, Gesellschaft und Kultur. Wir sind
            getrieben von unserem Willen, eine gewichtige unabhängige Stimme in
            der Schweizer Medienlandschaft zu sein. Werde Teil einer{' '}
            <A href='/impressum'>
              interdisziplinären und leidenschaftlichen Crew
            </A>
            .
          </P>

          <P>
            Offenen Stellen:{' '}
            <A href='https://www.republik.ch/2020/05/04/verstaerken-sie-unsere-software-entwicklung'>
              Verstärken Sie unsere Software­­entwicklung
            </A>
            .
          </P>
        </Content>
      </MainContainer>
    </Frame>
  )
})
