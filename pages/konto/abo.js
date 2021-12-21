import React from 'react'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import Frame from '../../components/Frame'
import Memberships from '../../components/Account/Memberships'
import withT from '../../lib/withT'
import Merci from '../../components/Pledge/Merci'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import AccountTabs from '../../components/Account/AccountTabs'
import { MainContainer } from '../../components/Frame'

const AccountPage = ({ t }) => {
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
        <Memberships query={query} merci={postPledge} />
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT)(AccountPage))
