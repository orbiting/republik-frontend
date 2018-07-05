import React from 'react'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'

import Frame from '../components/Frame'
import Portrait from '../components/Portrait'
import ImageCover from '../components/ImageCover'

import { Lead } from '@project-r/styleguide'

import team from '../lib/team'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

export default withData(
  withT(({ url, t }) => {
    const meta = {
      pageTitle: t('crew/pageTitle'),
      title: t('crew/title'),
      description: t('crew/description'),
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
        <Lead>{t('crew/lead')}</Lead>
        {team.map((person, i) => (
          <Portrait key={i} {...person} odd={!(i % 2)} />
        ))}
      </Frame>
    )
  })
)
