import React from 'react'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import Frame from '../../components/Frame'
import Account from '../../components/Account'
import withT from '../../lib/withT'
import Merci from '../../components/Pledge/Merci'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import AccountTabs from '../../components/Account/AccountTabs'
import { Content, MainContainer } from '../../components/Frame'

const AccountPage = ({ t }: { t: (s: any) => string }) => {
  const meta = {
    title: t('pages/account/title')
  }
  const { query, pathname } = useRouter()
  const postPledge = query.id || query.claim
  return (
    <Frame meta={meta} raw>
      {postPledge && <Merci query={query} />}
      <MainContainer>
        <AccountTabs pathname={pathname} t={t} />
        <Account query={query} merci={postPledge} />
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT)(AccountPage))
