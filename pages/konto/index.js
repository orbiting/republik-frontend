import React from 'react'
import { css } from 'glamor'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import { Button, mediaQueries } from '@project-r/styleguide'

import Frame from '../../components/Frame'
import withT from '../../lib/withT'
import { withMembership } from '../../components/Auth/checkRoles'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import AccountTabs from '../../components/Account/AccountTabs'
import AccountSection from '../../components/Account/AccountSection'
import Onboarding from '../../components/Account/Onboarding'
import { MainContainer } from '../../components/Frame'

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column-reverse',
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    }
  }),
  section: css({
    flex: 1
  })
}

const AccountPage = ({ t, isMember }) => {
  const meta = {
    title: t('pages/account/title')
  }
  const { pathname } = useRouter()
  return (
    <Frame meta={meta} raw>
      <MainContainer>
        <AccountTabs pathname={pathname} t={t} />
        <div {...styles.container}>
          <div {...styles.section}>
            <AccountSection
              id='onboarding'
              title={t('Account/Onboarding/title')}
            >
              <Button>editieren</Button>
            </AccountSection>
          </div>

          <div {...styles.section}>
            {isMember && (
              <AccountSection
                id='onboarding'
                title={t('Account/Onboarding/title')}
              >
                <Onboarding />
              </AccountSection>
            )}
          </div>
        </div>
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT, withMembership)(AccountPage))
