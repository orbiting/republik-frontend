import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const Article = dynamic(() => import('../../components/Article/Page'), {
  ssr: true
})
const Profile = dynamic(() => import('../../components/Profile/Page'), {
  ssr: true
})

const Page = props => {
  const router = useRouter()
  const {
    query: { slug }
  } = router
  const Component = slug.startsWith('~') ? Profile : Article
  return <Component {...props} />
}

export default Page
