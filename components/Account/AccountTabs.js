import React, { useState } from 'react'
import { css } from 'glamor'
import Link from 'next/link'
import {
  Scroller,
  TabButton,
  mediaQueries,
  useColorContext
} from '@project-r/styleguide'

const styles = {
  container: css({
    margin: '24px -15px 24px -15px',
    [mediaQueries.mUp]: {
      margin: '48px -15px 48px -15px'
    }
  })
}

const TabArray = [
  { path: '/konto', name: 'MEMBERSHIP' },
  { path: '/konto/newsletter', name: 'NEWSLETTER' },
  { path: '/konto/benachrichtigungen', name: 'NOTIFICATIONS' },
  { path: '/konto/einstellungen', name: 'SETTINGS' },
  { path: '/konto/transaktionen', name: 'TRANSACTIONS' }
]

const AccountTabs = ({ pathname, t }) => {
  const [activeChildIndex, setActiveChildIndex] = useState(
    TabArray.findIndex(item => item.path === pathname)
  )
  const [colorScheme] = useColorContext()
  return (
    <div {...styles.container}>
      <Scroller innerPadding={15} activeChildIndex={activeChildIndex}>
        {TabArray.map((n, i) => (
          <Link href={n.path} scroll={false} passHref key={n.name}>
            <TabButton
              key={n.name}
              text={t(`account/tabs/${n.name}`)}
              isActive={n.path === pathname}
              onClick={() => setActiveChildIndex(i)}
            />
          </Link>
        ))}
        <div
          {...colorScheme.set('borderColor', 'divider')}
          style={{ flex: 1, borderBottomStyle: 'solid', borderBottomWidth: 1 }}
        />
      </Scroller>
    </div>
  )
}

export default AccountTabs
