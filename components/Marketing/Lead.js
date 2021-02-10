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
      <h2 {...styles.lead}>{t('marketing/page/lead/subtitle')}</h2>
    </Container>
  )
}

const styles = {
  container: css({
    height: '70vh',
    minHeight: 360,
    maxHeight: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [mediaQueries.mUp]: {
      height: '70vh',
      minHeight: 600,
      maxHeight: 'none'
    }
  }),
  lead: css({
    ...fontStyles.serifRegular,
    fontSize: 24,
    lineHeight: '36px',
    textAlign: 'center',
    width: '90%',
    maxWidth: 960,
    [mediaQueries.mUp]: {
      fontSize: 36,
      lineHeight: '48px'
    }
  }),
  logo: css({
    width: 200,
    [mediaQueries.mUp]: {
      width: 400
    }
  })
}
