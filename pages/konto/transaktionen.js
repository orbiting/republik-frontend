import React from 'react'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import Frame from '../../components/Frame'
import withT from '../../lib/withT'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import AccountTabs from '../../components/Account/AccountTabs'
import { AccountEnforceMe } from '../../components/Account/Elements'
import PledgeList from '../../components/Account/PledgeList'

const TransactionPage = ({ t }) => {
  const { query, pathname } = useRouter()
  return (
    <Frame
      meta={{
        title: t('pages/account/transactions/title')
      }}
    >
      <AccountEnforceMe>
        <AccountTabs pathname={pathname} t={t} />
        <PledgeList highlightId={query.id} />
      </AccountEnforceMe>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT)(TransactionPage))
