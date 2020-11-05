import React from 'react'
import { css } from 'glamor'
import {
  Container,
  Logo,
  mediaQueries,
  fontStyles
} from '@project-r/styleguide'

export default function LeadSection({ t }) {
  return (
    <Container {...styles.container}>
      <div {...styles.logo}>
        <Logo />
      </div>
      <h1 {...styles.lead}>{t('marketing/overview/title')}</h1>
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
  logo: css({
    width: 320,
    [mediaQueries.mUp]: {
      width: 350
    }
  }),
  lead: css({
    ...fontStyles.serifRegular25,
    textAlign: 'center'
  })
}
