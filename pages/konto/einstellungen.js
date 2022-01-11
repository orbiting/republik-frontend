import React from 'react'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'

import withT from '../../lib/withT'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import Frame, { MainContainer } from '../../components/Frame'
import AccountTabs from '../../components/Account/AccountTabs'
import AccountSection from '../../components/Account/AccountSection'
import ProgressSettings from '../../components/Account/ProgressSettings'
import AuthSettings from '../../components/Account/AuthSettings'

import { APP_OPTIONS } from '../../lib/constants'

const SettingsPage = ({ t }) => {
  const { pathname } = useRouter()
  return (
    <Frame raw>
      <MainContainer>
        <AccountTabs pathname={pathname} t={t} />

        <AccountSection id='position' title={t('account/progress/title')}>
          <ProgressSettings />
        </AccountSection>

        {APP_OPTIONS && (
          <AccountSection
            id='anmeldung'
            title={t('account/authSettings/title')}
          >
            <AuthSettings />
          </AccountSection>
        )}
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT)(SettingsPage))
