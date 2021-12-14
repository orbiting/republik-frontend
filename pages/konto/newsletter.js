import React from 'react'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import { Interaction } from '@project-r/styleguide'

import withT from '../../lib/withT'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import Frame, { MainContainer } from '../../components/Frame'

import AccountTabs from '../../components/Account/AccountTabs'
import AccountSection from '../../components/Account/AccountSection'
import NewsletterSubscriptions from '../../components/Account/NewsletterSubscriptions'

const SettingsPage = ({ t }) => {
  const { pathname } = useRouter()
  return (
    <Frame raw>
      <MainContainer>
        <AccountTabs pathname={pathname} t={t} />
        <AccountSection
          id='newsletter'
          title={t('account/newsletterSubscriptions/title')}
        >
          <NewsletterSubscriptions />
        </AccountSection>
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT)(SettingsPage))
