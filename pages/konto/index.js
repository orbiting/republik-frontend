import React from 'react'
import { css } from 'glamor'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { mediaQueries, A, Interaction } from '@project-r/styleguide'

import Frame from '../../components/Frame'
import Merci from '../../components/Pledge/Merci'
import withT from '../../lib/withT'
import { withMembership } from '../../components/Auth/checkRoles'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'
import AccountTabs from '../../components/Account/AccountTabs'
import AccountSection from '../../components/Account/AccountSection'
import { MainContainer } from '../../components/Frame'
import Memberships from '../../components/Account/Memberships'
import { HintArea } from '../../components/Account/Elements'
import NameAddress from '../../components/Account/UserInfo/NameAddress'
import UpdateEmail, { UserEmail } from '../../components/Account/UserInfo/Email'

const { Emphasis } = Interaction

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      gap: 32
    }
  }),
  column: css({ flex: 1 })
}

const AccountPage = ({ t, me, isMember }) => {
  const meta = {
    title: t('pages/account/title')
  }
  const { pathname, query } = useRouter()
  const postPledge = query.id || query.claim

  const hasMemberships = me?.memberships && !!me?.memberships.length
  const acceptedStatue =
    me.pledges &&
    !!me.pledges.length &&
    !!me.pledges.find(
      pledge =>
        pledge.package.name !== 'MONTHLY_ABO' &&
        pledge.package.name !== 'DONATE'
    )
  return (
    <Frame meta={meta} raw>
      <MainContainer>
        {postPledge && <Merci query={query} />}

        <AccountTabs pathname={pathname} t={t} />
        <div {...styles.container}>
          {isMember && (
            <div {...styles.column}>
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
            </div>
          )}

          {true && (
            <div {...styles.column}>
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
            </div>
          )}
        </div>
        <Memberships />
        <AccountSection id='account' title={t('Account/Update/title')}>
          <div style={{ marginBottom: 24 }}>
            <UserEmail />
            <UpdateEmail />
          </div>
          <NameAddress
            acceptedStatue={acceptedStatue}
            hasMemberships={hasMemberships}
          />
        </AccountSection>
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withT, withMembership)(AccountPage))
