import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import withT from '../lib/withT'

import Frame, { MainContainer, Content } from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { Editorial, Interaction } from '@project-r/styleguide'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const { P } = Editorial
const { H1 } = Interaction

export default compose(
  withT,
  withRouter
)(({ router, t }) => {
  const meta = {
    pageTitle: t('jobs/pageTitle'),
    title: t('jobs/title'),
    description: t('jobs/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/team/bern.jpg`,
    url: `${PUBLIC_BASE_URL}${router.pathname}`
  }

  return (
    <Frame
      meta={meta}
      raw
    >
      <ImageCover
        image={{
          src: meta.image,
          alt: 'Taufe des Namen und Logo in Bern'
        }}
      />
      <MainContainer>
        <Content>
          <H1>Offene Stellen</H1>
          <P>Zur Zeit haben wir keine offenen Stellen.</P>
        </Content>
      </MainContainer>
    </Frame>
  )
})
