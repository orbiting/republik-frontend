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
  STATIC_BASE_URL,
  SALES_UP,
  CROWDFUNDING_NAME
} from '../lib/constants'

const endVideo = {
  hls:
    'https://player.vimeo.com/external/215798102.m3u8?s=b3730f7f6332985771865f3b85c13aeae93223b1',
  mp4:
    'https://player.vimeo.com/external/215798102.hd.mp4?s=bdc8421b7d1c2a04fcf9521655332e54c7c4c039&profile_id=175',
  subtitles: '/static/subtitles/main.vtt',
  poster: `${STATIC_BASE_URL}/static/video/main.jpg`
}

const PLEDGE_CROWDFUNDING_NAME = SALES_UP || CROWDFUNDING_NAME

const IndexPage = ({ url, t, isAuthorized }) => {
  const meta = {
    title: t('pages/magazine/title')
  }
  if (isAuthorized) {
    return <Front url={url} />
  }
  return (
    <Frame
      raw
      url={url}
      meta={meta}
      cover={
        <VideoCover
          src={endVideo}
          endScroll={0.99}
          cursor
          limited
          autoPlay
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
