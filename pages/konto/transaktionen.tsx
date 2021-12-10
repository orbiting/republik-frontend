import React from 'react'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import Frame from '../../components/Frame'
import withT from '../../lib/withT'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import AccountTabs from '../../components/Account/AccountTabs'
import { MainContainer } from '../../components/Frame'
import PledgeList from '../../components/Account/PledgeList'

const TransactionPage = ({ t }: { t: (s: any) => string }) => {
  const { query, pathname } = useRouter()
  return (
    <Frame raw>
      <MainContainer>
        <AccountTabs pathname={pathname} t={t} />
        <PledgeList highlightId={query.id} />
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT)(TransactionPage))
