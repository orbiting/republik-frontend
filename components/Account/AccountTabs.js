import React from 'react'
import { css } from 'glamor'
import Link from 'next/link'
import { Scroller, TabButton, mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    margin: '24px 0',
    [mediaQueries.mUp]: {
      margin: '48px 0 24px 0'
    }
  })
}

const AccountTabs = ({ pathname, t }) => {
  console.log(pathname)
  return (
    <div {...styles.container}>
      <Scroller>
        {[
          { path: '/konto', name: 'MEMBERSHIP' },
          { path: '/konto/newsletter', name: 'NEWSLETTER' },
          { path: '/benachrichtigungen/einstellungen', name: 'NOTIFICATIONS' },
          { path: '/konto/einstellungen', name: 'SETTINGS' },
          { path: '/konto/transaktionen', name: 'TRANSACTIONS' }
        ].map((n, i) => (
          <Link href={n.path} scroll={false} passHref key={n.name}>
            <TabButton
              key={n.name}
              text={t(`account/tabs/${n.name}`)}
              isActive={n.path === pathname}
            />
          </Link>
        ))}
      </Scroller>
    </div>
  )
}

export default AccountTabs
