import React, { ReactNode } from 'react'
import { css } from 'glamor'
import { mediaQueries } from '@project-r/styleguide'
import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT } from '../constants'

const styles = {
  accountAnchor: css({
    display: 'block',
    visibility: 'hidden',
    position: 'relative',
    top: -(HEADER_HEIGHT_MOBILE + 20),
    [mediaQueries.mUp]: {
      top: -(HEADER_HEIGHT + 20)
    }
  })
}

const AccountAnchor = ({
  children,
  id
}: {
  children: ReactNode
  id: string
}) => {
  return (
    <div style={{ marginBottom: 64 }}>
      <a {...styles.accountAnchor} id={id} />
      {children}
    </div>
  )
}

export default AccountAnchor
