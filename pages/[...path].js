import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Loader from '../components/Loader'
import Frame from '../components/Frame'
import { getRandomInt } from '../lib/utils/helpers'
import { MAX_PAYNOTE_SEED } from '../components/Article/PayNote'

const dynamicOptions = {
  loading: () => (
    <Frame>
      <Loader loading />
    </Frame>
  ),
  ssr: true
}

const Article = dynamic(
  () => import('../components/Article/Page'),
  dynamicOptions
)
const Profile = dynamic(
  () => import('../components/Profile/Page'),
  dynamicOptions
)

const Page = props => {
  const router = useRouter()
  const {
    query: { path }
  } = router
  const Component =
    path.length === 1 && path[0].startsWith('~') ? Profile : Article
  return <Component {...props} />
}

Page.getInitialProps = () => {
  return {
    payNoteTryOrBuy: Math.random(),
    payNoteSeed: getRandomInt(MAX_PAYNOTE_SEED)
  }
}

export default Page
