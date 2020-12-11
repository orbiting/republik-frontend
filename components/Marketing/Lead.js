import React from 'react'
import { css } from 'glamor'
import {
  Container,
  Logo,
  mediaQueries,
  fontStyles
} from '@project-r/styleguide'

export default function LeadSection({ t, isMobile }) {
  return (
    <Container {...styles.container}>
      <Logo style={{ maxWidth: '90%' }} width={isMobile ? 290 : 350} />
      <h2 {...styles.lead}>{t('marketing/page/lead/subtitle')}</h2>
    </Container>
  )
}

const styles = {
  container: css({
    height: 360,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [mediaQueries.mUp]: {
      height: 500
    }
  }),
  lead: css({
    ...fontStyles.serifRegular19,
    textAlign: 'center',
    maxWidth: 960,
    [mediaQueries.mUp]: {
      ...fontStyles.serifRegular25
    }
  })
}
