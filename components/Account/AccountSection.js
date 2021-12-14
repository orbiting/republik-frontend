import React from 'react'
import { css } from 'glamor'
import { mediaQueries, Interaction } from '@project-r/styleguide'
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

const AccountSection = ({ children, id, title }) => {
  return (
    <div style={{ marginBottom: 64 }}>
      <Interaction.H2 style={{ marginBottom: 16 }}>{title}</Interaction.H2>
      <a {...styles.accountAnchor} id={id} />
      {children}
    </div>
  )
}

export default AccountSection
