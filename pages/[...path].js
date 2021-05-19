import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Loader from '../components/Loader'
import Frame from '../components/Frame'

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

export default Page
