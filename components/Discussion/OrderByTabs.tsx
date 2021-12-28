import Link from 'next/link'
import { rerouteDiscussion } from './DiscussionLink'
import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { Scroller, TabButton } from '@project-r/styleguide'

type Props = {
  t: any
  resolvedOrderBy: string
  availableOrderBy: string[]
}

const OrderByTabs = ({
  t,
  resolvedOrderBy,
  availableOrderBy = []
}: Props): ReactElement => {
  const router = useRouter()

  return (
    <>
      <Scroller>
        {availableOrderBy.map(item => {
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
