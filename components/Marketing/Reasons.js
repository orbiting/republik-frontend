import React from 'react'
import { css } from 'glamor'

import {
  TeaserFrontTileRow,
  TeaserFrontTile,
  fontStyles,
  Editorial,
  Center,
  Button,
  mediaQueries
} from '@project-r/styleguide'

const Reasons = ({ t }) => {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 15 }}>
      <TeaserFrontTileRow columns={3}>
        <TeaserFrontTile align='top' padding={'0 5%'}>
          <h2 {...styles.title}>{t('marketing/page/reasons/1/title')}</h2>
          <Editorial.P>{t('marketing/page/reasons/1/text')}</Editorial.P>
        </TeaserFrontTile>
        <TeaserFrontTile align='top' padding={'0 5%'}>
          <h2 {...styles.title}>{t('marketing/page/reasons/2/title')}</h2>
          <Editorial.P>{t('marketing/page/reasons/2/text')}</Editorial.P>
        </TeaserFrontTile>
        <TeaserFrontTile align='top' padding={'0 5%'}>
          <h2 {...styles.title}>{t('marketing/page/reasons/3/title')}</h2>
          <Editorial.P>{t('marketing/page/reasons/3/text')}</Editorial.P>
        </TeaserFrontTile>
      </TeaserFrontTileRow>
      <Center {...styles.buttons}>
        <Button
          style={{ marginBottom: 20 }}
          href='/angebote?package=ABO'
          primary
        >
          {t('marketing/join/ABO/button/label')}
        </Button>
        <Button
          style={{ marginBottom: 20 }}
          href='/angebote?package=MONTHLY_ABO'
        >
          {t('marketing/join/MONTHLY_ABO/button/label')}
        </Button>
      </Center>
    </div>
  )
}

const styles = {
  title: css({
    ...fontStyles.sansSerifMedium24
  }),
  buttons: css({
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    }
  })
}

export default Reasons
