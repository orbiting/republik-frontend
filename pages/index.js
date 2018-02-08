import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Front from '../components/Front'
import Marketing from '../components/Marketing'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'
import VideoCover from '../components/VideoCover'
import withMembership from '../components/Auth/withMembership'

import {
  SALES_UP,
  CROWDFUNDING_NAME,
  PUBLIC_BASE_URL,
  CDN_FRONTEND_BASE_URL
} from '../lib/constants'

const endVideo = {
  hls:
    'https://player.vimeo.com/external/250999239.m3u8?s=54d7c0e48ea4fcf914cfb34c580081f544618da2',
  mp4:
    'https://player.vimeo.com/external/250999239.hd.mp4?s=7d6d2504261c5341158efe3d882a71eb23381302&profile_id=174',
  thumbnail: `${CDN_FRONTEND_BASE_URL}/static/video/front.jpg`
}

const PLEDGE_CROWDFUNDING_NAME = SALES_UP || CROWDFUNDING_NAME

const IndexPage = ({ url, t, isAuthorized }) => {
  if (isAuthorized) {
    // does it's own meta
    return <Front url={url} />
  }
  const meta = {
    pageTitle: t('pages/index/pageTitle'),
    title: t('pages/index/title'),
    description: t('pages/index/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}/`
  }
  return (
    <Frame
      raw
      url={url}
      meta={meta}
      headerInline
      cover={
        <VideoCover
          src={endVideo}
          cursor={false}
          limited
          backgroundAutoPlay
          muted
          loop
        />
      }
    >
      <Marketing crowdfundingName={PLEDGE_CROWDFUNDING_NAME} />
    </Frame>
  )
}

export default compose(
  withData,
  withMembership,
  withT
)(IndexPage)
