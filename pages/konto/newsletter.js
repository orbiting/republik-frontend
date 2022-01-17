import React from 'react'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'

import withT from '../../lib/withT'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import Frame from '../../components/Frame'

import AccountTabs from '../../components/Account/AccountTabs'
import { AccountPageContainer } from '../../components/Account/Elements'
import NewsletterSubscriptions from '../../components/Account/NewsletterSubscriptions'
import { Interaction } from '@project-r/styleguide'

const SettingsPage = ({ t }) => {
  const { pathname } = useRouter()
  return (
    <Frame
      raw
      meta={{
        title: t('pages/account/newsletter/title')
      }}
    >
      <AccountPageContainer>
        <AccountTabs pathname={pathname} t={t} />
        <Interaction.P style={{ marginBottom: 20 }}>
          {t('pages/account/newsletter/lead')}
        </Interaction.P>
        <NewsletterSubscriptions />
      </AccountPageContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT)(SettingsPage))
