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
      <Logo width={isMobile ? 320 : 350} />
      <h1 {...styles.lead}>{t('marketing/page/lead/subtitle')}</h1>
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
    ...fontStyles.serifRegular25,
    textAlign: 'center',
    maxWidth: 960
  })
}
