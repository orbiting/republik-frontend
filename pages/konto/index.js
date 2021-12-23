import React from 'react'
import { css } from 'glamor'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { mediaQueries, A, Interaction } from '@project-r/styleguide'

import Frame from '../../components/Frame'
import withT from '../../lib/withT'
import { withMembership } from '../../components/Auth/checkRoles'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import AccountTabs from '../../components/Account/AccountTabs'
import AccountSection from '../../components/Account/AccountSection'
import { MainContainer } from '../../components/Frame'
import { UserEmail } from '../../components/Account/UserInfo/Email'
import { EditButton, HintArea } from '../../components/Account/Elements'

const { Emphasis, P } = Interaction

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column-reverse',
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    }
  }),
  column: css({
    flex: 1
  })
}

const AccountPage = ({ t, me, isMember }) => {
  const meta = {
    title: t('pages/account/title')
  }
  const { pathname } = useRouter()
  const hasActiveMemberships =
    me.memberships &&
    !!me.memberships.length &&
    me.memberships.some(m => m.active)
  return (
    <Frame meta={meta} raw>
      <MainContainer>
        <AccountTabs pathname={pathname} t={t} />
        <div {...styles.container}>
          <div {...styles.column}>
            <AccountSection id='aboutme' title={t('Account/Update/title')}>
              <UserEmail />
              <EditButton onClick={() => {}}>
                {t('Account/Update/email/edit')}
              </EditButton>
            </AccountSection>
          </div>

          <div {...styles.column}>
            {isMember && (
              <AccountSection
                id='onboarding'
                title={t('Account/Onboarding/title')}
              >
                <HintArea>
                  {t.elements('Account/Onboarding/text', {
                    link: (
                      <Link key='link' href='/einrichten' passHref>
                        <A>
                          <Emphasis>{t('Account/Onboarding/link')}</Emphasis>
                        </A>
                      </Link>
                    )
                  })}
                </HintArea>
              </AccountSection>
            )}
            {true && (
              <AccountSection
                id='teilen'
                title={t('Account/Access/Campaigns/title')}
              >
                <HintArea>
                  {t.elements('Account/Access/Legacy/text', {
                    link: (
                      <Link key='link' href='/teilen' passHref>
                        <A>
                          <Emphasis>{t('Account/Access/Legacy/link')}</Emphasis>
                        </A>
                      </Link>
                    )
                  })}
                </HintArea>
              </AccountSection>
            )}
          </div>
        </div>
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT, withMembership)(AccountPage))
