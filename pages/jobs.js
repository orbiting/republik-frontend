import React from 'react'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'

import Frame from '../components/Frame'
import ImageCover from '../components/ImageCover'

import { Editorial } from '@project-r/styleguide'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const { P } = Editorial

export default withData(
  withT(({ url, t }) => {
    const meta = {
      pageTitle: t('jobs/pageTitle'),
      title: t('jobs/title'),
      description: t('jobs/description'),
      image: `${CDN_FRONTEND_BASE_URL}/static/team/bern.jpg`,
      url: `${PUBLIC_BASE_URL}${url.pathname}`
    }

    return (
      <Frame
        url={url}
        meta={meta}
        cover={
          <ImageCover
            image={{
              src: meta.image,
              alt: 'Taufe des Namen und Logo in Bern'
            }}
          />
        }
      >
        <P>Zur Zeit haben wir keine offenen Stellen.</P>

      </Frame>
    )
  })
)
