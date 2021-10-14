import React from 'react'
import Front from '../../components/Front'
import { useRouter } from 'next/router'

const FrontPreviewPage = (): JSX.Element => {
  const router = useRouter()

  return (
    <Front
      shouldAutoRefetch
      hasOverviewNav
      extractId={router.query.extractId}
      finite
    />
  )
}

export default FrontPreviewPage
