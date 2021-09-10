import React from 'react'
import { flowRight as compose } from 'lodash'
import { graphql } from '@apollo/client/react/hoc'
import { css } from 'glamor'

import { A } from '@project-r/styleguide'

import { APP_OPTIONS } from '../../lib/constants'
import { focusSelector } from '../../lib/utils/scroll'
import withMe from '../../lib/apollo/withMe'
import query from './belongingsQuery'
import withInNativeApp from '../../lib/withInNativeApp'
import withT from '../../lib/withT'
import { shouldIgnoreClick } from '../../lib/utils/link'
import { useRouter } from 'next/router'
import Link from 'next/link'

const styles = {
  anchorList: css({
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    paddingBottom: 80,
    overflow: 'hidden'
  }),
  anchorListItem: css({
    float: 'left',
    marginRight: 20,
    lineHeight: '2em'
  })
}

export const AnchorLink = ({ children, id }) => {
  const router = useRouter()
  return (
    <A
      href={'/konto#' + id}
      onClick={e => {
        if (shouldIgnoreClick(e)) {
          return
        }

        e.preventDefault()
        const fragment = '#' + id
        router.push('/konto' + fragment).then(() => {
          focusSelector(fragment, 'beginning')
        })
      }}
    >
      {children}
    </A>
  )
}

const Anchors = ({ memberships, me, t, inNativeIOSApp }) => (
  <ul {...styles.anchorList}>
    {!inNativeIOSApp && memberships && memberships.length > 0 && (
      <li {...styles.anchorListItem}>
        <AnchorLink id='abos'>
          {t.pluralize('memberships/title', { count: memberships.length })}
        </AnchorLink>
      </li>
    )}
    {me && me.accessCampaigns && me.accessCampaigns.length > 0 && (
      <li {...styles.anchorListItem}>
        <Link href='/teilen' passHref>
          <A>{t('Account/Access/Campaigns/title')}</A>
        </Link>
      </li>
    )}
    <li {...styles.anchorListItem}>
      <AnchorLink id='email'>{t('Account/Update/email/label')}</AnchorLink>
    </li>
    <li {...styles.anchorListItem}>
      <AnchorLink id='account'>{t('Account/Update/title')}</AnchorLink>
    </li>
    {!inNativeIOSApp && (
      <li {...styles.anchorListItem}>
        <AnchorLink id='pledges'>{t('account/pledges/title')}</AnchorLink>
      </li>
    )}
    <li {...styles.anchorListItem}>
      <AnchorLink id='newsletter'>
        {t('account/newsletterSubscriptions/title')}
      </AnchorLink>
    </li>
    <li {...styles.anchorListItem}>
      <Link href='/benachrichtigungen/einstellungen' passHref>
        <A>{t('account/notificationOptions/title')}</A>
      </Link>
    </li>
    <li {...styles.anchorListItem}>
      <AnchorLink id='position'>{t('account/progress/title')}</AnchorLink>
    </li>
    {APP_OPTIONS && (
      <li {...styles.anchorListItem}>
        <AnchorLink id='anmeldung'>
          {t('account/authSettings/title')}
        </AnchorLink>
      </li>
    )}
  </ul>
)

export default compose(
  withMe,
  graphql(query, {
    props: ({ data }) => ({
      loading: data.loading || !data.me,
      error: data.error,
      memberships: !data.loading && data.me && data.me.memberships
    })
  }),
  withT,
  withInNativeApp
)(Anchors)
