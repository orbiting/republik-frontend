import React from 'react'
import { compose, graphql } from 'react-apollo'
import { css } from 'glamor'

import { linkRule } from '@project-r/styleguide'

import { APP_OPTIONS } from '../../lib/constants'
import { focusSelector } from '../../lib/utils/scroll'
import { Router, Link } from '../../lib/routes'
import withMe from '../../lib/apollo/withMe'
import query from './belongingsQuery'
import withInNativeApp from '../../lib/withInNativeApp'
import withT from '../../lib/withT'
import { shouldIgnoreClick } from '../../lib/utils/link'

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

export const AnchorLink = ({ children, id }) => (
  <a
    {...linkRule}
    href={'/konto#' + id}
    onClick={e => {
      if (shouldIgnoreClick(e)) {
        return
      }

      e.preventDefault()
      const fragment = '#' + id
      Router.pushRoute('/konto' + fragment).then(() => {
        focusSelector(fragment, 'beginning')
      })
    }}
  >
    {children}
  </a>
)

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
        <Link route='access' passHref>
          <a {...linkRule}>{t('Account/Access/Campaigns/title')}</a>
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
      <Link route='subscriptionsSettings' passHref>
        <a {...linkRule}>{t('account/notificationOptions/title')}</a>
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
