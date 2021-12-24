import Link from 'next/link'
import { rerouteDiscussion } from './DiscussionLink'
import React from 'react'
import { useRouter } from 'next/router'
import { Scroller, TabButton } from '@project-r/styleguide'

const OrderByTabs = ({ t, resolvedOrderBy, board }) => {
  const router = useRouter()

  return (
    <>
      <Scroller>
        {['HOT', 'DATE', 'VOTES', 'REPLIES']
          .filter(item => (board ? true : item !== 'HOT'))
          .map(item => {
            return (
              <Link
                href={rerouteDiscussion(router, {
                  order: item
                })}
                scroll={false}
                passHref
                key={item}
              >
                <TabButton
                  border={false}
                  text={t(`components/Discussion/OrderBy/${item}`)}
                  isActive={item === resolvedOrderBy}
                />
              </Link>
            )
          })}
      </Scroller>
    </>
  )
}

export default OrderByTabs
