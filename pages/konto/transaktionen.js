import React from 'react'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import Frame from '../../components/Frame'
import withT from '../../lib/withT'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import AccountTabs from '../../components/Account/AccountTabs'
import { AccountPageContainer } from '../../components/Account/Elements'
import PledgeList from '../../components/Account/PledgeList'

const TransactionPage = ({ t }) => {
  const { query, pathname } = useRouter()
  return (
    <Frame
      raw
      meta={{
        title: t('pages/account/transactions/title')
      }}
    >
      <AccountPageContainer>
        <AccountTabs pathname={pathname} t={t} />
        <PledgeList highlightId={query.id} />
      </AccountPageContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT)(TransactionPage))
