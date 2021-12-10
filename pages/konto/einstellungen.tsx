import React from 'react'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import { Interaction } from '@project-r/styleguide'

import withT from '../../lib/withT'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import Frame, { MainContainer } from '../../components/Frame'

import AccountTabs from '../../components/Account/AccountTabs'
import AccountAnchor from '../../components/Account/AccountAnchor'
import ProgressSettings from '../../components/Account/ProgressSettings'
import AuthSettings from '../../components/Account/AuthSettings'

import { APP_OPTIONS } from '../../lib/constants'

const SettingsPage = ({ t }: { t: (s: any) => string }) => {
  const { pathname } = useRouter()
  return (
    <Frame raw>
      <MainContainer>
        <AccountTabs pathname={pathname} t={t} />

        <AccountAnchor id='position'>
          <Interaction.H2>{t('account/progress/title')}</Interaction.H2>
          <ProgressSettings />
        </AccountAnchor>

        {APP_OPTIONS && (
          <AccountAnchor id='anmeldung'>
            <Interaction.H2>{t('account/authSettings/title')}</Interaction.H2>
            <AuthSettings />
          </AccountAnchor>
        )}
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT)(SettingsPage))
